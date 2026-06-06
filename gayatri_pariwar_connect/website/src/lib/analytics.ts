import { Timestamp } from "firebase/firestore";

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface GrowthDataPoint {
    date: string;
    users: number;
}

/**
 * Groups users by registration date to show growth over time
 */
export function processUserGrowth(users: any[]): GrowthDataPoint[] {
    const growthMap: Record<string, number> = {};

    // Sort users by creation time
    const sortedUsers = [...users].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
    });

    let runningTotal = 0;

    sortedUsers.forEach(user => {
        const date = user.createdAt instanceof Timestamp
            ? user.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Unknown';

        runningTotal++;
        growthMap[date] = runningTotal;
    });

    return Object.entries(growthMap)
        .filter(([date]) => date !== 'Unknown')
        .map(([date, count]) => ({
            date,
            users: count
        }))
        .slice(-15);
}

/**
 * Counts users by their respective roles
 */
export function processRoleDistribution(users: any[]): ChartDataPoint[] {
    const roleStats: Record<string, number> = {
        'User': 0,
        'Admin': 0,
        'Guruji': 0,
        'Staff': 0
    };

    users.forEach(user => {
        const role = user.role || 'User';
        const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

        if (roleStats[capitalizedRole] !== undefined) {
            roleStats[capitalizedRole]++;
        } else {
            roleStats['User']++;
        }
    });

    return Object.entries(roleStats)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));
}

/**
 * Gets registration counts for top upcoming events
 */
export function processEventEngagement(events: any[]): ChartDataPoint[] {
    return events
        .map(event => ({
            name: event.title?.substring(0, 15) + (event.title?.length > 15 ? '...' : ''),
            value: event.participantIds?.length || 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
}

/**
 * Processes content distribution across different modules
 */
export function processContentDistribution(counts: Record<string, number>): ChartDataPoint[] {
    return [
        { name: 'Events', value: counts.events || 0 },
        { name: 'News', value: counts.news || 0 },
        { name: 'Media', value: counts.media || 0 },
        { name: 'Seva', value: counts.seva || 0 },
    ].filter(item => item.value > 0);
}

/**
 * Processes Seva fulfillment status
 */
export function processSevaFulfillment(sevaItems: any[]): ChartDataPoint[] {
    const stats = {
        'Open': 0,
        'Fulfilled': 0,
        'Active': 0
    };

    sevaItems.forEach(item => {
        const status = item.status?.toLowerCase();
        if (status === 'open' || status === 'published') stats['Open']++;
        else if (status === 'completed' || status === 'fulfilled') stats['Fulfilled']++;
        else stats['Active']++;
    });

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
}

/**
 * Processes LMS Course Engagement
 */
export function processLMSCourseStats(users: any[]): ChartDataPoint[] {
    const courseStats: Record<string, number> = {
        'Bal Sanskar': 0,
        'Yoga Basics': 0,
        'Gita Study': 0,
        'Pragya Yog': 0
    };

    users.forEach(user => {
        const courses = user.enrolledCourses || [];
        courses.forEach((courseId: string) => {
            if (courseId.includes('bal')) courseStats['Bal Sanskar']++;
            else if (courseId.includes('yoga')) courseStats['Yoga Basics']++;
            else if (courseId.includes('gita')) courseStats['Gita Study']++;
            else if (courseId.includes('pragya')) courseStats['Pragya Yog']++;
        });
    });

    return Object.entries(courseStats)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));
}
