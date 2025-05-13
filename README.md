# AI-Powered Health Check-Up Recommendations Platform with Personalized Insights

Eazypaths is a comprehensive health management platform that leverages AI to provide personalized health check-up recommendations, BMI analysis, and interactive health assistance. The platform helps users make informed health decisions by analyzing medical reports, tracking health metrics, and providing AI-powered health guidance.

The platform combines modern web technologies with artificial intelligence to deliver features including:
- AI-powered analysis of medical reports and blood test results
- Real-time BMI calculations with personalized recommendations
- Interactive health assistant for answering health-related queries
- Comprehensive health profile management
- Secure authentication and data storage using Supabase
- Responsive design with dark/light theme support

## Repository Structure
```
.
├── app/                      # Next.js application pages and API routes
│   ├── api/                 # API endpoints for health analysis, BMI, and assistant features
│   ├── auth/                # Authentication related routes
│   └── [features]/         # Feature-specific pages (dashboard, health metrics, etc.)
├── components/              # Reusable React components
│   ├── ui/                 # UI component library (buttons, cards, forms, etc.)
│   └── [feature]/         # Feature-specific components
├── contexts/               # React context providers (auth, theme)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and service integrations
├── styles/                 # Global styles and CSS modules
└── types/                  # TypeScript type definitions
```

## Usage Instructions
### Prerequisites
- Node.js 18.x or higher
- npm or pnpm package manager
- Supabase account and project
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eazypaths
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

4. Run the development server:
```bash
pnpm dev
```

### Quick Start
1. Create an account or log in
2. Complete your health profile in the onboarding process
3. Access features from the dashboard:
   - Upload medical reports for AI analysis
   - Calculate and track BMI
   - Chat with the AI health assistant
   - Monitor health metrics

### More Detailed Examples

**Using the AI Health Assistant:**
```typescript
// Example chat interaction
const response = await fetch('/api/health-assistant', {
  method: 'POST',
  body: JSON.stringify({ query: 'What are the symptoms of dehydration?' })
});
```

**BMI Analysis:**
```typescript
// Example BMI calculation
const bmiAnalysis = await fetch('/api/bmi-analysis', {
  method: 'POST',
  body: JSON.stringify({ height: 175, weight: 70 })
});
```

### Troubleshooting

1. Authentication Issues
   - Error: "Authentication Error"
   - Solution: Clear browser cookies and try logging in again
   - Check Supabase connection status at /supabase-status

2. API Response Errors
   - Enable debug mode: Add ?debug=true to API endpoints
   - Check browser console for detailed error messages
   - Verify environment variables are correctly set

3. Performance Issues
   - Monitor network tab for slow requests
   - Check browser console for memory warnings
   - Verify Supabase connection health

## Data Flow
The platform processes health data through a secure pipeline from user input to AI analysis and storage.

```ascii
User Input → API Routes → AI Processing → Supabase Storage
     ↑          ↓             ↓              ↓
     └──── Response ←── Analysis ←─── Database Query
```

Key interactions:
- User data is securely stored in Supabase
- Health metrics are processed through AI models
- Real-time analysis results are cached for performance
- Authentication state is managed via context
- API routes handle data validation and processing
- Error handling at each step with user feedback

## Infrastructure

![Infrastructure diagram](./docs/infra.svg)

### Vercel Deployment
- **Environment**: Production and Preview environments
- **Build Process**: Node.js 18 runtime
- **CI/CD Pipeline**: GitHub Actions workflow

### Database (Supabase)
- Tables:
  - profiles: User health profiles
  - health_metrics: User health measurements
  - health_concerns: User health issues
  - health_reports: Medical report storage

### Authentication
- Supabase Authentication
- Protected API routes
- Session management

## Deployment

1. Prerequisites:
   - Vercel account
   - GitHub repository access
   - Supabase project setup

2. Setup:
```bash
vercel link
vercel env pull
```

3. Deploy:
```bash
vercel deploy
```

4. Monitor:
   - Check deployment status in Vercel dashboard
   - Verify environment variables
   - Test authentication flow
