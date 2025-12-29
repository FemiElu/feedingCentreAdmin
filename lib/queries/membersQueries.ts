import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

// Types for members data
export interface Member {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  center_id: string;
  center_name: string;
  service_unit: string;
  gender: string;
  marital_status: string;
  dob: string;
  created_at: string;
}

export type CreateMemberInput = Omit<Member, "id" | "center_name" | "created_at">;

export interface MembersFilters {
  search?: string;
  center_id?: string;
  service_unit?: string;
  gender?: string;
  marital_status?: string;
  sort_by?: "name" | "dob" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface MembersResponse {
  members: Member[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Center {
  id: string;
  name: string;
}

// Members list query with pagination and filters
export function useMembers(
  page: number = 1,
  pageSize: number = 10,
  filters: MembersFilters = {}
) {
  return useQuery({
    queryKey: ["members", page, pageSize, filters],
    queryFn: async (): Promise<MembersResponse> => {
      if (!supabase) {
        // Return mock data when Supabase is not configured
        const mockMembers = getMockMembers();
        const filteredMembers = filterMockMembers(mockMembers, filters);
        const sortedMembers = sortMockMembers(filteredMembers, filters);
        const paginatedMembers = paginateMockMembers(
          sortedMembers,
          page,
          pageSize
        );

        return {
          members: paginatedMembers,
          total: filteredMembers.length,
          page,
          pageSize,
          totalPages: Math.ceil(filteredMembers.length / pageSize),
        };
      }

      try {
        const offset = (page - 1) * pageSize;

        // Build the query
        let query = supabase.from("members").select(`
            id,
            full_name,
            phone,
            email,
            center_id,
            centers!inner(name),
            service_unit,
            gender,
            marital_status,
            dob,
            created_at
          `);

        // Apply search filter
        if (filters.search) {
          query = query.or(
            `full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
          );
        }

        // Apply other filters
        if (filters.center_id) {
          query = query.eq("center_id", filters.center_id);
        }
        if (filters.service_unit) {
          query = query.eq("service_unit", filters.service_unit);
        }
        if (filters.gender) {
          query = query.eq("gender", filters.gender);
        }
        if (filters.marital_status) {
          query = query.eq("marital_status", filters.marital_status);
        }

        // Apply sorting
        const sortColumn = filters.sort_by || "created_at";
        const sortOrder = filters.sort_order || "desc";
        query = query.order(sortColumn, { ascending: sortOrder === "asc" });

        // Get total count for pagination
        const { count } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true });

        // Apply pagination
        query = query.range(offset, offset + pageSize - 1);

        const { data, error } = await query;

        if (error) throw error;

        const members =
          data?.map((member) => ({
            ...member,
            center_name: member.centers?.[0]?.name || "Unknown Center",
          })) || [];

        return {
          members,
          total: count || 0,
          page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize),
        };
      } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create member mutation
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: CreateMemberInput): Promise<Member> => {
      if (!supabase) {
        // Return a mock created member
        const newMember: Member = {
          ...member,
          id: Math.random().toString(36).substr(2, 9),
          center_name: "Mock Center", // In reality, we'd fetch this or the API would return it
          created_at: new Date().toISOString(),
        };
        return newMember;
      }

      try {
        const { data, error } = await supabase
          .from("members")
          .insert([member])
          .select(`
            *,
            centers(name)
          `)
          .single();

        if (error) throw error;

        return {
          ...data,
          center_name: data.centers?.name || "Unknown Center",
        };
      } catch (error) {
        console.error("Error creating member:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate members queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

// Centers query for filter dropdown
export function useCenters() {
  return useQuery({
    queryKey: ["centers"],
    queryFn: async (): Promise<Center[]> => {
      if (!supabase) {
        // Return mock data when Supabase is not configured
        return [
          { id: "1", name: "Ile-Ife HQ Center" },
          { id: "2", name: "Lagos Center" },
          { id: "3", name: "Osogbo Center" },
          { id: "4", name: "OAU Center" },
          { id: "5", name: "Ibadan Center" },
        ];
      }

      try {
        const { data, error } = await supabase
          .from("centers")
          .select("id, name")
          .order("name");

        if (error) throw error;

        return data || [];
      } catch (error) {
        console.error("Error fetching centers:", error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Mock data functions
function getMockMembers(): Member[] {
  return [
    {
      id: "1",
      full_name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      center_id: "1",
      center_name: "Ile-Ife HQ Center",
      service_unit: "Ushering",
      gender: "Male",
      marital_status: "Single",
      dob: "1990-05-15",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      full_name: "Jane Smith",
      phone: "+1234567891",
      email: "jane@example.com",
      center_id: "2",
      center_name: "Lagos Center",
      service_unit: "Choir",
      gender: "Female",
      marital_status: "Married",
      dob: "1985-08-22",
      created_at: "2024-01-14T15:20:00Z",
    },
    {
      id: "3",
      full_name: "Bob Johnson",
      phone: "+1234567892",
      email: "bob@example.com",
      center_id: "1",
      center_name: "Ile-Ife HQ Center",
      service_unit: "Media",
      gender: "Male",
      marital_status: "Married",
      dob: "1988-12-10",
      created_at: "2024-01-13T09:45:00Z",
    },
    {
      id: "4",
      full_name: "Alice Brown",
      phone: "+1234567893",
      email: "alice@example.com",
      center_id: "3",
      center_name: "Osogbo Center",
      service_unit: "Children",
      gender: "Female",
      marital_status: "Single",
      dob: "1992-03-18",
      created_at: "2024-01-12T16:10:00Z",
    },
    {
      id: "5",
      full_name: "Charlie Wilson",
      phone: "+1234567894",
      email: "charlie@example.com",
      center_id: "4",
      center_name: "OAU Center",
      service_unit: "Security",
      gender: "Male",
      marital_status: "Single",
      dob: "1987-07-05",
      created_at: "2024-01-11T12:30:00Z",
    },
    {
      id: "6",
      full_name: "Diana Davis",
      phone: "+1234567895",
      email: "diana@example.com",
      center_id: "5",
      center_name: "Ibadan Center",
      service_unit: "Hospitality",
      gender: "Female",
      marital_status: "Married",
      dob: "1991-11-28",
      created_at: "2024-01-10T14:15:00Z",
    },
    {
      id: "7",
      full_name: "Eva Martinez",
      phone: "+1234567896",
      email: "eva@example.com",
      center_id: "2",
      center_name: "Lagos Center",
      service_unit: "Ushering",
      gender: "Female",
      marital_status: "Single",
      dob: "1989-04-12",
      created_at: "2024-01-09T11:20:00Z",
    },
    {
      id: "8",
      full_name: "Frank Miller",
      phone: "+1234567897",
      email: "frank@example.com",
      center_id: "1",
      center_name: "Ile-Ife HQ Center",
      service_unit: "Choir",
      gender: "Male",
      marital_status: "Married",
      dob: "1986-09-30",
      created_at: "2024-01-08T13:45:00Z",
    },
    {
      id: "9",
      full_name: "Grace Lee",
      phone: "+1234567898",
      email: "grace@example.com",
      center_id: "3",
      center_name: "Osogbo Center",
      service_unit: "Media",
      gender: "Female",
      marital_status: "Single",
      dob: "1993-01-14",
      created_at: "2024-01-07T10:00:00Z",
    },
    {
      id: "10",
      full_name: "Henry Taylor",
      phone: "+1234567899",
      email: "henry@example.com",
      center_id: "4",
      center_name: "OAU Center",
      service_unit: "Children",
      gender: "Male",
      marital_status: "Married",
      dob: "1984-06-25",
      created_at: "2024-01-06T15:30:00Z",
    },
    {
      id: "11",
      full_name: "Ivy Chen",
      phone: "+1234567800",
      email: "ivy@example.com",
      center_id: "5",
      center_name: "Ibadan Center",
      service_unit: "Security",
      gender: "Female",
      marital_status: "Single",
      dob: "1990-10-08",
      created_at: "2024-01-05T09:15:00Z",
    },
    {
      id: "12",
      full_name: "Jack Anderson",
      phone: "+1234567801",
      email: "jack@example.com",
      center_id: "2",
      center_name: "Lagos Center",
      service_unit: "Hospitality",
      gender: "Male",
      marital_status: "Single",
      dob: "1988-02-17",
      created_at: "2024-01-04T12:45:00Z",
    },
    {
      id: "13",
      full_name: "Kate Rodriguez",
      phone: "+1234567802",
      email: "kate@example.com",
      center_id: "1",
      center_name: "Ile-Ife HQ Center",
      service_unit: "Ushering",
      gender: "Female",
      marital_status: "Married",
      dob: "1987-12-03",
      created_at: "2024-01-03T16:20:00Z",
    },
    {
      id: "14",
      full_name: "Liam Thompson",
      phone: "+1234567803",
      email: "liam@example.com",
      center_id: "3",
      center_name: "Osogbo Center",
      service_unit: "Choir",
      gender: "Male",
      marital_status: "Single",
      dob: "1991-08-19",
      created_at: "2024-01-02T14:10:00Z",
    },
    {
      id: "15",
      full_name: "Maya Patel",
      phone: "+1234567804",
      email: "maya@example.com",
      center_id: "4",
      center_name: "OAU Center",
      service_unit: "Media",
      gender: "Female",
      marital_status: "Married",
      dob: "1989-05-26",
      created_at: "2024-01-01T11:30:00Z",
    },
    {
      id: "16",
      full_name: "Noah Kim",
      phone: "+1234567805",
      email: "noah@example.com",
      center_id: "5",
      center_name: "Ibadan Center",
      service_unit: "Children",
      gender: "Male",
      marital_status: "Single",
      dob: "1992-03-11",
      created_at: "2023-12-31T13:15:00Z",
    },
    {
      id: "17",
      full_name: "Olivia White",
      phone: "+1234567806",
      email: "olivia@example.com",
      center_id: "2",
      center_name: "Lagos Center",
      service_unit: "Security",
      gender: "Female",
      marital_status: "Single",
      dob: "1986-07-22",
      created_at: "2023-12-30T10:45:00Z",
    },
    {
      id: "18",
      full_name: "Paul Garcia",
      phone: "+1234567807",
      email: "paul@example.com",
      center_id: "1",
      center_name: "Ile-Ife HQ Center",
      service_unit: "Hospitality",
      gender: "Male",
      marital_status: "Married",
      dob: "1985-11-14",
      created_at: "2023-12-29T15:00:00Z",
    },
    {
      id: "19",
      full_name: "Quinn Johnson",
      phone: "+1234567808",
      email: "quinn@example.com",
      center_id: "3",
      center_name: "Osogbo Center",
      service_unit: "Ushering",
      gender: "Female",
      marital_status: "Single",
      dob: "1990-09-07",
      created_at: "2023-12-28T12:30:00Z",
    }
    ,
    {
      id: "20",
      full_name: "Ryan Davis",
      phone: "+1234567809",
      email: "ryan@example.com",
      center_id: "4",
      center_name: "Northside Center",
      service_unit: "Choir",
      gender: "Male",
      marital_status: "Married",
      dob: "1988-04-29",
      created_at: "2023-12-27T09:20:00Z",
    },
  ];
}

function filterMockMembers(
  members: Member[],
  filters: MembersFilters
): Member[] {
  return members.filter((member) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        member.full_name.toLowerCase().includes(searchLower) ||
        member.phone.includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Other filters
    if (filters.center_id && member.center_id !== filters.center_id)
      return false;
    if (filters.service_unit && member.service_unit !== filters.service_unit)
      return false;
    if (filters.gender && member.gender !== filters.gender) return false;
    if (
      filters.marital_status &&
      member.marital_status !== filters.marital_status
    )
      return false;

    return true;
  });
}

function sortMockMembers(members: Member[], filters: MembersFilters): Member[] {
  const sortBy = filters.sort_by || "created_at";
  const sortOrder = filters.sort_order || "desc";

  return [...members].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "name":
        aValue = a.full_name;
        bValue = b.full_name;
        break;
      case "dob":
        aValue = new Date(a.dob);
        bValue = new Date(b.dob);
        break;
      case "created_at":
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

function paginateMockMembers(
  members: Member[],
  page: number,
  pageSize: number
): Member[] {
  const offset = (page - 1) * pageSize;
  return members.slice(offset, offset + pageSize);
}
