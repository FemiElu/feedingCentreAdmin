import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface AttendanceRecord {
    id: string;
    date: string;
    service_type: "Sunday Service" | "FTN Bible Study" | "Prayer Meeting";
    center_id: string;
    center_name: string;
    adult_male: number;
    adult_female: number;
    child_male: number;
    child_female: number;
    created_at: string;
}

export type CreateAttendanceInput = Omit<AttendanceRecord, "id" | "center_name" | "created_at">;

export interface AttendanceFilters {
    center_id?: string;
    start_date?: string;
    end_date?: string;
}

export function useAttendance(filters: AttendanceFilters = {}) {
    return useQuery({
        queryKey: ["attendance", filters],
        queryFn: async (): Promise<AttendanceRecord[]> => {
            if (!supabase) {
                return getMockAttendance(filters);
            }

            let query = supabase
                .from("attendance")
                .select(`
          *,
          centers(name)
        `)
                .order("date", { ascending: false });

            if (filters.center_id) {
                query = query.eq("center_id", filters.center_id);
            }
            if (filters.start_date) {
                query = query.gte("date", filters.start_date);
            }
            if (filters.end_date) {
                query = query.lte("date", filters.end_date);
            }

            const { data, error } = await query;

            if (error) throw error;

            return (
                data?.map((record) => ({
                    ...record,
                    service_type: record.service_type as any,
                    center_name: record.centers?.name || "Unknown Center",
                })) || []
            );
        },
    });
}

export function useCreateAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateAttendanceInput) => {
            if (!supabase) {
                console.log("Mock create attendance", input);
                return;
            }

            const { error } = await supabase.from("attendance").insert([input]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
        },
    });
}

// Mock Data
function getMockAttendance(filters: AttendanceFilters): AttendanceRecord[] {
    const baseData: AttendanceRecord[] = [
        {
            id: "1",
            date: "2024-01-28",
            service_type: "Sunday Service",
            center_id: "1",
            center_name: "Ile-Ife HQ Center",
            adult_male: 50,
            adult_female: 60,
            child_male: 15,
            child_female: 20,
            created_at: new Date().toISOString(),
        },
        {
            id: "2",
            date: "2024-01-28",
            service_type: "Sunday Service",
            center_id: "2",
            center_name: "Lagos Center",
            adult_male: 30,
            adult_female: 35,
            child_male: 10,
            child_female: 12,
            created_at: new Date().toISOString(),
        },
        {
            id: "3",
            date: "2024-01-24", // Wednesday previously
            service_type: "FTN Bible Study",
            center_id: "1",
            center_name: "Ile-Ife HQ Center",
            adult_male: 25,
            adult_female: 30,
            child_male: 5,
            child_female: 8,
            created_at: new Date().toISOString(),
        },
        {
            id: "4",
            date: "2024-01-21",
            service_type: "Sunday Service",
            center_id: "1",
            center_name: "Ile-Ife HQ Center",
            adult_male: 48,
            adult_female: 62,
            child_male: 14,
            child_female: 22,
            created_at: new Date().toISOString(),
        },
        {
            id: "5",
            date: "2024-01-21",
            service_type: "Sunday Service",
            center_id: "2",
            center_name: "Lagos Center",
            adult_male: 28,
            adult_female: 32,
            child_male: 9,
            child_female: 11,
            created_at: new Date().toISOString(),
        },
        {
            id: "6",
            date: "2024-01-17",
            service_type: "Prayer Meeting",
            center_id: "1",
            center_name: "Ile-Ife HQ Center",
            adult_male: 35,
            adult_female: 40,
            child_male: 0,
            child_female: 0,
            created_at: new Date().toISOString(),
        },
        {
            id: "7",
            date: "2024-01-14",
            service_type: "Sunday Service",
            center_id: "3",
            center_name: "Osogbo Center",
            adult_male: 20,
            adult_female: 25,
            child_male: 8,
            child_female: 10,
            created_at: new Date().toISOString(),
        },
        {
            id: "8",
            date: "2024-01-14",
            service_type: "Sunday Service",
            center_id: "4",
            center_name: "OAU Center",
            adult_male: 100,
            adult_female: 120,
            child_male: 2,
            child_female: 3,
            created_at: new Date().toISOString(),
        },
    ];

    return baseData.filter((item) => {
        if (filters.center_id && item.center_id !== filters.center_id) return false;
        return true;
    });
}
