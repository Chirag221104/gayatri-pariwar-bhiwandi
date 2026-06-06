'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
    bookId: string;
    title: string;
    unitPrice: number;
    quantity: number;
    coverUrl?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (bookId: string) => void;
    updateQuantity: (bookId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Use a ref to track the previous user ID to handle login/logout transitions
    const prevUserIdRef = useRef<string | null>(null);

    // Dynamic storage key based on auth state
    const cartKey = user ? `cart_${user.uid}` : 'cart_guest';

    // 1. Initial Load & Auth Sync
    useEffect(() => {
        if (authLoading) return;

        // If user changed (login or logout), save current items to previous key first?
        // Actually, simpler: just load the new key's data
        const savedCart = localStorage.getItem(cartKey);

        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                setItems(parsed);
            } catch (e) {
                console.error("Failed to parse cart", e);
                setItems([]);
            }
        } else {
            setItems([]);
        }

        prevUserIdRef.current = user ? user.uid : null;
        setIsLoaded(true);
    }, [user, authLoading, cartKey]);

    // 2. Persistent Save
    useEffect(() => {
        if (!isLoaded || authLoading) return;

        // Prevent saving empty initial state over existing data
        localStorage.setItem(cartKey, JSON.stringify(items));

        // If logged in, we also keep 'cart_guest' for guest sessions? 
        // No, let's keep it simple: specific keys for specific users.
    }, [items, cartKey, isLoaded, authLoading]);

    const addItem = (item: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.bookId === item.bookId);
            if (existingItem) {
                return prevItems.map(i =>
                    i.bookId === item.bookId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevItems, item];
        });
    };

    const removeItem = (bookId: string) => {
        setItems(prevItems => prevItems.filter(i => i.bookId !== bookId));
    };

    const updateQuantity = (bookId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(bookId);
            return;
        }
        setItems(prevItems =>
            prevItems.map(i => i.bookId === bookId ? { ...i, quantity } : i)
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem(cartKey);
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
