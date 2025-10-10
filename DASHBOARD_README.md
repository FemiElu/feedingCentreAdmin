# Church Admin Dashboard

A comprehensive dashboard for managing church feeding centers, built with Next.js 14, React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Dashboard Components

- **Dashboard Cards**: Display key metrics with loading states and trend indicators
- **Activity Feed**: Real-time activity log with action icons and timestamps
- **Birthday Chart**: Visual representation of birthdays by month
- **Newest Members Table**: Recent member registrations with quick actions
- **Quick Actions**: Import CSV, Send Broadcast, Add Member buttons

### Key Metrics

- **Total Members**: Count of all registered members
- **New This Month**: Members who joined in the current month
- **Upcoming Birthdays**: Birthdays in the next 7 days
- **Centers Count**: Number of active feeding centers

## 📁 File Structure

```
/app/dashboard/page.tsx          # Main dashboard page
/components/DashboardCard.tsx     # Reusable dashboard card component
/components/ActivityFeed.tsx      # Activity feed component
/components/SmallBarChart.tsx     # Birthday chart component
/lib/queries/dashboardQueries.ts # React Query hooks for data fetching
/lib/mockData/dashboardMockData.ts # Mock data and SQL samples
/components/__tests__/            # Unit tests for components
```

## 🛠️ Technical Stack

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **Supabase** for backend (with demo mode fallback)
- **Jest + React Testing Library** for testing

## 📊 Data Queries

### Supabase Queries

The dashboard uses optimized Supabase queries with React Query for caching:

```sql
-- Total members count
SELECT COUNT(*) as count FROM members;

-- New members this month
SELECT COUNT(*) as count FROM members
WHERE created_at >= date_trunc('month', now());

-- Upcoming birthdays (next 7 days)
SELECT COUNT(*) as count FROM members
WHERE dob_day IS NOT NULL AND dob_month IS NOT NULL
AND (
  (dob_month = EXTRACT(MONTH FROM now())
   AND dob_day BETWEEN EXTRACT(DAY FROM now()) AND EXTRACT(DAY FROM now() + INTERVAL '7 days'))
  OR
  (dob_month = EXTRACT(MONTH FROM now() + INTERVAL '1 month')
   AND dob_day <= EXTRACT(DAY FROM now() + INTERVAL '7 days'))
);

-- Recent activity logs
SELECT id, action, description, user_name, created_at, table_name
FROM audit_logs
ORDER BY created_at DESC
LIMIT 10;
```

## 🎨 Components

### DashboardCard

- Displays metrics with icons and trend indicators
- Loading skeleton states
- Responsive design
- Customizable styling

### ActivityFeed

- Real-time activity display
- Action-specific icons (CREATE, UPDATE, DELETE)
- Time formatting (relative and absolute)
- Empty state handling

### SmallBarChart

- Custom SVG bar chart for birthday data
- Responsive design
- Hover tooltips
- Loading states

## 🧪 Testing

Run tests for dashboard components:

```bash
npm test -- --testPathPattern="DashboardCard|ActivityFeed"
```

### Test Coverage

- **DashboardCard**: 10 test cases covering all props and states
- **ActivityFeed**: 10 test cases covering rendering, loading, and edge cases

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev
   ```

3. **Access dashboard**:
   - Main app: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env.local` for Supabase integration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: The app works in demo mode without Supabase configuration.

## 📱 Responsive Design

The dashboard is fully responsive with:

- **Mobile-first** approach
- **Grid layouts** that adapt to screen size
- **Touch-friendly** buttons and interactions
- **Accessible** components with ARIA attributes

## 🎯 Demo Mode

When Supabase is not configured, the app runs in demo mode with:

- Mock data for all dashboard metrics
- Simulated authentication
- Sample activity logs and member data
- Full UI functionality

## 🔄 Data Flow

1. **React Query hooks** fetch data from Supabase
2. **Caching** reduces API calls and improves performance
3. **Loading states** provide smooth user experience
4. **Error handling** gracefully manages failures
5. **Mock data** ensures functionality without backend

## 📈 Performance

- **React Query caching** with configurable stale times
- **Loading skeletons** for perceived performance
- **Optimized queries** with proper indexing
- **Lazy loading** of components
- **Minimal bundle size** with tree shaking

## 🎨 Styling

- **Tailwind CSS** utility classes
- **Custom color palette** for church branding
- **Consistent spacing** and typography
- **Dark mode ready** (can be extended)
- **Accessible colors** with proper contrast

## 🔮 Future Enhancements

- Real-time updates with Supabase subscriptions
- Advanced filtering and search
- Export functionality for reports
- Mobile app integration
- Advanced analytics and insights
