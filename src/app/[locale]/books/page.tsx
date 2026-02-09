'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { Search, BookOpen, Filter } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/ui/PageHeader';

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl?: string;
    category: string;
    tags: string[];
    isActive: boolean;
    description?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "circOut"
        }
    }
};

export default function BooksPage() {
    const t = useTranslations('books');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>(['All']);

    const locale = useLocale();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const q = query(
                    collection(db, 'granthalaya_app', 'inventory', 'books'),
                    where('isActive', '==', true)
                );

                const querySnapshot = await getDocs(q);
                const fetchedBooks: Book[] = [];
                const uniqueCategories = new Set<string>(['All']);

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const book = {
                        id: doc.id,
                        title: data.title || 'Untitled',
                        author: data.author || 'Unknown',
                        price: data.price || 0,
                        coverUrl: data.coverUrl || null,
                        category: data.category || 'General',
                        tags: data.tags || [],
                        isActive: data.isActive ?? true,
                        description: data.description
                    };
                    fetchedBooks.push(book);
                    if (book.category) uniqueCategories.add(book.category);
                });

                setBooks(fetchedBooks);
                setCategories(Array.from(uniqueCategories));
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-background min-h-screen pb-24 font-body">
            {/* Unified Hero Header */}
            <PageHeader
                badge={t('header.badge')}
                title={t('header.title')}
                description={t('header.desc')}
                imageSrc="/books-hero.png" // User should ensure this exists or I'll generate it if needed
                imageAlt="Divine Books"
            />

            <div className="container mx-auto px-6 -mt-16 relative z-20">
                {/* Search & Filter Section */}
                <div className="flex flex-col gap-10 mb-16">
                    {/* Search Bar - Premium Glass Focus */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative max-w-4xl mx-auto w-full group"
                    >
                        <div className="absolute inset-0 bg-saffron/5 blur-[50px] rounded-full group-focus-within:bg-saffron/10 transition-all duration-700"></div>
                        <div className="relative glass rounded-3xl p-2 border-white/40 shadow-2xl transition-all duration-500 group-focus-within:border-saffron/30 group-focus-within:shadow-saffron/10">
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 rounded-2xl bg-background/50 border-none focus:ring-0 outline-none transition-all font-display font-bold text-xl placeholder:text-muted-foreground/30"
                            />
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-saffron/40 group-focus-within:text-saffron w-7 h-7 transition-colors" />
                        </div>
                    </motion.div>

                    {/* Category Filter - Premium Tabs */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Filter size={14} className="text-saffron" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('filter_by_category')}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`relative px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden group ${selectedCategory === cat
                                        ? 'text-white shadow-2xl shadow-saffron/30'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {/* Background layer */}
                                    <div className={`absolute inset-0 transition-all duration-500 ${selectedCategory === cat ? 'bg-saffron' : 'bg-surface hover:bg-white/5'}`}></div>

                                    {/* Gloss effect */}
                                    {selectedCategory === cat && (
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                                    )}

                                    <span className="relative z-10">{cat}</span>

                                    {/* Active dot */}
                                    {selectedCategory === cat && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Books Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-[450px] rounded-[2.5rem] bg-surface/50 animate-pulse border border-white/5"></div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            key={selectedCategory + searchQuery}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                        >
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <motion.div
                                        key={book.id}
                                        variants={itemVariants}
                                        className="group"
                                    >
                                        <div className="glass rounded-[2.5rem] overflow-hidden border-white/40 hover:border-saffron/30 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(245,158,11,0.15)] h-full flex flex-col group-hover:-translate-y-2">
                                            {/* Cover Container */}
                                            <div className="relative h-72 w-full bg-neutral-100 dark:bg-neutral-900/50 overflow-hidden">
                                                {book.coverUrl ? (
                                                    <Image
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-saffron/20 group-hover:scale-110 transition-transform duration-700">
                                                        <BookOpen size={64} />
                                                    </div>
                                                )}
                                                {/* Float Badge */}
                                                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-foreground text-[9px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full">
                                                    {book.category}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="p-8 flex flex-col flex-grow text-left">
                                                <h3 className="text-2xl font-black font-display leading-[1.2] mb-3 line-clamp-2 group-hover:text-saffron transition-colors" title={book.title}>
                                                    {book.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mb-6">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-saffron"></div>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{book.author}</p>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Price</span>
                                                        <span className="text-3xl font-black tracking-tighter">₹{book.price}</span>
                                                    </div>
                                                    <Link
                                                        href={`/${locale}/books/${book.id}`}
                                                        className="w-14 h-14 bg-saffron text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:rounded-[1.5rem] hover:rotate-6 hover:shadow-xl hover:shadow-saffron/30 group-hover:bg-saffron-dark active:scale-95 shadow-lg shadow-saffron/10"
                                                    >
                                                        <ArrowRight size={24} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-32 text-center">
                                    <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-8 text-muted-foreground/20">
                                        <Filter size={48} />
                                    </div>
                                    <p className="text-2xl font-bold opacity-40">{t('no_results')}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
