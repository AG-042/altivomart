# Altivomart Frontend

A modern Next.js e-commerce frontend for Altivomart, a Nigerian pay-on-delivery platform.

## Features

- **Homepage**: Product listing with clear stock status indicators
- **Product Details**: Comprehensive product information with image gallery
- **Checkout**: Seamless pay-on-delivery ordering process
- **Order Tracking**: Real-time order and delivery status tracking
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Nigerian Market Focus**: Localized for Nigerian customers

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **API Integration**: RESTful API with Django backend

## Design System

The application uses a trustworthy blue color palette:
- Primary: `#2563EB` (CTA buttons, highlights)
- Secondary: `#1E293B` (Navbar, headings)
- Accent: `#38BDF8` (Hover states, links)
- Success: `#22C55E` (In Stock indicators)
- Danger: `#EF4444` (Out of Stock indicators)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Django backend running on `http://localhost:8000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd altivomart_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── checkout/       # Checkout page
│   ├── products/       # Product pages
│   ├── track/          # Order tracking
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── ...            # Feature components
└── lib/               # Utilities and API
    ├── api.ts         # API functions
    └── utils.ts       # Helper utilities
```

## API Integration

The frontend connects to the Django backend with endpoints:
- `GET /api/products/` - List products
- `GET /api/products/{id}/` - Product details
- `POST /api/orders/create/` - Create order
- `GET /api/orders/{id}/` - Order details
- `GET /api/orders/{id}/track/` - Track delivery

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
