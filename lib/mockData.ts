// Mock data for testing purposes
export const mockAdminUser = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "admin@church.com",
  user_metadata: {
    name: "John Admin",
    center_id: "center-123",
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockCenters = [
  {
    id: "center-123",
    name: "Downtown Feeding Center",
    address: "123 Main St, Downtown",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "center-456",
    name: "Westside Community Center",
    address: "456 Oak Ave, Westside",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const mockMembers = [
  {
    id: "member-1",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1234567890",
    center_id: "center-123",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "member-2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1234567891",
    center_id: "center-456",
    status: "inactive",
    created_at: "2024-01-01T00:00:00Z",
  },
];
