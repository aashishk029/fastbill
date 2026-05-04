# FastBill - दुकान का बिल

Simple invoice and inventory management app for Indian shopkeepers.

## Features

- 📱 Mobile-first responsive design
- 💳 Invoice creation and tracking
- 📊 Inventory management
- 💰 Receivables tracking (dues)
- 🔐 Secure authentication with Supabase
- 🌐 Bilingual interface (Hindi/English)
- 📈 Daily sales tracking

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with OTP
- **Deployment**: Vercel

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

## Deployment

### Using Vercel (Recommended)

1. **Go to** https://vercel.com/dashboard
2. **Click** "Add New" → "Project"
3. **Click** "Import Git Repository"
4. **Search for** "fastbill" repository
5. **Click** "Import"
6. **Click** "Deploy"

Vercel will automatically:
- Detect Next.js configuration
- Install dependencies
- Build the application
- Deploy to production

### Environment Variables

When deploying on Vercel, add these environment variables in Project Settings:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
fastbill/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/Login page
│   ├── dashboard/         # Main dashboard
│   ├── invoice/           # Invoice creation & viewing
│   ├── sales/             # Daily sales tracking
│   ├── inventory/         # Inventory management
│   ├── dues/              # Receivables tracking
│   └── globals.css        # Global styles
├── lib/                    # Utility functions
│   ├── supabase.ts        # Supabase client
│   └── translations.ts    # i18n translations
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind configuration
└── vercel.json            # Vercel deployment config
```

## Authentication

FastBill uses OTP-based authentication via Supabase:

1. User enters phone number
2. Receives OTP via SMS
3. Enters OTP to verify
4. Creates shop profile
5. Access to full application

## Database Schema

Uses Supabase with Row-Level Security (RLS) for data isolation.

Tables:
- `users` - Shop owner accounts
- `invoices` - Invoice records
- `invoice_items` - Line items
- `inventory` - Product tracking
- `dues` - Customer/supplier balances

## Browser Support

- Chrome/Safari/Edge (latest)
- Mobile browsers
- Responsive design for all screen sizes

## Contributing

This is a project in active development.

## License

MIT

---

**Version**: 0.1.0  
**Last Updated**: May 2026
