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
            setFirebaseUser(fUser);

            if (fUser) {
                // Fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', fUser.uid));

                if (userDoc.exists()) {
                    setUser(userDoc.data() as AppUser);
                } else {
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
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
            await signOut(auth);
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
