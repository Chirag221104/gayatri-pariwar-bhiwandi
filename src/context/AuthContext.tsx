'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User as FirebaseUser,
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserRoles {
    mandirApp?: string;
    granthalayaApp?: string;
    websiteAdmin: boolean;
    isRider: boolean;
}

interface AppUser {
    uid: string;
    email: string;
    name: string;
    photoUrl?: string;
    roles: UserRoles;
    phone?: string;
}

interface AuthContextType {
    user: AppUser | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
            console.log("AuthContext: onAuthStateChanged trigger", { hasFirebaseUser: !!fUser });
            setLoading(true); // Ensure loading is reset while we fetch Firestore data
            setFirebaseUser(fUser);

            if (fUser) {
                // Fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', fUser.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data() as AppUser;
                    console.log("AuthContext: Firestore user found", { roles: userData.roles });
                    setUser(userData);
                } else {
                    console.log("AuthContext: Firestore user not found, creating default");
                    // Create new user profile if it doesn't exist (e.g., first sign up on web)
                    const newUser: AppUser = {
                        uid: fUser.uid,
                        email: fUser.email || '',
                        name: fUser.displayName || 'Anonymous',
                        photoUrl: fUser.photoURL || undefined,
                        roles: {
                            websiteAdmin: false,
                            isRider: false
                        }
                    };
                    await setDoc(doc(db, 'users', fUser.uid), newUser);
                    setUser(newUser);
                }
            } else {
                console.log("AuthContext: No Firebase user");
                setUser(null);
            }
            console.log("AuthContext: Auth flow complete, setLoading(false)");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Inactivity Auto-Logout (30 minutes)
    useEffect(() => {
        if (!firebaseUser) return;

        let inactivityTimeout: NodeJS.Timeout;
        const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                console.warn("AuthContext: Inactivity limit reached, logging out...");
                logout();
            }, INACTIVITY_LIMIT);
        };

        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        resetTimer(); // Initial timer start

        return () => {
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [firebaseUser]);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            console.log("AuthContext: Logging out and clearing storage...");
            await signOut(auth);
            // Clear all browser storage to remove any cached application state
            localStorage.clear();
            sessionStorage.clear();

            // Redirect to login if on an admin page
            if (window.location.pathname.includes('/admin')) {
                window.location.href = `/${window.location.pathname.split('/')[1]}/admin/login`;
            }
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
