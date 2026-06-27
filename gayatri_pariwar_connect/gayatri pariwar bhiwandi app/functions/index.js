const functions = require("firebase-functions");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentWritten, onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const cloudinary = require('cloudinary').v2;
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { DateTime } = require("luxon");
const crypto = require("crypto");
const logger = require("firebase-functions/logger");
// Optimize to prevent CPU Quota Errors
setGlobalOptions({
    maxInstances: 1,
    memory: '256MiB',
});

admin.initializeApp();

// Set region to match your Firestore location
const region = "asia-south1";

// 1. Auto-publish scheduled news (runs every minute)
// ... (existing code)
exports.publishScheduledNews = onSchedule({
    schedule: "every 1 minutes",
    region: region
}, async (event) => {
    try {
        const now = admin.firestore.Timestamp.now();
        const db = admin.firestore();

        console.log(`[publishScheduledNews] Running at ${now.toDate().toISOString()}`);

        const scheduledNews = await db
            .collection("news")
            .where("status", "==", "scheduled")
            .where("scheduledAt", "<=", now)
            .get();

        console.log(`[publishScheduledNews] Found ${scheduledNews.size} news items to publish`);

        if (scheduledNews.empty) {
            console.log(`[publishScheduledNews] No scheduled news found`);
            return null;
        }

        const batch = db.batch();
        scheduledNews.docs.forEach((doc) => {
            console.log(`[publishScheduledNews] Publishing news: ${doc.id} - "${doc.data().title}"`);
            batch.update(doc.ref, {
                status: "published",
                updatedAt: now,
            });
        });

        await batch.commit();
        console.log(`[publishScheduledNews] Successfully published ${scheduledNews.size} news items`);

        return { success: true, count: scheduledNews.size };
    } catch (error) {
        console.error(`[publishScheduledNews] Error occurred:`, error);
        console.error(`[publishScheduledNews] Error message:`, error.message);
        console.error(`[publishScheduledNews] Stack trace:`, error.stack);
        throw error;
    }
});

// 2. Send Notification when News is Published
exports.sendNewsNotification = onDocumentWritten({
    document: "news/{newsId}",
    region: region
}, async (event) => {
    const newData = event.data?.after.exists ? event.data.after.data() : null;
    const oldData = event.data?.before.exists ? event.data.before.data() : null;

    if (newData && newData.status === "published") {
        if (oldData && oldData.status === "published") {
            return null;
        }

        const payload = {
            notification: {
                title: newData.title,
                body: newData.shortDescription,
                image: newData.imageUrl,
            },
            data: {
                type: "news",
                id: event.params.newsId,
                click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
        };

        return admin.messaging().sendToTopic("all_users", payload);
    }
    return null;
});

// 3. Send Notification when User is Invited to Group
exports.sendGroupInviteNotification = onDocumentCreated({
    document: "group_invitations/{inviteId}",
    region: region
}, async (event) => {
    const inviteData = event.data?.data();
    if (!inviteData) return null;

    const invitedUserId = inviteData.invitedUserId;
    const groupName = inviteData.groupName;

    if (!invitedUserId) return null;

    const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(invitedUserId)
        .get();
    const userData = userDoc.data();

    if (userData && userData.fcmToken) {
        const payload = {
            notification: {
                title: "New Group Invitation",
                body: `You have been invited to join ${groupName}`,
            },
            data: {
                type: "group_invite",
                inviteId: event.params.inviteId,
                click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
        };

        return admin.messaging().sendToDevice(userData.fcmToken, payload);
    }
    return null;
});

// 4. Upload Image to Cloudinary
// ... (existing code)
// TODO: Replace with your actual Cloudinary credentials
cloudinary.config({
    cloud_name: 'dxcm41gw8',
    api_key: '844635474632548',
    api_secret: 'prOEU7mLoG_ayjv9zu6DEvOHYP0'
});

exports.uploadImage = onCall({
    region: region,
    maxInstances: 10,
}, async (request) => {
    // Check if user is authenticated
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const image = request.data.image; // Base64 string or file path
    const folder = request.data.folder || 'news_images';

    if (!image) {
        throw new HttpsError('invalid-argument', 'The function must be called with an "image" argument.');
    }

    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: folder,
            resource_type: 'auto',
        });

        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new HttpsError('internal', 'Image upload failed.', error);
    }
});

// 5. Send Notification for New Group Chat Messages
exports.sendGroupChatNotification = onDocumentCreated({
    document: "groups/{groupId}/messages/{messageId}",
    region: region
}, async (event) => {
    const messageData = event.data?.data();
    if (!messageData) return null;

    const groupId = event.params.groupId;
    const senderId = messageData.senderId;
    const senderName = messageData.senderName || "Someone";
    const messageText = messageData.text || "Sent a message";
    const mentionedUserIds = messageData.mentionedUserIds || [];

    // Fetch Group
    const groupDoc = await admin.firestore().collection("groups").doc(groupId).get();
    if (!groupDoc.exists) return null;

    const groupData = groupDoc.data();
    const groupName = groupData?.name || "Group Chat";
    const memberIds = groupData?.memberIds || [];

    // Get tokens for all members except sender and those already mentioned (they get mention notification)
    const tokens = [];
    for (const memberId of memberIds) {
        // Skip sender
        if (memberId === senderId) continue;
        // Skip mentioned users (they'll get a separate mention notification)
        if (mentionedUserIds.includes(memberId)) continue;

        const userDoc = await admin.firestore().collection("users").doc(memberId).get();
        const userData = userDoc.data();
        if (userData?.fcmToken) {
            tokens.push(userData.fcmToken);
        }
    }

    if (tokens.length === 0) return null;

    // Truncate message for notification
    const truncatedMessage = messageText.length > 50
        ? messageText.substring(0, 47) + "..."
        : messageText;

    const payload = {
        notification: {
            title: groupName,
            body: `${senderName}: ${truncatedMessage}`,
        },
        data: {
            type: "chat",
            groupId: groupId,
            messageId: event.params.messageId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    try {
        const response = await admin.messaging().sendToDevice(tokens, payload);
        console.log(`[sendGroupChatNotification] Sent ${response.successCount} notifications for group ${groupId}`);
        return { success: true, count: response.successCount };
    } catch (error) {
        console.error(`[sendGroupChatNotification] Error:`, error);
        return { success: false, error: error.message };
    }
});

// 6. Send Notification when User is Mentioned in Chat
exports.sendMentionNotification = onDocumentCreated({
    document: "groups/{groupId}/messages/{messageId}",
    region: region
}, async (event) => {
    const messageData = event.data?.data();
    if (!messageData) return null;

    const mentionedUserIds = messageData.mentionedUserIds;
    if (!mentionedUserIds || mentionedUserIds.length === 0) return null;

    const groupId = event.params.groupId;
    const senderName = messageData.senderName;
    const messageText = messageData.text;

    // Fetch Group Name
    const groupDoc = await admin.firestore().collection("groups").doc(groupId).get();
    const groupName = groupDoc.data()?.name || "Group Chat";

    // Fetch Tokens for mentioned users
    const tokens = [];
    for (const userId of mentionedUserIds) {
        // Don't notify sender if they mentioned themselves
        if (userId === messageData.senderId) continue;

        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        const userData = userDoc.data();
        if (userData && userData.fcmToken) {
            tokens.push(userData.fcmToken);
        }
    }

    if (tokens.length === 0) return null;

    const payload = {
        notification: {
            title: `You were mentioned in ${groupName}`,
            body: `${senderName}: ${messageText}`,
        },
        data: {
            type: "chat",
            groupId: groupId,
            messageId: event.params.messageId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    // Send to all tokens
    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log(`[sendMentionNotification] Sent ${response.successCount} notifications, ${response.failureCount} failed.`);

    return { success: true, count: response.successCount };
});

// 7. Send Notification when Service Request is Created
exports.onServiceRequestCreated = onDocumentCreated({
    document: "service_requests/{requestId}",
    region: region
}, async (event) => {
    const request = event.data?.data();
    if (!request) return null;

    // Notify all admins about new request
    const adminsSnap = await admin.firestore()
        .collection("users")
        .where("role", "==", "admin")
        .get();

    const adminTokens = [];
    for (const doc of adminsSnap.docs) {
        const token = doc.data().fcmToken;
        if (token) adminTokens.push(token);
    }

    const adminPayload = {
        notification: {
            title: "New Service Request",
            body: `${request.userName} requested ${request.serviceTypeName}`,
        },
        data: {
            type: "service_request",
            requestId: event.params.requestId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    if (adminTokens.length > 0) {
        const adminResponse = await admin.messaging().sendToDevice(adminTokens, adminPayload);
        console.log(`[onServiceRequestCreated] Sent ${adminResponse.successCount} notifications to admins`);
    }

    // Also notify all Gurujis via topic
    const gurujiPayload = {
        notification: {
            title: "New Service Request",
            body: `New ${request.serviceTypeName || 'service'} request from ${request.userName}`,
        },
        data: {
            type: "new_service_request",
            requestId: event.params.requestId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    try {
        await admin.messaging().sendToTopic("gurujis", gurujiPayload);
        console.log(`[onServiceRequestCreated] Sent notification to gurujis topic`);
    } catch (error) {
        console.error(`[onServiceRequestCreated] Error sending to gurujis topic:`, error);
    }

    return { success: true };
});

// 8. Send Notification on Service Request Status Change & Negotiation
exports.onServiceRequestUpdated = onDocumentWritten({
    document: "service_requests/{requestId}",
    region: region
}, async (event) => {
    const newData = event.data?.after.exists ? event.data.after.data() : null;
    const oldData = event.data?.before.exists ? event.data.before.data() : null;

    if (!newData || !oldData) return null;

    const requestId = event.params.requestId;
    const userId = newData.userId;

    // Helper function to send notification to a user
    async function sendToUser(targetUserId, title, body, type) {
        const userDoc = await admin.firestore().collection("users").doc(targetUserId).get();
        const token = userDoc.data()?.fcmToken;
        if (!token) {
            console.warn(`[onServiceRequestUpdated] No token for user ${targetUserId}`);
            return;
        }
        const payload = {
            notification: { title, body },
            data: {
                type: type,
                requestId: requestId,
                click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
        };
        await admin.messaging().sendToDevice(token, payload);
        console.log(`[onServiceRequestUpdated] Sent '${type}' to ${targetUserId}`);
    }

    // --- SCENARIO 1: Guruji Assigned (notify both Guruji and Yajman) ---
    if (newData.assignedGurujiId && newData.assignedGurujiId !== oldData.assignedGurujiId) {
        // Notify Guruji
        await sendToUser(
            newData.assignedGurujiId,
            "New Service Assignment",
            `You have been assigned to: ${newData.serviceTypeName} for ${newData.userName}`,
            "guruji_assigned"
        );

        // Notify Yajman (Requester)
        await sendToUser(
            userId,
            "Guruji Assigned",
            `A Guruji has been assigned to your ${newData.serviceTypeName} request.`,
            "yajman_guruji_assigned"
        );
    }

    // --- SCENARIO 2: Samagri Item Status Changed ---
    const oldRequirements = oldData.userRequirements || [];
    const newRequirements = newData.userRequirements || [];

    for (const newReq of newRequirements) {
        const oldReq = oldRequirements.find(r => r.id === newReq.id);

        if (oldReq && oldReq.status !== newReq.status) {
            if (newReq.status === "approved") {
                await sendToUser(
                    userId,
                    "Item Approved ✅",
                    `Guruji approved "${newReq.name}" for your request.`,
                    "yajman_item_approved"
                );
            } else if (newReq.status === "notPossible") {
                const reason = newReq.reason ? `: ${newReq.reason}` : "";
                await sendToUser(
                    userId,
                    "Item Not Available",
                    `"${newReq.name}" is not possible${reason}`,
                    "yajman_item_rejected"
                );
            }
        }
    }

    // --- SCENARIO 3: Guruji Requested Revision ---
    const oldLog = oldData.activityLog || [];
    const newLog = newData.activityLog || [];

    if (newLog.length > oldLog.length) {
        const latestEntry = newLog[newLog.length - 1];
        if (latestEntry && latestEntry.action === "gurujiRequestedRevision") {
            await sendToUser(
                userId,
                "Revision Requested",
                "Guruji has requested changes to your samagri list.",
                "yajman_revision_requested"
            );
        }
    }

    // --- SCENARIO 4: Status Change (existing logic) ---
    if (newData.status !== oldData.status) {
        let title = "Service Request Update";
        let body = "";

        switch (newData.status) {
            case "accepted":
                body = `Your request for ${newData.serviceTypeName} has been accepted!`;
                break;
            case "unavailable":
                body = `Your request for ${newData.serviceTypeName} is temporarily unavailable: ${newData.unavailableMessage || ""}`;
                break;
            case "cancelled":
                body = `Your request for ${newData.serviceTypeName} has been cancelled: ${newData.cancellationMessage || ""}`;
                break;
            case "completed":
                body = `Your request for ${newData.serviceTypeName} has been completed!`;
                break;
            default:
                body = null;
        }

        if (body) {
            await sendToUser(userId, title, body, "service_request");
        }
    }

    return { success: true };
});

// 9. Midnight Tasks (Auto-closures, State Resets, and Notifications)
exports.midnightTasks = onSchedule({
    schedule: "every day 00:00",
    region: region,
    timeZone: "Asia/Kolkata"
}, async (event) => {
    const db = admin.firestore();
    const now = new Date();
    logger.info(`[midnightTasks] Starting midnight execution for ${now.toISOString()}`);
    
    // --- TASK A: Auto-complete Past Service Requests ---
    try {
        const startTime = Date.now();
        const dateStr = now.toISOString().split('T')[0];
        const snapshot = await db.collection("service_requests").where("status", "==", "accepted").get();
        let count = 0;
        const batch = db.batch();

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.finalDate && data.finalDate < dateStr) {
                batch.update(doc.ref, {
                    status: "completed",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                count++;
            }
        }

        if (count > 0) {
            await batch.commit();
        }
        
        logger.info("[midnightTasks] autoCompletePastServices completed", {
            processed: count,
            updated: count,
            durationMs: Date.now() - startTime
        });
    } catch (error) {
        logger.error("[midnightTasks] autoCompletePastServices failed", error);
    }

    // --- TASK B: Auto-Resume Postponed Sevas ---
    try {
        const startTime = Date.now();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        const snapshot = await db.collection('seva_opportunities')
            .where('status', 'in', ['postponed', 'rescheduled'])
            .where('date', '>=', todayStart)
            .where('date', '<', tomorrowStart)
            .get();

        let count = 0;
        if (!snapshot.empty) {
            const batch = db.batch();

            snapshot.docs.forEach(doc => {
                const sevaId = doc.id;
                batch.update(doc.ref, {
                    status: 'willStart',
                    statusUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    statusReason: 'Auto-resumed by system on scheduled date',
                });

                const logRef = doc.ref.collection('activity_logs').doc();
                batch.set(logRef, {
                    sevaId: sevaId,
                    type: 'resumed',
                    description: 'Seva auto-resumed by system',
                    performedByUserId: 'system',
                    performedByUserName: 'System',
                    performedByUserRole: 'system',
                    previousStatus: 'postponed',
                    newStatus: 'willStart',
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });
                count++;
            });

            await batch.commit();
        }
        
        logger.info("[midnightTasks] checkPostponedSevas completed", {
            processed: snapshot.empty ? 0 : snapshot.docs.length,
            updated: count,
            durationMs: Date.now() - startTime
        });
    } catch (error) {
        logger.error("[midnightTasks] checkPostponedSevas failed", error);
    }

    // --- TASK C: Send Daily Celebrations ---
    try {
        const startTime = Date.now();
        const usersSnap = await db.collection("users").get();
        let birthdayCount = 0;
        let anniversaryCount = 0;
        let names = [];

        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();

        usersSnap.docs.forEach(doc => {
            const data = doc.data();

            if (data.dob) {
                const dob = data.dob.toDate ? data.dob.toDate() : new Date(data.dob);
                if (dob.getMonth() + 1 === currentMonth && dob.getDate() === currentDay) {
                    birthdayCount++;
                    if (names.length < 2) names.push(data.name);
                }
            }

            if (data.maritalStatus === 'Married' && data.marriageDate) {
                const dom = data.marriageDate.toDate ? data.marriageDate.toDate() : new Date(data.marriageDate);
                if (dom.getMonth() + 1 === currentMonth && dom.getDate() === currentDay) {
                    anniversaryCount++;
                }
            }
        });

        const totalCelebrations = birthdayCount + anniversaryCount;

        if (totalCelebrations > 0) {
            let title = "🎉 Today's Celebrations";
            let body = "";

            if (birthdayCount > 0 && anniversaryCount > 0) {
                body = `We have ${birthdayCount} birthdays and ${anniversaryCount} anniversaries today! Send your blessings.`;
            } else if (birthdayCount > 0) {
                if (birthdayCount === 1) {
                    body = `It's ${names[0]}'s birthday today! Send your blessings.`;
                } else {
                    body = `It's ${names[0]} and ${birthdayCount - 1} others' birthday today!`;
                }
            } else {
                body = `We have ${anniversaryCount} wedding anniversaries today! Send your blessings.`;
            }

            const payload = {
                notification: { title, body },
                data: {
                    type: "celebrations",
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                },
            };

            await admin.messaging().sendToTopic("all_users", payload);
        }
        
        logger.info("[midnightTasks] sendDailyCelebrations completed", {
            processed: usersSnap.docs.length,
            birthdays: birthdayCount,
            anniversaries: anniversaryCount,
            notificationsSent: totalCelebrations > 0 ? 1 : 0,
            durationMs: Date.now() - startTime
        });
    } catch (error) {
        logger.error("[midnightTasks] sendDailyCelebrations failed", error);
    }

    logger.info(`[midnightTasks] All tasks completed.`);
    return { success: true };
});

// 11. Send Notification on Emergency Request Status Change
exports.onHelpRequestUpdated = onDocumentWritten({
    document: "help_requests/{requestId}",
    region: region
}, async (event) => {
    const newData = event.data?.after.exists ? event.data.after.data() : null;
    const oldData = event.data?.before.exists ? event.data.before.data() : null;

    if (!newData || !oldData) return null;
    if (newData.status === oldData.status) return null; // No status change

    const userId = newData.userId;
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const userToken = userDoc.data()?.fcmToken;

    if (!userToken) return null;

    let title = "Emergency Help Update";
    let body = "";

    // Pending -> Acknowledged
    if (oldData.status === "pending" && newData.status === "acknowledged") {
        title = "Help Request Acknowledged";
        body = "An admin has acknowledged your request and is taking action.";
    }
    // Any -> Resolved
    else if (newData.status === "resolved" && oldData.status !== "resolved") {
        title = "Request Resolved";
        body = "Your emergency request has been marked as resolved.";
    } else {
        return null;
    }

    const payload = {
        notification: {
            title: title,
            body: body,
        },
        data: {
            type: "service_request", // Reusing this ID or create new 'emergency' type if supported by client
            requestId: event.params.requestId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    // Note: NotificationService client-side maps 'service_request' to a channel. 
    // If you want a specific channel for emergency, ensure client supports it.
    // For now, let's use 'service_request' as it's high priority, or 'general'.
    // Better: Update payload type to 'emergency' and update client to handle it.

    // Changing logic to use 'type': 'emergency' to match client updates we will make.
    payload.data.type = "emergency";

    try {
        await admin.messaging().sendToDevice(userToken, payload);
        console.log(`[onHelpRequestUpdated] Sent notification to user ${userId} for status ${newData.status}`);
        return { success: true };
    } catch (error) {
        console.error(`[onHelpRequestUpdated] Error sending notification:`, error);
        return { success: false, error: error };
    }
});

// 12. Send Notification for New Global Events
exports.onGlobalEventCreated = onDocumentCreated({
    document: "events/{eventId}",
    region: region
}, async (event) => {
    const data = event.data?.data();
    if (!data) return null;

    const payload = {
        notification: {
            title: "New Event: " + data.title,
            body: data.description || "Check out this upcoming event!",
            image: data.imageUrl,
        },
        data: {
            type: "event", // Maps to 'events' topic in app
            eventId: event.params.eventId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    try {
        await admin.messaging().sendToTopic("events", payload);
        console.log(`[onGlobalEventCreated] Sent notification for event: ${data.title}`);
        return { success: true };
    } catch (error) {
        console.error(`[onGlobalEventCreated] Error:`, error);
        return { success: false, error: error };
    }
});

// 13. Send Notification for Event Updates (Cancellation)
exports.onGlobalEventUpdated = onDocumentWritten({
    document: "events/{eventId}",
    region: region
}, async (event) => {
    const newData = event.data?.after.exists ? event.data.after.data() : null;
    const oldData = event.data?.before.exists ? event.data.before.data() : null;

    if (!newData || !oldData) return null;

    // Notify only on Cancellation for now to reduce noise
    if (newData.isCancelled === true && oldData.isCancelled !== true) {
        const payload = {
            notification: {
                title: "Event Cancelled: " + newData.title,
                body: "This event has been cancelled. Please check the app for details.",
            },
            data: {
                type: "event",
                eventId: event.params.eventId,
                click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
        };

        try {
            await admin.messaging().sendToTopic("events", payload);
            console.log(`[onGlobalEventUpdated] Sent cancellation for: ${newData.title}`);
            return { success: true };
        } catch (error) {
            console.error(`[onGlobalEventUpdated] Error:`, error);
            return { success: false, error: error };
        }
    }
    return null;
});

// 14. Send Notification for Seva Appreciation (Gratitude)
exports.onSevaAppreciation = onDocumentCreated({
    document: "seva_appreciations/{id}",
    region: region
}, async (event) => {
    const data = event.data?.data();
    if (!data) return null;

    const userId = data.userId;
    const badge = data.badgeEmoji || "🙏";
    const title = data.sevaTitle || "Seva";

    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const token = userDoc.data()?.fcmToken;

    if (!token) return null;

    const payload = {
        notification: {
            title: `${badge} Gratitude for your Seva`,
            body: `Your contribution to "${title}" has been appreciated.`,
        },
        data: {
            type: "profile", // Opens profile to see badges
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    try {
        await admin.messaging().sendToDevice(token, payload);
        console.log(`[onSevaAppreciation] Sent gratitude to user ${userId}`);
        return { success: true };
    } catch (error) {
        console.error(`[onSevaAppreciation] Error:`, error);
        return { success: false, error: error };
    }
});

// 15. Send Notification for Family Link Requests
exports.onFamilyLinkRequest = onDocumentCreated({
    document: "family_links/{linkId}",
    region: region
}, async (event) => {
    const data = event.data?.data();
    if (!data) return null;

    const fromUserId = data.requesterId;
    const toUserId = data.targetUserId;

    // Fetch Requester Name
    const requesterDoc = await admin.firestore().collection("users").doc(fromUserId).get();
    const requesterName = requesterDoc.data()?.name || "A family member";

    // Fetch Target User Token
    const targetDoc = await admin.firestore().collection("users").doc(toUserId).get();
    const token = targetDoc.data()?.fcmToken; // Corrected variable name access

    if (!token) return null;

    const payload = {
        notification: {
            title: "Family Link Request",
            body: `${requesterName} wants to link with you as family.`,
        },
        data: {
            type: "family_link",
            linkId: event.params.linkId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    try {
        await admin.messaging().sendToDevice(token, payload);
        console.log(`[onFamilyLinkRequest] Sent request to user ${toUserId}`);
        return { success: true };
    } catch (error) {
        console.error(`[onFamilyLinkRequest] Error:`, error);
        return { success: false, error: error };
    }
});


// 16. Join Group (Transaction)
exports.joinGroup = onCall({
    region: region,
    maxInstances: 10,
}, async (request) => {
    // 1. Auth Check
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { groupId } = request.data;
    const userId = request.auth.uid;

    if (!groupId) {
        throw new HttpsError('invalid-argument', 'The function must be called with a "groupId" argument.');
    }

    const db = admin.firestore();
    const groupRef = db.collection('groups').doc(groupId);
    const memberRef = groupRef.collection('members').doc(userId);

    try {
        await db.runTransaction(async (transaction) => {
            const groupDoc = await transaction.get(groupRef);

            if (!groupDoc.exists) {
                throw new HttpsError('not-found', 'Group does not exist.');
            }

            // Check if group is public
            if (!groupDoc.data().isPublic) {
                // If not public, we might want to check for invitation or other logic, 
                // but for "Public Groups" feature, we strictly enforce this.
                // Or allow if user has 'admin' role? For now, simpler.
                throw new HttpsError('permission-denied', 'Cannot join non-public groups directly.');
            }

            const memberDoc = await transaction.get(memberRef);
            if (memberDoc.exists) {
                throw new HttpsError('already-exists', 'User is already a member of this group.');
            }

            // Add member
            transaction.set(memberRef, {
                userId: userId,
                joinedAt: admin.firestore.FieldValue.serverTimestamp(),
                role: 'member', // Default role
                status: 'active'
            });

            // Increment member count
            transaction.update(groupRef, {
                memberCount: admin.firestore.FieldValue.increment(1)
            });
        });

        console.log(`[joinGroup] User ${userId} joined group ${groupId}`);
        return { success: true };

    } catch (error) {
        console.error(`[joinGroup] Error:`, error);
        // Re-throw HttpsError if it is one, otherwise wrap it
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'Failed to join group.', error);
    }
});


// 17. Leave Group (Transaction)
exports.leaveGroup = onCall({
    region: region,
    maxInstances: 10,
}, async (request) => {
    // 1. Auth Check
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { groupId } = request.data;
    const userId = request.auth.uid;

    if (!groupId) {
        throw new HttpsError('invalid-argument', 'The function must be called with a "groupId" argument.');
    }

    const db = admin.firestore();
    const groupRef = db.collection('groups').doc(groupId);
    const memberRef = groupRef.collection('members').doc(userId);

    try {
        await db.runTransaction(async (transaction) => {
            const groupDoc = await transaction.get(groupRef);
            // We don't necessarily fail if group likely deleted, but for memberCount it's important.
            if (!groupDoc.exists) {
                throw new HttpsError('not-found', 'Group does not exist.');
            }

            const memberDoc = await transaction.get(memberRef);
            if (!memberDoc.exists) {
                throw new HttpsError('not-found', 'User is not a member of this group.');
            }

            // Remove member
            transaction.delete(memberRef);

            // Decrement member count (ensure non-negative handled by logic or simple check)
            // Firestore increment(-1) is atomic.
            // We can check current count to be safe, but typically safe.
            const currentCount = groupDoc.data().memberCount || 0;
            if (currentCount > 0) {
                transaction.update(groupRef, {
                    memberCount: admin.firestore.FieldValue.increment(-1)
                });
            }
        });

        console.log(`[leaveGroup] User ${userId} left group ${groupId}`);
        return { success: true };

    } catch (error) {
        console.error(`[leaveGroup] Error:`, error);
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'Failed to leave group.', error);
    }
});

// 19. Auto-Join Groups by Interests (Transaction-safe & Limited)
exports.autoJoinGroupsByInterests = onCall({
    region: region,
    maxInstances: 10,
}, async (request) => {
    // 1. Auth Check
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { selectedInterestIds } = request.data;
    const userId = request.auth.uid;

    // Bulletproof Refinement #1: Input Validation
    if (!selectedInterestIds || !Array.isArray(selectedInterestIds) || selectedInterestIds.length === 0) {
        return { joinedGroups: [] };
    }
    if (selectedInterestIds.length > 5) {
        throw new HttpsError('invalid-argument', 'Maximum 5 interests allowed for automatic induction.');
    }

    const db = admin.firestore();

    try {
        // Bulletproof Refinement #2: Query with specific ordering & limit
        // REQ: composite index (isPublic, status, interestIds, recommendedPriority DESC, memberCount DESC)
        const groupsSnap = await db.collection('groups')
            .where('isPublic', '==', true)
            .where('status', '==', 'approved')
            .where('interestIds', 'array-contains-any', selectedInterestIds)
            .orderBy('recommendedPriority', 'desc')
            .orderBy('memberCount', 'desc')
            .limit(3)
            .get();

        if (groupsSnap.empty) {
            return { joinedGroups: [] };
        }

        const joinedGroups = [];

        // Bulletproof Refinement #3: Sequential Transactions (to avoid contention)
        for (const groupDoc of groupsSnap.docs) {
            const groupId = groupDoc.id;
            const groupData = groupDoc.data();
            const groupName = groupData.name || "Unknown Group";

            const groupRef = db.collection('groups').doc(groupId);
            const memberRef = groupRef.collection('members').doc(userId);

            const result = await db.runTransaction(async (transaction) => {
                const txGroupDoc = await transaction.get(groupRef);

                if (!txGroupDoc.exists) return { joined: false };

                const txGroupData = txGroupDoc.data();

                // Bulletproof Refinement #6: Redundant Security Checks
                if (txGroupData.isPublic !== true || txGroupData.status !== 'approved') {
                    return { joined: false };
                }

                const memberDoc = await transaction.get(memberRef);

                // Bulletproof Refinement: Idempotency check 
                if (memberDoc.exists) {
                    return { joined: false, alreadyMember: true };
                }

                // Add member
                transaction.set(memberRef, {
                    userId: userId,
                    joinedAt: admin.firestore.FieldValue.serverTimestamp(),
                    role: 'member',
                    status: 'active',
                    autoJoined: true // Label for tracking
                });

                // Increment member count
                transaction.update(groupRef, {
                    memberCount: admin.firestore.FieldValue.increment(1)
                });

                return { joined: true };
            });

            if (result.joined || result.alreadyMember) {
                joinedGroups.push({
                    id: groupId,
                    name: groupName
                });
            }
        }

        console.log(`[autoJoinGroupsByInterests] User ${userId} requested join for ${selectedInterestIds}. Actually joined ${joinedGroups.length} groups.`);
        return { joinedGroups };

    } catch (error) {
        console.error(`[autoJoinGroupsByInterests] Error:`, error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Search and induction failed.', error);
    }
});

// 16. Send Official Announcements
exports.onAnnouncementCreated = onDocumentCreated({
    document: "announcements/{id}",
    region: region
}, async (event) => {
    const data = event.data?.data();
    if (!data) return null;

    const payload = {
        notification: {
            title: "📢 " + data.title,
            body: data.message,
        },
        data: {
            type: "announcement",
            id: event.params.id,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
    };

    try {
        await admin.messaging().sendToTopic("announcements", payload);
        console.log(`[onAnnouncementCreated] Sent announcement: ${data.title}`);
        return { success: true };
    } catch (error) {
        console.error(`[onAnnouncementCreated] Error:`, error);
        return { success: false, error: error };
    }
});

// ═══════════════════════════════════════════════════════════════════════
// COLLECTIVE SANKALP (Community Goals) - Sharded Counter Logic
// ═══════════════════════════════════════════════════════════════════════

exports.syncSadhanaToCollectiveGoal = onDocumentCreated({
    document: "sadhana_records/{recordId}",
    region: region
}, async (event) => {
    const data = event.data?.data();
    if (!data) return null;

    const { userId, type, count } = data;
    const malaCount = parseInt(count) || 0;

    // Only process JAPA type records for community goals
    if (type !== "JAPA" || malaCount <= 0) return null;

    const db = admin.firestore();

    // 1. Idempotency Check
    const eventId = event.params.recordId;
    const eventRef = db.collection("processed_sadhana_events").doc(eventId);

    try {
        const processedDoc = await eventRef.get();
        if (processedDoc.exists) {
            console.log(`[syncSadhanaToCollectiveGoal] Already processed event: ${eventId}`);
            return null;
        }

        // 2. Fetch Active JAPA Goals
        const goalsSnap = await db.collection("collective_goals")
            .where("status", "==", "active")
            .where("type", "==", "JAPA")
            .get();

        if (goalsSnap.empty) {
            console.log("[syncSadhanaToCollectiveGoal] No active JAPA goals found.");
            return null;
        }

        const tasks = goalsSnap.docs.map(async (goalDoc) => {
            const goalId = goalDoc.id;
            const goalData = goalDoc.data();
            const numShards = goalData.numShards || 5;
            const dailyCap = goalData.dailyContributionCapPerUser || 100;

            // 3. Fraud Control / Daily Cap Check
            const userContrRef = db.collection("users").doc(userId).collection("collective_contributions").doc(goalId);
            const userContrDoc = await userContrRef.get();
            const todayStr = new Date().toISOString().split('T')[0];

            let todayContributed = 0;
            if (userContrDoc.exists && userContrDoc.data().lastContributionDate === todayStr) {
                todayContributed = userContrDoc.data().todayContributed || 0;
            }

            if (todayContributed >= dailyCap) {
                console.log(`[syncSadhanaToCollectiveGoal] User ${userId} hit daily cap for goal ${goalId}`);
                return;
            }

            const allowedMalas = Math.min(malaCount, dailyCap - todayContributed);

            // 4. Sharded Atomic Increment
            const shardId = Math.floor(Math.random() * numShards).toString();
            const shardRef = db.collection("collective_goals").doc(goalId).collection("shards").doc(shardId);
            const goalRef = db.collection("collective_goals").doc(goalId);

            await db.runTransaction(async (transaction) => {
                // Increment Shard
                transaction.set(shardRef, {
                    count: admin.firestore.FieldValue.increment(allowedMalas)
                }, { merge: true });

                // Increment Main Aggregate (Efficient Reads)
                transaction.update(goalRef, {
                    currentCount: admin.firestore.FieldValue.increment(allowedMalas),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                // Update User Contribution record
                transaction.set(userContrRef, {
                    totalContributed: admin.firestore.FieldValue.increment(allowedMalas),
                    todayContributed: (userContrDoc.exists && userContrDoc.data().lastContributionDate === todayStr)
                        ? admin.firestore.FieldValue.increment(allowedMalas)
                        : allowedMalas,
                    lastContributionDate: todayStr,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            });

            console.log(`[syncSadhanaToCollectiveGoal] Balanced ${allowedMalas} malas for goal ${goalId} (User: ${userId})`);
        });

        await Promise.all(tasks);

        // 5. Finalize Idempotency
        await eventRef.set({
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
            userId: userId,
            malaCount: malaCount
        });

        return { success: true };

    } catch (error) {
        console.error(`[syncSadhanaToCollectiveGoal] Error:`, error);
        return { success: false, error: error.message };
    }
});

// ═══════════════════════════════════════════════════════════════════════
// GRANTHALAYA PHASE 0 — Reservation & Inventory Management
// v7.1-FROZEN Specification
// ═══════════════════════════════════════════════════════════════════════

const {
    createReservation,
    releaseReservation,
    releaseStaleReservations,
} = require('./granthalaya/reservationService');

exports.granthalayaCreateReservation = createReservation;
exports.granthalayaReleaseReservation = releaseReservation;
exports.granthalayaReleaseStaleReservations = releaseStaleReservations;

// ─── Sprint 2: Order State Machine + Delivery + Packing ───

const { transitionOrder } = require('./granthalaya/orderStateMachine');
const { onDeliveryConfirm } = require('./granthalaya/deliveryService');
const { startPacking, commitPacking } = require('./granthalaya/packingService');

exports.granthalayaTransitionOrder = transitionOrder;
exports.granthalayaDeliveryConfirm = onDeliveryConfirm;
exports.granthalayaStartPacking = startPacking;
exports.granthalayaCommitPacking = commitPacking;

// ─── Sprint 4: Operational Hardening ───

const {
    updateSystemHealth,
    manualRecalculateHealth,
    weeklyReconciliation,
} = require('./granthalaya/healthService');

exports.granthalayaUpdateSystemHealth = updateSystemHealth;
exports.granthalayaManualRecalculateHealth = manualRecalculateHealth;
exports.granthalayaWeeklyReconciliation = weeklyReconciliation;

// ─── Sprint 5: Analytics & Intelligence ───
const {
    finalizeDailyMetrics,
    weeklySkuAnalytics,
} = require('./granthalaya/analyticsService');

exports.granthalayaFinalizeDailyMetrics = finalizeDailyMetrics;
exports.granthalayaWeeklySkuAnalytics = weeklySkuAnalytics;

/**
 * ─── Phase 3: LMS & Collective Sankalp ───
 */

// 1. Evaluate Quiz results securely
exports.evaluateQuizResult = onCall({
    region: region,
}, async (request) => {
    // Check if user is authenticated
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { courseId, lessonId, quizId, answers } = request.data;
    const uid = request.auth.uid;

    if (!quizId || !answers) {
        throw new HttpsError('invalid-argument', 'Quiz ID and answers are required.');
    }

    try {
        const db = admin.firestore();

        // Fetch quiz
        const quizDoc = await db.collection("quizzes").doc(quizId).get();
        if (!quizDoc.exists) {
            throw new HttpsError('not-found', 'Quiz not found.');
        }

        const quizData = quizDoc.data();
        const questions = quizData.questions || [];

        let correctCount = 0;
        const totalQuestions = questions.length;

        // Grade each question
        questions.forEach((q, index) => {
            const userAnswers = answers[index] || [];
            const correctIndices = q.correctOptionIndices || [];

            if (Array.isArray(userAnswers) &&
                userAnswers.length === correctIndices.length &&
                JSON.stringify([...userAnswers].sort()) === JSON.stringify([...correctIndices].sort())) {
                correctCount++;
            }
        });

        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const passingScore = quizData.passingScore || 70;
        const isPassed = score >= passingScore;

        // Save result
        const resultRef = db.collection("quiz_results").doc();
        const resultData = {
            userId: uid,
            quizId: quizId,
            courseId: courseId || quizData.courseId || "",
            lessonId: lessonId || quizData.lessonId || "",
            score: score,
            passed: isPassed,
            correctCount: correctCount,
            totalQuestions: totalQuestions,
            completedAt: admin.firestore.Timestamp.now(),
        };

        await resultRef.set(resultData);

        // Update enrollment progress
        if (isPassed && resultData.courseId) {
            const enrollmentSnap = await db.collection("course_enrollments")
                .where("userId", "==", uid)
                .where("courseId", "==", resultData.courseId)
                .limit(1)
                .get();

            if (!enrollmentSnap.empty) {
                const enrollmentDoc = enrollmentSnap.docs[0];
                const lessonIdToMark = resultData.lessonId;

                if (lessonIdToMark) {
                    await enrollmentDoc.ref.update({
                        completedLessonIds: admin.firestore.FieldValue.arrayUnion(lessonIdToMark),
                        lastAccessedAt: admin.firestore.Timestamp.now()
                    });
                }
            }
        }

        return {
            success: true,
            score: score,
            passed: isPassed,
            correctCount: correctCount,
            totalQuestions: totalQuestions,
            resultId: resultRef.id
        };

    } catch (error) {
        console.error(`[evaluateQuizResult] Error:`, error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', error.message);
    }
});

// 2. Initialize Sankalp Shards on creation
exports.initSankalpShards = onDocumentCreated({
    document: "collective_goals/{goalId}",
    region: region
}, async (event) => {
    const goalData = event.data?.data();
    if (!goalData) return null;

    const goalId = event.params.goalId;
    const numShards = goalData.numShards || 10;
    const db = admin.firestore();

    try {
        const batch = db.batch();
        for (let i = 0; i < numShards; i++) {
            const shardRef = db.collection("collective_goals").doc(goalId).collection("shards").doc(i.toString());
            batch.set(shardRef, { count: 0 });
        }

        await batch.commit();
        console.log(`[initSankalpShards] Initialized ${numShards} shards for goal ${goalId}`);
    } catch (error) {
        console.error(`[initSankalpShards] Error initializing shards for ${goalId}:`, error);
    }
    return null;
});

/**
 * Selects a random member from a group based on attendance and fairness rules.
 * BSS Optimized v3: STRICT 5-RULE PLAN
 */
exports.selectRandomMember = onCall({
    region: region,
}, async (request) => {
    const { groupId, targetDate, roleTagId, categoryId, subGroupId } = request.data;
    const auth = request.auth;

    if (!auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const { uid } = auth;
    const db = admin.firestore();

    // 1. Permission Check
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();
    if (!groupDoc.exists) {
        throw new HttpsError("not-found", "Group not found.");
    }

    const groupData = groupDoc.data();

    // Authorization checks
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const isAdmin = auth.token.admin === true ||
        userData.role === 'admin' ||
        auth.token.email === 'gayatripariwarbhiwandi@gmail.com' ||
        auth.token.email === 'gayatripragyapeethbhiwandi@gmail.com';

    const isGlobalGuruji = auth.token.guruji === true || userData.role === 'guruji';
    const isGuruji = isGlobalGuruji || (groupData.gurujiIds && groupData.gurujiIds.includes(uid));
    const isGroupAdmin = groupData.adminIds && groupData.adminIds.includes(uid);

    if (!isAdmin && !isGuruji && !isGroupAdmin) {
        throw new HttpsError("permission-denied", "Only admins or gurujis can trigger random selection.");
    }

    // 2. IST Date Handling
    const nowIST = targetDate
        ? DateTime.fromFormat(targetDate, "yyyy-MM-dd", { zone: "Asia/Kolkata" })
        : DateTime.now().setZone("Asia/Kolkata");
    const dateKey = nowIST.toFormat("yyyy-MM-dd");
    const todayStr = dateKey;
    const sevenDaysAgoStr = nowIST.minus({ days: 7 }).toFormat("yyyy-MM-dd");

    // Scope lock uniquely to the requested role or subgroup to allow multiple assignments
    const safeRoleName = roleTagId ? roleTagId.replace(/[^a-zA-Z0-9]/g, '_') : 'default';
    const lockId = subGroupId ? `${dateKey}_sub_${subGroupId}_${safeRoleName}` : `${dateKey}_${safeRoleName}`;
    
    console.log(`[selectRandomMember] Triggered for group: ${groupId}, targetDate: ${targetDate}, calculated dateKey: ${dateKey}, lockId: ${lockId}, subGroupId: ${subGroupId}`);

    const selectionRef = groupRef.collection("daily_selections").doc(lockId); 
    const auditResRef = groupRef.collection("selection_logs").doc();

    try {
        const result = await db.runTransaction(async (transaction) => {
            // 3. Duplicate Check / Daily Lock (RULE 2 - PER ROLE)
            const selectionDoc = await transaction.get(selectionRef);
            if (selectionDoc.exists) {
                const existingData = selectionDoc.data();
                transaction.set(auditResRef, {
                    groupId,
                    dateKey,
                    status: "rejected",
                    reason: "Already selected",
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    triggeredBy: uid
                });
                throw new HttpsError("already-exists", "Selection for this group already exists for today.", {
                    selectedUserId: existingData.selectedUserId,
                    assignedRole: existingData.assignedRole
                });
            }

            // 4. Attendance Check (RULE 1)
            const attendanceRef = groupRef.collection("attendance").doc(dateKey);
            const attendanceDoc = await transaction.get(attendanceRef);
            
            console.log(`[selectRandomMember] Checking attendance doc at ${attendanceRef.path}. Exists: ${attendanceDoc.exists}`);

            if (!attendanceDoc.exists) {
                throw new HttpsError("failed-precondition", "Attendance must be marked for today (IST) before selection.");
            }

            const attendanceData = attendanceDoc.data();
            const presentUserIds = attendanceData.presentUserIds || [];
            
            console.log(`[selectRandomMember] Attendance data found. presentCount: ${attendanceData.presentCount}, presentUserIds length: ${presentUserIds.length}`);

            if (presentUserIds.length === 0) {
                throw new HttpsError("failed-precondition", "No students present today.");
            }

            // 4.1 Apply Subgroup Scoping (if requested)
            let eligiblePool = presentUserIds;
            if (subGroupId && categoryId) {
                const subGroupRef = groupRef.collection("student_categories").doc(categoryId).collection("sub_groups").doc(subGroupId);
                const subGroupDoc = await transaction.get(subGroupRef);
                
                if (!subGroupDoc.exists) {
                    throw new HttpsError("not-found", "Subgroup not found.");
                }
                
                const subGroupData = subGroupDoc.data();
                const subGroupStudentIds = new Set(subGroupData.studentIds || []);
                
                // Intersect presence with subgroup roster
                eligiblePool = presentUserIds.filter(id => subGroupStudentIds.has(id));
                
                if (eligiblePool.length === 0) {
                    throw new HttpsError("failed-precondition", "No students from this subgroup are present today.");
                }
            }

            // 5. Fairness Query (RULE 3)
            const recentSelectionsQuery = groupRef.collection("daily_selections")
                .where("dateKey", ">=", sevenDaysAgoStr)
                .where("dateKey", "<", todayStr);

            const recentSelectionsSnap = await transaction.get(recentSelectionsQuery);
            
            // Filter historically in-memory to avoid needing a complex composite index on (dateKey, subGroupId)
            const recentlySelectedIds = new Set(
                recentSelectionsSnap.docs
                    .filter(doc => {
                        const d = doc.data();
                        if (subGroupId) {
                            return d.subGroupId === subGroupId; // Scoped fairness for subgroup
                        } else {
                            return !d.subGroupId; // Global fairness ignores subgroup history
                        }
                    })
                    .map(doc => doc.data().selectedUserId)
            );

            // 6. Eligible Pool Construction with Fallback (RULE 4)
            let finalPool = eligiblePool.filter(id => !recentlySelectedIds.has(id));
            let fairnessFallbackUsed = false;

            if (finalPool.length === 0) {
                finalPool = eligiblePool; // Fallback to all eligible present students
                fairnessFallbackUsed = true;
            }

            // 7. Secure Random Selection (RULE 5)
            const randomIndex = crypto.randomInt(0, finalPool.length);
            const selectedUserId = finalPool[randomIndex];

            // 8. Role Assignment
            let assignedRole = roleTagId || "Seva";

            // If no specific role was requested, we fallback to tag-based
            if (!roleTagId) {
                const memberRef = groupRef.collection("members").doc(selectedUserId);
                const memberDoc = await transaction.get(memberRef);
                const memberData = memberDoc.exists ? memberDoc.data() : {};
                const memberTags = memberData.tags || [];

                if (memberTags.length > 0) {
                    const rolesQuery = groupRef.collection("group_tags").where("isRole", "==", true);
                    const rolesSnap = await transaction.get(rolesQuery);
                    const validGroupRoleIds = new Set(rolesSnap.docs.map(doc => doc.id));
                    const studentRoleTags = memberTags.filter(tagId => validGroupRoleIds.has(tagId));

                    if (studentRoleTags.length > 0) {
                        const roleIndex = crypto.randomInt(0, studentRoleTags.length);
                        const selectedTagId = studentRoleTags[roleIndex];
                        const roleDoc = rolesSnap.docs.find(d => d.id === selectedTagId);
                        assignedRole = roleDoc ? (roleDoc.data().name || selectedTagId) : selectedTagId;
                    }
                }
            }

            // 9. Save Result
            const selectionData = {
                selectedUserId,
                assignedRole,
                selectedBy: uid,
                presentCount: presentUserIds.length,
                fairnessFallbackUsed,
                dateKey,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                groupId
            };

            if (subGroupId) {
                selectionData.subGroupId = subGroupId;
                selectionData.categoryId = categoryId;
                selectionData.isSubGroupSelection = true;
                selectionData.eligiblePoolSize = eligiblePool.length;
            }

            transaction.set(selectionRef, selectionData);
            
            const auditData = {
                status: "success",
                triggeredBy: uid,
                selectedUserId,
                assignedRole,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                groupId,
                dateKey
            };

            if (subGroupId) {
                auditData.subGroupId = subGroupId;
                auditData.categoryId = categoryId;
            }

            transaction.set(auditResRef, auditData);

            return {
                success: true,
                selectedUserId,
                assignedRole,
                fairnessFallbackUsed,
                presentCount: presentUserIds.length
            };
        });

        return result;

    } catch (error) {
        console.error(`[selectRandomMember] Error:`, error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError("internal", error.message || "Internal server error.");
    }
});

// ============================================================================
// deleteRandomSelection
// Securely deletes a daily selection for a group.
// Only accessible to Group Admins, Gurujis, or Super Admins.
// ============================================================================
exports.deleteRandomSelection = onCall({ region: region }, async (request) => {
    const auth = request.auth;
    const data = request.data;
    const uid = auth?.uid;

    if (!uid) {
        throw new HttpsError("unauthenticated", "User must be partially authenticated.");
    }

    const { groupId, selectionId } = data;

    if (!groupId || !selectionId) {
        throw new HttpsError("invalid-argument", "Missing required parameters: groupId, selectionId.");
    }

    const db = admin.firestore();

    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
        throw new HttpsError("not-found", "Group not found.");
    }

    const groupData = groupDoc.data();

    // 1. Authorization Check (Group Admin, Guruji, or Super Admin)
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const isAdmin = auth.token.admin === true ||
        userData.role === 'admin' ||
        auth.token.email === 'gayatripariwarbhiwandi@gmail.com' ||
        auth.token.email === 'gayatripragyapeethbhiwandi@gmail.com';

    const isGlobalGuruji = auth.token.guruji === true || userData.role === 'guruji';
    const isGuruji = isGlobalGuruji || (groupData.gurujiIds && groupData.gurujiIds.includes(uid));
    const isGroupAdmin = groupData.adminIds && groupData.adminIds.includes(uid);

    if (!isAdmin && !isGuruji && !isGroupAdmin) {
        throw new HttpsError("permission-denied", "Only admins or gurujis can delete selections.");
    }

    const selectionRef = groupRef.collection("daily_selections").doc(selectionId);
    const auditResRef = groupRef.collection("selection_logs").doc();

    try {
        await db.runTransaction(async (transaction) => {
            const selectionDoc = await transaction.get(selectionRef);
            if (!selectionDoc.exists) {
                throw new HttpsError("not-found", "Selection document does not exist.");
            }

            const selectionData = selectionDoc.data();

            // Perform deletion
            transaction.delete(selectionRef);

            // Log deletion audit
            transaction.set(auditResRef, {
                ...selectionData,
                deletedBy: uid,
                status: "deleted",
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        });

        return { success: true };
    } catch (error) {
        console.error(`[deleteRandomSelection] Error:`, error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError("internal", error.message || "Internal server error during deletion.");
    }
});

// Send Event Reminders at 7 AM, 5 PM, 10 PM (Day Before Event)
exports.eventReminders = onSchedule({
    schedule: "0 7,17,22 * * *",
    region: region,
    timeZone: "Asia/Kolkata"
}, async (event) => {
    const db = admin.firestore();
    const todayInKolkata = DateTime.now().setZone("Asia/Kolkata");
    const tomorrowInKolkata = todayInKolkata.plus({ days: 1 });
    
    const tomorrowStart = tomorrowInKolkata.startOf('day').toJSDate();
    const tomorrowEnd = tomorrowInKolkata.endOf('day').toJSDate();

    try {
        const eventsSnap = await db.collection("events")
            .where("eventDate", ">=", admin.firestore.Timestamp.fromDate(tomorrowStart))
            .where("eventDate", "<=", admin.firestore.Timestamp.fromDate(tomorrowEnd))
            .where("isCancelled", "==", false)
            .get();

        if (eventsSnap.empty) {
            console.log(`[eventReminders] No events happening tomorrow.`);
            return { success: true, count: 0 };
        }

        let notificationsSent = 0;
        const promises = [];

        eventsSnap.forEach(doc => {
            const eventData = doc.data();
            const eventDateStr = eventData.eventDate.toDate ? eventData.eventDate.toDate() : new Date(eventData.eventDate);
            const eventDateTime = DateTime.fromJSDate(eventDateStr).setZone("Asia/Kolkata");
            const timeString = eventDateTime.toFormat("h:mm a");

            let reminderType = "";
            if (todayInKolkata.hour === 7) reminderType = "Morning Reminder";
            if (todayInKolkata.hour === 17) reminderType = "Evening Reminder";
            if (todayInKolkata.hour === 22) reminderType = "Final Reminder";

            const payload = {
                notification: {
                    title: `🗓️ Tomorrow: ${eventData.title}`,
                    body: `${reminderType}: This event starts tomorrow at ${timeString}. Don't miss it!`,
                },
                data: {
                    type: "event",
                    eventId: doc.id,
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                },
            };

            promises.push(admin.messaging().sendToTopic("events", payload));
            notificationsSent++;
        });

        await Promise.all(promises);
        console.log(`[eventReminders] Sent ${notificationsSent} reminders for tomorrow's events.`);
        return { success: true, count: notificationsSent };
    } catch (error) {
        console.error(`[eventReminders] Failed to send event reminders:`, error);
        return { success: false, error: error.message };
    }
});

// ==========================================
// NOTIFICATIONS FOR NEW POSTS
// ==========================================
exports.onPostCreated = functions.firestore
    .document("posts/{postId}")
    .onCreate(async (snap, context) => {
        const postData = snap.data();

        if (!postData) return null;

        let bodyText = postData.caption || "A new post was added to the community feed.";
        if (bodyText.length > 100) {
            bodyText = bodyText.substring(0, 97) + "...";
        }

        const payload = {
            notification: {
                title: "New Community Post",
                body: bodyText,
                sound: "default",
            },
            data: {
                type: "post",
                postId: context.params.postId,
                click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
        };

        try {
            const response = await admin.messaging().sendToTopic("all_users", payload);
            console.log(`[onPostCreated] Successfully sent notification to all_users for post ${context.params.postId}. Response:`, response);
            return { success: true };
        } catch (error) {
            console.error(`[onPostCreated] Error sending notification for post ${context.params.postId}:`, error);
            return { success: false, error: error.message };
        }
    });