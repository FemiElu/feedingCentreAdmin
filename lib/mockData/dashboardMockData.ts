// Mock data for dashboard components
export const mockDashboardStats = {
  totalMembers: 1234,
  newThisMonth: 45,
  upcomingBirthdays: 12,
  centersCount: 8,
};

export const mockActivityFeed = [
  {
    id: "1",
    action: "CREATE",
    description: "New member John Doe added",
    user_name: "Admin User",
    created_at: "2024-01-15T10:30:00Z",
    table_name: "members",
  },
  {
    id: "2",
    action: "UPDATE",
    description: "Member Jane Smith updated",
    user_name: "Admin User",
    created_at: "2024-01-15T09:15:00Z",
    table_name: "members",
  },
  {
    id: "3",
    action: "CREATE",
    description: "New center Downtown Branch added",
    user_name: "Admin User",
    created_at: "2024-01-14T16:45:00Z",
    table_name: "centers",
  },
  {
    id: "4",
    action: "DELETE",
    description: "Member Bob Johnson removed",
    user_name: "Admin User",
    created_at: "2024-01-14T14:20:00Z",
    table_name: "members",
  },
  {
    id: "5",
    action: "UPDATE",
    description: "Center Westside updated",
    user_name: "Admin User",
    created_at: "2024-01-13T11:30:00Z",
    table_name: "centers",
  },
];

export const mockNewestMembers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1234567890",
    created_at: "2024-01-15T10:30:00Z",
    center_name: "Downtown Center",
  },
  {
    id: "2",
    name: "Bob Wilson",
    email: "bob@example.com",
    phone: "+1234567891",
    created_at: "2024-01-14T15:20:00Z",
    center_name: "Westside Center",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    phone: "+1234567892",
    created_at: "2024-01-14T09:45:00Z",
    center_name: "Downtown Center",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    phone: "+1234567893",
    created_at: "2024-01-13T16:10:00Z",
    center_name: "Eastside Center",
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva@example.com",
    phone: "+1234567894",
    created_at: "2024-01-13T12:30:00Z",
    center_name: "Northside Center",
  },
];

export const mockBirthdayData = [
  { month: "Jan", count: 15 },
  { month: "Feb", count: 12 },
  { month: "Mar", count: 18 },
  { month: "Apr", count: 22 },
  { month: "May", count: 19 },
  { month: "Jun", count: 25 },
  { month: "Jul", count: 28 },
  { month: "Aug", count: 24 },
  { month: "Sep", count: 21 },
  { month: "Oct", count: 17 },
  { month: "Nov", count: 14 },
  { month: "Dec", count: 20 },
];

// Sample SQL queries for Supabase
export const sampleSQLQueries = {
  // Total members count
  totalMembers: `
    SELECT COUNT(*) as count 
    FROM members;
  `,

  // New members this month
  newThisMonth: `
    SELECT COUNT(*) as count 
    FROM members 
    WHERE created_at >= date_trunc('month', now());
  `,

  // Upcoming birthdays (next 7 days)
  upcomingBirthdays: `
    SELECT COUNT(*) as count 
    FROM members 
    WHERE dob_day IS NOT NULL 
    AND dob_month IS NOT NULL
    AND (
      (dob_month = EXTRACT(MONTH FROM now()) 
       AND dob_day BETWEEN EXTRACT(DAY FROM now()) AND EXTRACT(DAY FROM now() + INTERVAL '7 days'))
      OR
      (dob_month = EXTRACT(MONTH FROM now() + INTERVAL '1 month') 
       AND dob_day <= EXTRACT(DAY FROM now() + INTERVAL '7 days'))
    );
  `,

  // Centers count
  centersCount: `
    SELECT COUNT(*) as count 
    FROM centers;
  `,

  // Recent audit logs
  recentActivity: `
    SELECT 
      id,
      action,
      description,
      user_name,
      created_at,
      table_name
    FROM audit_logs 
    ORDER BY created_at DESC 
    LIMIT 10;
  `,

  // Newest members with center info
  newestMembers: `
    SELECT 
      m.id,
      m.name,
      m.email,
      m.phone,
      m.created_at,
      c.name as center_name
    FROM members m
    LEFT JOIN centers c ON m.center_id = c.id
    ORDER BY m.created_at DESC 
    LIMIT 10;
  `,

  // Birthday chart data
  birthdayChart: `
    SELECT 
      dob_month,
      COUNT(*) as count
    FROM members 
    WHERE dob_month IS NOT NULL
    GROUP BY dob_month
    ORDER BY dob_month;
  `,
};
