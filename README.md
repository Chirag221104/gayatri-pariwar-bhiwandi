# Gayatri Pariwar Bhiwandi

The official community portal for **Gayatri Pariwar, Bhiwandi Branch** — a spiritual organization dedicated to the teachings of **Pt. Shriram Sharma Acharya** and the vision of AWGP (All World Gayatri Pariwar).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)

---

## ✨ Features

### 👑 Admin Dashboard (Secure)
A powerful, light-mode optimized interface for managing all aspects of the application.
- **Media Management**: 
    - Full-featured file manager with folder support.
    - Drag-and-drop uploads for images and videos.
    - Public URL generation and clipboard copy.
- **Spiritual Content Studio**: 
    - **Mantra Manager**: Create and edit mantras with audio links and color coding.
    - **Daily Quotes**: Schedule daily inspiration with rich text and background controls.
    - **Good Thoughts/Tips**: Manage snippets of wisdom for the home screen.
- **Event & News Control**: 
    - **Events**: Create rich event pages with date, time, location maps, and responsible person details.
    - **News**: Publish community announcements with full HTML editing capabilities.
- **Service Request System**: Track and manage community service requests (Sanskar requests).
- **Audit Logging**: Comprehensive activity log tracking who changed what and when.
- **User Management**: Role-based access control (Admin, Super Admin).

### 🕉️ Spiritual Content
- **Daily Darshan**: Daily inspirational quotes with beautiful image cards, shareable and downloadable.
- **Wisdom Cards**: Premium quote cards generated dynamically with branding.
- **Resources**: Library of PDF books, audio tracks, and videos.

### 📰 News & Events
- **News Feed**: Latest announcements and community news with full-page articles.
- **Events Calendar**: Upcoming and past events with detailed descriptions and image galleries.
- **RSVP**: Integration for event registration (coming soon).

### 🖼️ Media Gallery
- **Folder-based Organization**: Browse media organized into folders and sub-folders.
- **Lightbox Preview**: Full-screen image preview with keyboard navigation.
- **One-click Downloads**: Cross-origin safe downloads with automatic file extensions.

### 🌐 Multilingual Support
- **4 Languages**: Full localization in English, Hindi, Marathi, and Gujarati.
- **Indic Script Optimization**: Correct rendering of Devanagari and Gujarati scripts.

### 🎨 Design Philosophy
- **Modern Aesthetic**: Glassmorphism UI with subtle gradients and motion effects.
- **Dual Theme**: Fully supported Dark & Light modes with automatic switching.
- **Admin Focus**: The Admin panel is optimized for **Light Mode** to provide a clean, distraction-free, and professional workspace for content management.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Backend | [Firebase](https://firebase.google.com/) (Firestore, Storage, Auth) |
| Localization | [next-intl](https://next-intl-docs.vercel.app/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Chirag221104/gayatri-pariwar-bhiwandi.git

# Navigate to the project
cd gayatri-pariwar-bhiwandi

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── messages/          # Localization files (en, hi, mr, gu)
├── public/            # Static assets (images, icons)
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── [locale]/  # Localized routes
│   │   │   ├── admin/ # Protected Admin Dashboard
│   │   │   ├── events/
│   │   │   ├── news/
│   │   │   ├── spiritual/
│   │   │   ├── media/
│   │   │   └── ...
│   │   └── api/       # API routes
│   ├── components/    # Reusable UI components
│   └── lib/           # Utilities and Firebase config
└── ...
```

---

## 🔧 Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🌍 Deployment

This project is optimized for **Vercel** deployment:

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → Import Project.
3. Select this repository.
4. Add your environment variables.
5. Click **Deploy**.

---

## 📜 License

This project is for the Gayatri Pariwar Bhiwandi community. All rights reserved.

---

## 🙏 Acknowledgements

- **All World Gayatri Pariwar (AWGP)** for spiritual guidance.
- **Pt. Shriram Sharma Acharya** for eternal wisdom.
- The Bhiwandi community for their dedication.

---

<p align="center">
  <strong>🙏 Jai Gurudev 🙏</strong>
</p>