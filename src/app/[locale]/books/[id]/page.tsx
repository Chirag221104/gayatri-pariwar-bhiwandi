'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { ArrowLeft, BookOpen, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl?: string;
    category: string;
    tags: string[];
    description?: string;
    stockQuantity: number;
}

export default function BookDetailPage() {
    const { id, locale } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    const { addItem } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = () => {
        if (!book) return;
        addItem({
            bookId: book.id,
            title: book.title,
            unitPrice: book.price,
            quantity: 1,
            coverUrl: book.coverUrl
        });
        showToast(`${book.title} added to cart!`, 'success');
    };

    useEffect(() => {
        const fetchBook = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'granthalaya_app', 'inventory', 'books', id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBook({
                        id: docSnap.id,
                        title: data.title,
                        author: data.author,
                        price: data.price,
                        coverUrl: data.coverUrl,
                        category: data.category,
                        tags: data.tags || [],
                        description: data.description,
                        stockQuantity: data.stockQuantity || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-32 px-6 flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 rounded-full border-4 border-saffron border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="pt-40 px-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Book not found</h1>
                <Link href={`/${locale}/books`} className="text-saffron hover:underline">Back to library</Link>
            </div>
        );
    }

    return (
        <div className="pt-32 px-6 md:px-12 pb-20 bg-background min-h-screen">
            <Link
                href={`/${locale}/books`}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-saffron transition-colors mb-12"
            >
                <ArrowLeft size={16} />
                Back to Library
            </Link>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Left: Image */}
                <div className="lg:col-span-5">
                    <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-surface border border-white/5 shadow-2xl flex items-center justify-center">
                        {book.coverUrl ? (
                            <Image
                                src={book.coverUrl}
                                alt={book.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <BookOpen size={80} className="opacity-10" />
                        )}

                        <div className="absolute top-6 left-6 bg-saffron text-white px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest shadow-xl">
                            {book.category}
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="lg:col-span-7 flex flex-col pt-4">
                    <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-tight mb-4">
                        {book.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-saffron font-medium mb-8">
                        By {book.author}
                    </p>

                    <div className="bg-surface rounded-3xl p-8 border border-white/5 mb-8">
                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-5xl font-black">₹{book.price}</span>
                            <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest pb-2">Incl. all taxes</span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-foreground text-background hover:bg-saffron hover:text-white py-6 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98]"
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>
                    </div>

                    {/* Features/Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider leading-tight">Genuine Literature</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Truck size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider leading-tight">Home Delivery</span>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-lg font-bold uppercase tracking-[0.2em] mb-4 text-saffron/80">Description</h3>
                        <p className="text-lg leading-relaxed opacity-70">
                            {book.description || "No description available for this title."}
                        </p>
                    </div>

                    {/* Tags */}
                    {book.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex flex-wrap gap-2">
                                {book.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] uppercase font-bold tracking-widest opacity-60">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
