import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

// Types for dashboard data
export interface DashboardStats {
  totalMembers: number;
  newThisMonth: number;
  upcomingBirthdays: number;
  centersCount: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user_name: string;
  created_at: string;
  table_name: string;
}

export interface NewestMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  center_name: string;
}

export interface BirthdayData {
  month: string;
  count: number;
}

// Dashboard statistics query
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      if (!supabase) {
        // Return mock data when Supabase is not configured
        return {
          totalMembers: 1234,
          newThisMonth: 45,
          upcomingBirthdays: 12,
          centersCount: 8,
        };
      }

      try {
        // Total members count
        const { count: totalMembers } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true });

        // New members this month
        const { count: newThisMonth } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true })
          .gte(
            "created_at",
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ).toISOString()
          );

        // Upcoming birthdays (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const { count: upcomingBirthdays } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true })
          .not("dob_day", "is", null)
          .not("dob_month", "is", null)
          .gte("dob_month", today.getMonth() + 1)
          .lte("dob_month", nextWeek.getMonth() + 1);

        // Centers count
        const { count: centersCount } = await supabase
          .from("centers")
          .select("*", { count: "exact", head: true });

        return {
          totalMembers: totalMembers || 0,
          newThisMonth: newThisMonth || 0,
          upcomingBirthdays: upcomingBirthdays || 0,
          centersCount: centersCount || 0,
        };
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Recent activity feed query
export function useActivityFeed() {
  return useQuery({
    queryKey: ["activity-feed"],
    queryFn: async (): Promise<ActivityLog[]> => {
      if (!supabase) {
        // Return mock data when Supabase is not configured
        return [
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
        ];
      }

      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;

        return data || [];
      } catch (error) {
        console.error("Error fetching activity feed:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Newest members query
export function useNewestMembers() {
  return useQuery({
    queryKey: ["newest-members"],
    queryFn: async (): Promise<NewestMember[]> => {
      if (!supabase) {
        // Return mock data when Supabase is not configured
        return [
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
        ];
      }

      try {
        const { data, error } = await supabase
          .from("members")
          .select(
            `
            id,
            name,
            email,
            phone,
            created_at,
            centers!inner(name)
          `
          )
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;

        return (
          data?.map((member) => ({
            ...member,
            center_name: member.centers?.[0]?.name || "Unknown Center",
          })) || []
        );
      } catch (error) {
        console.error("Error fetching newest members:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Birthday chart data query
export function useBirthdayChart() {
  return useQuery({
    queryKey: ["birthday-chart"],
    queryFn: async (): Promise<BirthdayData[]> => {
      if (!supabase) {
        // Return mock data when Supabase is not configured
        return [
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
      }

      try {
        const { data, error } = await supabase
          .from("members")
          .select("dob_month")
          .not("dob_month", "is", null);

        if (error) throw error;

        // Group by month and count
        const monthCounts: { [key: number]: number } = {};
        data?.forEach((member) => {
          const month = member.dob_month;
          monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return monthNames.map((name, index) => ({
          month: name,
          count: monthCounts[index + 1] || 0,
        }));
      } catch (error) {
        console.error("Error fetching birthday chart:", error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}
