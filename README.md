# 🃏 FlashCards - Learning Made Beautiful

A beautiful and elegant flashcard application built with React and Framer Motion, featuring a playing card design for an engaging learning experience.

## ✨ Features

### 🎯 Topic Management
- **Create & Edit Topics**: Organize your learning materials into topics
- **Rich Descriptions**: Add detailed descriptions for each topic
- **Smart Organization**: Keep your learning structured and accessible

### 🃏 Beautiful Flashcard Design
- **Playing Card Aesthetic**: Elegant card design with rounded corners and shadows
- **Dark Theme**: Sophisticated dark mode with classy color scheme
- **Smooth Animations**: Vivid CSS transitions and Framer Motion animations

### 🚀 Interactive Learning
- **Flip Animation**: Smooth 3D card flip to reveal answers
- **Hint System**: Reveal helpful clues before seeing the full answer
- **Navigation**: Easy navigation between cards with visual indicators
- **Card Management**: Edit and delete cards on the fly

### 📱 Responsive Design
- **Mobile First**: Optimized for all device sizes
- **Touch Friendly**: Smooth interactions on mobile devices
- **Adaptive Layout**: Responsive grid and card layouts

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Animations**: Framer Motion for smooth interactions
- **Styling**: CSS3 with CSS Variables and Flexbox/Grid
- **Icons**: Lucide React for beautiful icons
- **Storage**: Local Storage for data persistence
- **Deployment**: GitHub Pages with GitHub Actions CI/CD

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FlashCards.git
   cd FlashCards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
FlashCards/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TopicPanel.js          # Main topic management interface
│   │   ├── TopicForm.js           # Topic creation/editing modal
│   │   ├── CardForm.js            # Flashcard creation/editing modal
│   │   ├── FlashcardDeck.js       # Flashcard study interface
│   │   ├── Flashcard.js           # Individual flashcard component
│   │   └── *.css                  # Component-specific styles
│   ├── App.js                     # Main application component
│   ├── App.css                    # Main application styles
│   ├── index.js                   # Application entry point
│   └── index.css                  # Global styles and CSS variables
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions deployment workflow
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🎨 Design Features

### Playing Card Aesthetic
- **Card Suits**: Spades (♠) for questions, Hearts (♥) for answers
- **Corner Indicators**: Q for questions, A for answers
- **Gradient Backgrounds**: Subtle gradients for depth
- **Rounded Corners**: Modern card-like appearance

### Animation System
- **3D Flip**: Smooth card rotation with perspective
- **Fade Transitions**: Elegant card switching animations
- **Hover Effects**: Interactive feedback on all elements
- **Loading States**: Smooth loading and transition animations

### Color Scheme
- **Primary**: Indigo (#6366f1) for main actions
- **Secondary**: Purple (#8b5cf6) for accents
- **Success**: Green (#10b981) for positive actions
- **Warning**: Amber (#f59e0b) for hints
- **Danger**: Red (#ef4444) for destructive actions

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as source
   - The workflow will automatically deploy on push

3. **Custom Domain** (Optional)
   - Add your domain in the workflow file
   - Configure DNS settings for your domain

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 🔧 Customization

### Adding New Features
- **Database Integration**: Replace localStorage with a backend API
- **User Authentication**: Add user accounts and data sync
- **Progress Tracking**: Implement learning progress and statistics
- **Spaced Repetition**: Add intelligent review scheduling

### Styling Changes
- **CSS Variables**: Modify colors in `src/index.css`
- **Card Design**: Update card styles in `src/components/Flashcard.css`
- **Layout**: Adjust responsive breakpoints in component CSS files

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, CSS Variables, ES6+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Inter Font** for elegant typography
- **CSS Grid & Flexbox** for modern layouts

## 📞 Support

- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact for business inquiries

---

Made with ❤️ and ☕ by [Your Name]
# flashcards
