import React from "react";
import { render, screen } from "@testing-library/react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ActivityLog } from "@/lib/queries/dashboardQueries";

const mockActivities: ActivityLog[] = [
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
    action: "DELETE",
    description: "Member Bob Johnson removed",
    user_name: "Admin User",
    created_at: "2024-01-14T14:20:00Z",
    table_name: "members",
  },
];

describe("ActivityFeed Component", () => {
  it("renders activity feed with activities", () => {
    render(<ActivityFeed activities={mockActivities} />);

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("New member John Doe added")).toBeInTheDocument();
    expect(screen.getByText("Member Jane Smith updated")).toBeInTheDocument();
    expect(screen.getByText("Member Bob Johnson removed")).toBeInTheDocument();
  });

  it("renders empty state when no activities", () => {
    render(<ActivityFeed activities={[]} />);

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("No activity")).toBeInTheDocument();
    expect(
      screen.getByText("No recent activity to display.")
    ).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<ActivityFeed activities={[]} loading={true} />);

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    // Should show loading skeleton, not the actual content
    expect(screen.queryByText("No activity")).not.toBeInTheDocument();
  });

  it("displays user names and timestamps", () => {
    render(<ActivityFeed activities={mockActivities} />);

    expect(screen.getAllByText("Admin User")).toHaveLength(3);
    // Check for date format instead of "Just now" since the dates are from 2024
    expect(screen.getAllByText("1/15/2024")).toHaveLength(2);
  });

  it("shows different action icons for different actions", () => {
    render(<ActivityFeed activities={mockActivities} />);

    // Should have icons for CREATE, UPDATE, and DELETE actions
    // Check for SVG elements by looking for the icon containers
    const iconContainers = screen.getAllByRole("generic");
    const iconElements = iconContainers.filter(
      (el) =>
        el.className.includes("bg-green-100") ||
        el.className.includes("bg-blue-100") ||
        el.className.includes("bg-red-100")
    );
    expect(iconElements).toHaveLength(3);
  });

  it("displays table names", () => {
    render(<ActivityFeed activities={mockActivities} />);

    expect(screen.getAllByText("members")).toHaveLength(3);
  });

  it("applies custom className", () => {
    const { container } = render(
      <ActivityFeed activities={mockActivities} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with single activity", () => {
    const singleActivity = [mockActivities[0]];
    render(<ActivityFeed activities={singleActivity} />);

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("New member John Doe added")).toBeInTheDocument();
    expect(
      screen.queryByText("Member Jane Smith updated")
    ).not.toBeInTheDocument();
  });

  it("handles activities with different table names", () => {
    const mixedActivities: ActivityLog[] = [
      ...mockActivities,
      {
        id: "4",
        action: "CREATE",
        description: "New center Downtown Branch added",
        user_name: "Admin User",
        created_at: "2024-01-14T16:45:00Z",
        table_name: "centers",
      },
    ];

    render(<ActivityFeed activities={mixedActivities} />);

    expect(
      screen.getByText("New center Downtown Branch added")
    ).toBeInTheDocument();
    expect(screen.getByText("centers")).toBeInTheDocument();
  });

  it("formats time correctly for different time ranges", () => {
    const activitiesWithDifferentTimes: ActivityLog[] = [
      {
        id: "1",
        action: "CREATE",
        description: "Recent activity",
        user_name: "Admin User",
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        table_name: "members",
      },
      {
        id: "2",
        action: "UPDATE",
        description: "Older activity",
        user_name: "Admin User",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        table_name: "members",
      },
    ];

    render(<ActivityFeed activities={activitiesWithDifferentTimes} />);

    expect(screen.getByText("5m ago")).toBeInTheDocument();
    expect(screen.getByText("2h ago")).toBeInTheDocument();
  });
});
