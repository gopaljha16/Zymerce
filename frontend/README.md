# Zymerce Frontend - React E-Commerce Platform

Modern, responsive e-commerce frontend built with React 19, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Premium design with glassmorphism effects and animated gradients
- **State Management**: Redux Toolkit with 4 slices (products, cart, wishlist, auth)
- **Authentication**: JWT-based authentication with token refresh
- **AI Chatbot**: Real-time streaming responses with Google Gemini AI
- **Responsive Design**: Mobile-first approach with 4 breakpoints (sm, md, lg, xl)
- **Performance**: Skeleton loading, lazy loading, and optimized re-renders
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

## 📦 Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Heroicons** - Icon library
- **Recharts** - Data visualization
- **React Hot Toast** - Toast notifications

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running (Django REST Framework)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gopaljha16/zymerce.git
   cd zymerce/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend URL:
   ```env
   VITE_DJANGO_BASE_URL=http://127.0.0.1:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open browser**
   ```
   http://localhost:5173
   ```

## 🌐 Deployment

### Deploy to Vercel

#### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables**
   ```bash
   vercel env add VITE_DJANGO_BASE_URL production
   ```
   Enter your production backend URL when prompted.

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

#### Option 2: Deploy via Vercel Dashboard

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import project on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root

3. **Configure build settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add environment variables**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_DJANGO_BASE_URL` = `https://your-backend-api.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Set environment variables**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_DJANGO_BASE_URL`

### Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/zymerce/',
     plugins: [react(), tailwindcss()],
   })
   ```

3. **Add deploy script to package.json**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Build Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
│   ├── icon.svg        # App icon
│   ├── manifest.json   # PWA manifest
│   ├── robots.txt      # SEO robots file
│   └── sw.js           # Service worker
├── src/
│   ├── assets/         # Images, fonts
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── AIChatbot.jsx
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── ProductList.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   └── ...
│   ├── store/          # Redux store
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── productSlice.js
│   │       ├── cartSlice.js
│   │       └── wishlistSlice.js
│   ├── utils/          # Utility functions
│   │   ├── auth.js
│   │   ├── currency.js
│   │   └── payment.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables (local)
├── .env.production     # Production environment variables
├── .env.example        # Environment variables template
├── vercel.json         # Vercel configuration
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
└── README.md           # This file
```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_DJANGO_BASE_URL` | Backend API URL | `https://api.zymerce.com` |

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in the frontend.

## 🎨 Customization

### Colors
Edit `frontend/src/index.css`:
```css
@theme {
  --color-primary: #0f5132;
  --color-primary-dark: #0a3622;
  --color-secondary: #f59e0b;
}
```

### Fonts
Update Google Fonts import in `frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
```

## 🐛 Troubleshooting

### Build Errors

**Issue:** `Module not found` errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Environment variables not working
- Ensure variables are prefixed with `VITE_`
- Restart dev server after changing `.env`
- Check `.env` file is in the `frontend` directory

### Deployment Issues

**Issue:** 404 on page refresh (Vercel/Netlify)
- Ensure `vercel.json` has proper rewrites configuration
- For Netlify, add `_redirects` file:
  ```
  /*    /index.html   200
  ```

**Issue:** API calls failing in production
- Check `VITE_DJANGO_BASE_URL` is set correctly
- Ensure backend CORS is configured for your frontend domain
- Check browser console for CORS errors

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: ~200KB (gzipped)

## 🔒 Security

- JWT tokens stored in Redux + localStorage
- HTTPS enforced in production
- XSS protection with React's built-in escaping
- CSRF protection via Django backend
- Secure environment variable handling

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

**Developer:** Gopaljha16  
**Project Link:** [https://github.com/Gopaljha16/zymerce](https://github.com/Gopaljha16/zymerce)

---

Built with ❤️ using React 19 and Tailwind CSS
