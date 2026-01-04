# 🚀 Crypto Pulse

A modern, feature-rich Progressive Web App (PWA) for tracking cryptocurrency prices, trends, and market data in real-time. Built with React 18, Vite, and Tailwind CSS.

![Crypto Pulse](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Features
- **Real-time Price Tracking** - Live cryptocurrency prices with auto-refresh
- **Multi-Currency Support** - View prices in your local currency (USD, EUR, INR, GBP, JPY, and more)
- **Advanced Charts** - Interactive price charts with technical indicators (RSI, MACD, Bollinger Bands)
- **Market Analytics** - Comprehensive market data including volume, market cap, and price changes
- **Search & Filter** - Quickly find coins and filter by gainers, losers, or high volume
- **Infinite Scroll** - Seamlessly browse through thousands of cryptocurrencies

### 🔐 User Features
- **Firebase Authentication** - Secure login with Email/Password and Google Sign-In
- **Personal Watchlist** - Save and track your favorite cryptocurrencies
- **Portfolio Management** - Track your crypto holdings and performance
- **Learn Section** - Educational resources about cryptocurrency and blockchain

### 🎨 Design & UX
- **Dark Crypto Aesthetic** - Stunning dark theme with neon gradients and glassmorphism
- **Mobile-First Design** - Fully responsive across all devices
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Particle Effects** - Dynamic background animations
- **Voice Search** - Search coins using voice commands (experimental)

### ⚡ Performance
- **PWA Support** - Install as a native app on mobile and desktop
- **Offline Capability** - Service worker for offline functionality
- **Optimized Caching** - Smart API caching to reduce load times
- **Lazy Loading** - Code splitting for faster initial load

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router** - Client-side routing
- **Chart.js** - Beautiful, responsive charts

### Backend & Services
- **Firebase** - Authentication and Firestore database
- **CoinGecko API** - Comprehensive cryptocurrency data
- **Axios** - HTTP client with interceptors

### Additional Libraries
- **Lucide React** - Beautiful icon set
- **React Infinite Scroll** - Infinite scrolling component
- **LocalForage** - Offline storage
- **React Toastify** - Elegant notifications

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase account (for authentication)
- CoinGecko API key (optional, for higher rate limits)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishnukumar1802/crypto_pulse.git
   cd crypto_pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # CoinGecko API (Optional)
   VITE_COINGECKO_API_KEY=your_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

**Live Demo:** [https://crypto-pulse-ten-self.vercel.app/](crypto-pulse-five-red.vercel.app)

### Environment Variables on Vercel
Make sure to add all `VITE_*` environment variables in:
`Project Settings → Environment Variables`

## 📱 Features Breakdown

### Home Page
- Global market statistics
- Currency converter
- Searchable coin list with filters
- Real-time price updates
- Infinite scroll pagination

### Coin Detail Page
- Detailed price charts (1D, 7D, 30D, 1Y)
- Technical indicators (RSI, MACD, Bollinger Bands)
- Market analytics
- Community and developer stats
- Price predictions

### Watchlist (Protected)
- Save favorite coins
- Quick access to tracked cryptocurrencies
- Real-time updates

### Portfolio (Protected)
- Track your crypto holdings
- Calculate total portfolio value
- View profit/loss

### Learn Section
- Cryptocurrency basics
- Blockchain technology
- Trading strategies
- Security best practices

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (`#06B6D4`) to Blue (`#3B82F6`) gradients
- **Background**: Deep space dark (`#0F0F23`)
- **Surface**: Slate with glassmorphism
- **Accents**: Neon cyan, purple, and pink

### Typography
- **Font Family**: System fonts optimized for readability
- **Headings**: Bold, gradient text
- **Body**: Slate colors with proper contrast

## ⚠️ Known Issues & Limitations

### CoinGecko API Rate Limits
The free tier of CoinGecko API has strict rate limits (10-50 calls/minute). If you see a blank screen or error messages:

1. **Wait 1-2 minutes** before refreshing
2. **Get a CoinGecko API key** for higher limits
3. **Reduce polling frequency** in the code if needed

The app now shows helpful error messages instead of a blank screen when rate limited.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for the comprehensive crypto API
- [Firebase](https://firebase.google.com/) for authentication and database
- [Vercel](https://vercel.com/) for hosting
- The React and Vite communities for amazing tools

## 📞 Contact

**Vishnu Kumar** - [@vishnukumar1802](https://github.com/vishnukumar1802)

**Project Link:** [https://github.com/vishnukumar1802/crypto_pulse](https://github.com/vishnukumar1802/crypto_pulse)

**Live Demo:** [(crypto-pulse-five-red.vercel.app)]

---

⭐ **Star this repo** if you find it helpful!
