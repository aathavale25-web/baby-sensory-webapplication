# Baby Sensory World 🌟

An age-adaptive sensory web application designed for babies aged 4-12 months. Provides developmentally appropriate visual and interactive experiences that adapt to your baby's age and vision capabilities.

![Baby Sensory World](https://img.shields.io/badge/Age-4--12%20months-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Age-Adaptive Experience
- **4-6 Months**: High contrast colors, large objects, slow movement, extended touch persistence
- **7-9 Months**: More colors, moderate complexity, gentle interactions
- **10-12 Months**: Full palette, rich animations, dynamic engagement

### 👶 Personalized Interaction
- Baby's name in celebrations and milestones
- Custom profiles with cloud sync (Supabase)
- Progress tracking across sessions
- Age-appropriate feedback

### 🎨 Multiple Themes
- **Contrast World**: High contrast for youngest babies
- **Ocean**: Calming underwater scenes
- **Space**: Cosmic wonder with stars and planets
- **Rainbow**: Vibrant color spectrum
- **Garden**: Nature-themed animations
- **Animals**: Friendly creatures

### 📊 Progress Tracking
- Touch counting and streaks
- Milestone celebrations
- Color and object preferences
- Session analytics

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/aathavale25-web/baby-sensory-webapplication.git

# Navigate to directory
cd baby-sensory-webapplication

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Documentation

- **[Quick Start Guide](docs/wiki/Quick-Start-Guide.md)** - Get started in 5 minutes
- **[Installation Guide](docs/wiki/Installation-Guide.md)** - Detailed setup instructions
- **[Parent's Guide](docs/wiki/Parents-Guide.md)** - How to use with your baby
- **[Age-Adaptive System](docs/wiki/Age-Adaptive-System.md)** - How age profiles work
- **[Supabase Setup](docs/wiki/Supabase-Setup.md)** - Cloud storage configuration

[📚 View Full Documentation →](docs/wiki/Home.md)

## 🎮 How It Works

### Age Profiles

Each age group has a specific profile:

| Age | Objects | Colors | Speed | Touch Duration |
|-----|---------|--------|-------|----------------|
| 4-6 mo | 1-2 large | 5 high-contrast | Very slow (30%) | 3 seconds |
| 7-9 mo | 3-5 medium | 8 colors | Moderate (60%) | 2 seconds |
| 10-12 mo | 5-8 small | 14 colors | Full speed (100%) | Immediate |

### Automatic Adaptation

The app automatically adjusts:
- Object size and count
- Animation speed and complexity
- Color palette
- Touch feedback duration
- Background complexity
- Available themes

## 🛠️ Tech Stack

- **Framework**: React 18.2
- **Animation**: Framer Motion
- **Audio**: Howler.js
- **Database**: Supabase (PostgreSQL)
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Edge
- ⚠️ Mobile browsers (touch-enabled)

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Build for Production

```bash
npm run build
```

Built files will be in `dist/` directory.

## 🔒 Privacy & Safety

- **Minimal data collection**: Only first name and age
- **No tracking**: No analytics or third-party tracking
- **Local-first**: Works without internet (localStorage)
- **Optional cloud**: Supabase for cross-device sync
- **Parental control**: Settings panel for full control

## 🎓 Developmental Benefits

### Vision Development
- Tracking moving objects
- Color recognition
- Depth perception
- Visual focus

### Motor Skills
- Hand-eye coordination
- Touch precision
- Reaching accuracy

### Cognitive Growth
- Cause-and-effect learning
- Pattern recognition
- Decision making

## 👥 Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/wiki/Contributing-Guide.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Based on infant vision development research
- Inspired by Montessori principles
- Follows AAP screen time guidelines
- Built with love for little ones 💕

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/aathavale25-web/baby-sensory-webapplication/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aathavale25-web/baby-sensory-webapplication/discussions)
- **Documentation**: [Wiki](docs/wiki/Home.md)

## 🗺️ Roadmap

- [ ] Additional themes (Forest, Desert, Arctic)
- [ ] Multilingual support
- [ ] Offline PWA functionality
- [ ] Parent dashboard with insights
- [ ] Developmental milestone tracking
- [ ] Social sharing features

## ⭐ Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📖 Improving documentation
- 🔀 Contributing code

---

**Made with ❤️ for babies and parents everywhere**

[Get Started →](docs/wiki/Quick-Start-Guide.md)
