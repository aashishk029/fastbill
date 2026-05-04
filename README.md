# FastBill - MVP Deployment Guide

**Status:** MVP Complete ✅  
**Built:** May 2026  
**For:** Aashish (First Customer)  

---

## What You Have

A complete working billing app with:
- ✅ User authentication (phone/OTP)
- ✅ Create invoices in <30 seconds
- ✅ Track inventory items
- ✅ View today's sales
- ✅ Simple Hindi/English UI
- ✅ Mobile-first design
- ✅ Cloud database (Supabase)

---

## Deployment in 5 Steps

### Step 1: Set Up Supabase

1. Go to https://supabase.com
2. Click "Start your project"
3. Create new project (free tier is fine)
4. Note your URL and keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Create Database Tables

Go to Supabase SQL editor and run:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR,
  phone VARCHAR UNIQUE,
  shop_name VARCHAR NOT NULL,
  language VARCHAR DEFAULT 'hi',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  date DATE NOT NULL
);

-- Invoice Items table
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  item_name VARCHAR NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_name VARCHAR NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only see their own data)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own inventory" ON inventory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory" ON inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory" ON inventory
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory" ON inventory
  FOR DELETE USING (auth.uid() = user_id);

-- Dues table (बकाया tracking - ग्राहक और सप्लायर)
CREATE TABLE dues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE dues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own dues" ON dues
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dues" ON dues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dues" ON dues
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dues" ON dues
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_dues_user_type ON dues(user_id, type);
```

### Step 3: Configure Environment

1. Copy `.env.local.example` → `.env.local`
2. Paste your Supabase URL and keys
3. Save

### Step 4: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import this repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

**That's it!** Your app is now live. 🚀

---

## Local Development

Want to test locally first?

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in browser
```

---

## Testing the App

1. **Sign Up**
   - Use your phone number
   - Enter OTP (6 digits)
   - Create shop profile
   - Select language

2. **Create Invoice**
   - Click "नई बिल"
   - Add item name, quantity, price
   - Click "बिल तैयार करो"
   - View/Print invoice

3. **Check Sales**
   - Click "आज की बिक्री"
   - See today's total
   - View last 7 days trend
   - Add notes

4. **Manage Inventory**
   - Click "सामान"
   - Add new items
   - Use [+] [-] to update quantities
   - See total inventory value

---

## Architecture Overview

```
Frontend (Next.js)
├─ Login/Signup
├─ Dashboard
├─ Invoice Creation
├─ Sales View
└─ Inventory

Backend (Supabase)
├─ PostgreSQL Database
├─ Authentication (Phone OTP)
├─ Row Level Security (user isolation)
└─ Real-time sync

Hosting (Vercel)
└─ Automatic deployment from git
```

---

## Key Features for MVP

✅ **Dead Simple UI** - 3 screens, big buttons, no complexity  
✅ **Hindi Support** - Full Devanagari support  
✅ **Mobile First** - Works perfectly on Android/iOS  
✅ **Offline Ready** - Data syncs when online  
✅ **Zero Server Costs** - Supabase free tier  
✅ **Instant Deployment** - Deploy on Vercel in minutes  

---

## What's NOT in MVP (Phase 2)

- Payment integration
- GST calculations
- Payroll
- Multi-location
- Advanced reporting
- Email/SMS notifications
- API for POS systems

---

## Support

For issues or questions:
- WhatsApp: [Your support number]
- Email: [Your email]

---

## Next Steps

1. **Deploy this week** (5 mins)
2. **Test with your real shop** (Day 1)
3. **Invite 5 shopkeeper friends** (Week 2)
4. **Collect feedback** (Week 2-3)
5. **Add 1 feature based on feedback** (Week 3-4)
6. **Share with associations** (Week 5)

---

**Let's build this! 🚀**

FastBill is your path to ₹500Cr+ business and ₹100Cr+ for Natrium R&D.

Go. Ship. Scale.
