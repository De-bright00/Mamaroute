# MamaRoute

MamaRoute is a modern maternal emergency coordination platform built to connect pregnant women in crisis to nearby partner hospitals and ambulance fleets across Nigeria (initially Abuja and Lagos).

## Tech Stack
- **Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (full-stack React SSR)
- **Styling:** Vanilla CSS & Tailwind CSS
- **Database / Backend:** [Supabase](https://supabase.com)
- **AI Engine:** [OpenAI API](https://openai.com) (GPT-4o-mini)
- **Deployment:** [Vercel](https://vercel.com)

## Key Features
1. **Emergency SOS System:**
   - Auth-free, one-tap trigger for rapid dispatch.
   - Real-time geolocation pin and directions routing between the user and nearest hospital.
   - Ticking arrival countdown timer.
2. **Interactive Hospital Directory:**
   - Searchable, tabbed view filtering between Lagos and Abuja networks.
   - Verified available bed counts and ambulance fleet sizes.
   - Telephone calling integration.
3. **AI Maternal Assistant:**
   - Clinical safety trigger checks messages for danger keywords (e.g. bleeding, pain) and prompts users with direct inline SOS buttons.
   - Warm, pidgin/local language-capable guides.
4. **Hospital Partner Dashboard:**
   - Real-time fleet management (available ambulances) and ward beds tracking.
   - Live dispatch console with Accept/Decline action workflows.

## Environment Variables Configuration

To run the application locally or deploy to Vercel, define the following variables:

```env
SUPABASE_URL="your-supabase-url"
SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
OPENAI_API_KEY="your-openai-api-key"
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```


