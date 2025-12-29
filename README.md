# Content Intelligence OS

AI SaaS MVP for Content × Ads × Measurement Intelligence

## Overview

This is a demo-first AI SaaS MVP that helps brands, ad teams, and creators understand:
- What content features impact ad performance?
- How ads amplify creative value?
- How measurement feeds back into better creative decisions?

## Architecture

The system is built with clear layer separation:

```
[ Demo Data Layer ]
        ↓
[ Content Understanding Layer ]
        ↓
[ Ads Performance Layer ]
        ↓
[ Measurement Layer ]
        ↓
[ Insight & Recommendation Layer ]
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
  app/
    dashboard/
      content-overview/          # Page 1: Content Asset Hub
      content-ads-performance/   # Page 2: Content × Ads Performance
      measurement-insights/      # Page 3: Measurement & AI Insights
  components/
    cards/                       # MetricCard, InsightCard, RecommendationBlock
    charts/                      # TrendChart
    tables/                      # ContentAssetTable
    badges/                      # CreativeFeatureBadge
    ui/                          # Base UI components (Button, Card, Badge)
  lib/
    demo-data/                   # Mock data (content, ads, measurements)
    content/                     # Content asset functions
    ads/                         # Ads metrics functions
    measurement/                 # Measurement functions
    insights/                    # Rule-based insight generation
  types/                         # TypeScript type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Pages

### 1. Content Overview (`/dashboard/content-overview`)
- Video Asset List with filters
- Display: Platform, Duration, Creative Tags, Views, CTR, ROAS
- Filter by platform (YouTube, Meta, TikTok)

### 2. Content × Ads Performance (`/dashboard/content-ads-performance`)
- Select a content asset to view detailed performance
- Metrics: Ad Spend, CTR, ROAS, Impressions
- Performance trend charts
- Creative feature breakdown
- Creative fatigue indicator

### 3. Measurement & AI Insights (`/dashboard/measurement-insights`)
- Asset-specific insights
- Global insights
- AI recommendations (rule-based, marked as "Future AI Model Plug-in")
- Suggested video length, hook type, pacing

## Demo Data

All data is mock but realistic:
- 6 content assets across YouTube, Meta, TikTok
- Ads metrics with multiple spend cycles
- Measurement scores (hook, engagement, scale potential)
- Rule-based insights and recommendations

## Future Integration Points

The codebase clearly marks where real integrations would be added:
- `// Future: Replace with real API call` - API integrations
- `// Future: AI Model Plug-in (Future)` - AI model inference
- Real Ads API integration (Meta, Google, TikTok)
- Multi-channel expansion
- Organic Content Intelligence

## Notes

- All UI text is in English
- No real third-party API connections
- No authentication logic
- Demo data only (mock but realistic)
- Architecture clarity > engineering perfection

## Development

- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint`

---

Built for demo purposes - ready for full rebuild with real APIs and AI models.

