# FixLens app

Production starter for a Next.js app that uploads a repair photo to Supabase Storage, analyzes the photo plus user text with OpenAI, stores requests in Supabase tables, sells a paid handyman review with Stripe Checkout, and updates payment state from a Stripe webhook.

## Finished in this codebase
- real Next.js app structure
- real `/api/analyze` route wired to Supabase + OpenAI
- real `/api/create-checkout` route wired to Stripe
- real `/api/webhook` route wired to Stripe + Supabase
- reviewer dashboard page that reads from Supabase
- SQL for Supabase tables and storage bucket

## Still requires your accounts
I cannot create or insert your private production secrets for you. You must add your own OpenAI, Supabase, and Stripe keys.

I also cannot deploy to your GitHub repo, Vercel project, or DNS because I do not have access to those accounts.

## Setup
1. Copy `.env.example` to `.env.local`
2. Fill in all keys
3. In Supabase SQL editor, run:
   - `supabase/schema.sql`
   - `supabase/storage.sql`
4. Install dependencies with `npm install`
5. Run `npm run dev`

## Stripe webhook local testing
Run:
`stripe listen --forward-to localhost:3000/api/webhook`
Then copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Deploy to Vercel
1. Push this folder to GitHub
2. Import the repo into Vercel
3. Add the environment variables from `.env.local`
4. Add `fixlens.com` in Vercel project settings
5. Point your domain DNS to Vercel
6. Register your production Stripe webhook endpoint as `https://fixlens.com/api/webhook`
# fixlens-app
