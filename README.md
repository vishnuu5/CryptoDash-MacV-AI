# CryptoDash - Cryptocurrency Dashboard

A modern, responsive cryptocurrency dashboard built with Next.js, TypeScript, and the CoinGecko API. Track cryptocurrency prices, view detailed charts, and build your personal watchlist.

## DEMO 

Click Here ==>  [See demo](https://crypto-dash-mac-v-ai.vercel.app)
## 🚀 Features

### Core Features

- **Markets List**: Browse top cryptocurrencies with pagination (50 coins per page)
- **Search & Filter**: Real-time search with debouncing and sorting options
- **Coin Details**: Detailed view with price charts and comprehensive information
- **Watchlist**: Personal watchlist with localStorage persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Bonus Features

- **Loading Skeletons**: Smooth loading states throughout the app
- **Error Handling**: Comprehensive error states with retry functionality
- **Debounced Search**: Optimized API calls with 300ms debounce
- **Interactive Charts**: Price charts with multiple time ranges (24h, 7d, 30d, 90d)
- **Persistent Watchlist**: Watchlist data persists across browser sessions
- **Modern UI**: Clean, professional design with shadcn/ui components

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **API**: CoinGecko API v3

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/vishnuu5/CryptoDash-MacV-AI.git
cd crypto-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here
```

> **Note**: The API key is optional for development. The app will work with CoinGecko's free tier, but having an API key provides higher rate limits.

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Getting a CoinGecko API Key

1. Visit [CoinGecko Developer Dashboard](https://www.coingecko.com/en/developers/dashboard)
2. Create an account or sign in
3. Create a "Free Demo Account"
4. Generate an API key
5. Add the API key to your `.env.local` file

## 📱 Pages & Features

### 1. Markets List (`/`)

- **Paginated Table**: 50 cryptocurrencies per page
- **Columns**: Rank, Coin (icon + name + symbol), Price, 24h %, Market Cap, Volume, Watchlist
- **Search**: Real-time search by name or symbol
- **Filters**: Sort by market cap, 24h change, or volume
- **Loading States**: Skeleton loaders during data fetching
- **Error Handling**: Retry functionality for failed requests

### 2. Coin Details (`/coin/[id]`)

- **Comprehensive Info**: Price, market cap, volume, rank, supply data
- **Interactive Charts**: Price charts with 24h, 7d, 30d, 90d ranges
- **Market Statistics**: ATH, ATL, circulating supply, total supply
- **About Section**: Coin description and official links
- **Watchlist Integration**: Add/remove from watchlist

### 3. Watchlist (`/watchlist`)

- **Personal Tracking**: View all watchlisted cryptocurrencies
- **Real-time Prices**: Current market data for watchlisted coins
- **Persistent Storage**: Data saved in localStorage
- **Empty State**: Helpful message when watchlist is empty

## 🔧 Key Components

### API Layer (`lib/api.ts`)

- **fetchCoinsMarkets**: Get paginated market data
- **fetchCoinDetails**: Get detailed coin information
- **fetchCoinChart**: Get historical price data
- **fetchCoinsById**: Get specific coins for watchlist

### State Management

- **Watchlist Context**: Global watchlist state with localStorage persistence
- **Custom Hooks**: useDebounce for optimized search performance
- **Local State**: Component-level state for UI interactions

### Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode Ready**: CSS variables for easy theme switching

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_COINGECKO_API_KEY` with your API key

### Alternative Deployment Options

- **Netlify**: Connect GitHub repo and deploy
- **Railway**: Simple deployment with GitHub integration
- **Self-hosted**: Build and serve with `npm run build && npm start`

## 🎯 Performance Optimizations

- **Debounced Search**: 300ms delay to reduce API calls
- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: Browser caching for API responses
- **Lazy Loading**: Components load as needed

## 🐛 Troubleshooting

### Common Issues

1. **API Rate Limiting**

   - Solution: Get a free API key from CoinGecko
   - Add to `.env.local` as `NEXT_PUBLIC_COINGECKO_API_KEY`

2. **Images Not Loading**

   - Check `next.config.mjs` has correct image domains
   - Ensure `coin-images.coingecko.com` is allowed

3. **Watchlist Not Persisting**

   - Check browser localStorage is enabled
   - Clear localStorage and try again: `localStorage.clear()`

4. **Build Errors**
   - Run `npm run lint` to check for TypeScript errors
   - Ensure all dependencies are installed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
