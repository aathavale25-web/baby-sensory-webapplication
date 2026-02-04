# Installation Guide

This guide will help you set up Baby Sensory World on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

Optional:
- **Supabase account** (for cloud storage) - [Sign up here](https://supabase.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/aathavale25-web/baby-sensory-webapplication.git
cd baby-sensory-webapplication
```

### 2. Install Dependencies

```bash
npm install
```

Or if you're using yarn:

```bash
yarn install
```

### 3. Environment Setup (Optional)

If you want to use Supabase for cloud storage:

1. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

See the [Supabase Setup](Supabase-Setup) guide for detailed instructions.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173 (or next available port)
- **Network**: http://192.168.x.x:5173 (accessible from other devices)

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment Options

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy
```

### Other Platforms

The built files in `dist/` can be deployed to any static hosting service:
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront
- DigitalOcean App Platform

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port.

### Dependencies Installation Fails

Try clearing the npm cache:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Ensure you're using Node.js v16 or higher:

```bash
node --version
```

## Next Steps

- [Supabase Setup](Supabase-Setup) - Configure cloud database
- [Quick Start Guide](Quick-Start-Guide) - Learn how to use the app
- [Architecture Overview](Architecture-Overview) - Understand the codebase

## System Requirements

### Minimum Requirements
- 2 GB RAM
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Supabase features)

### Recommended
- 4 GB RAM
- Chrome or Safari for best performance
- Tablet or larger screen for optimal experience
