import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MembersTable } from "@/components/MembersTable";
import { MembersResponse } from "@/lib/queries/membersQueries";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockMembersResponse: MembersResponse = {
  members: [
    {
      id: "1",
      full_name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      center_id: "1",
      center_name: "Downtown Center",
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
      center_name: "Westside Center",
      service_unit: "Choir",
      gender: "Female",
      marital_status: "Married",
      dob: "1985-08-22",
      created_at: "2024-01-14T15:20:00Z",
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const mockOnPageChange = jest.fn();
const mockOnBulkAction = jest.fn();

describe("MembersTable Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders members table with data", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Downtown Center")).toBeInTheDocument();
    expect(screen.getByText("Westside Center")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        loading={true}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    // Should show loading skeleton
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("renders empty state when no members", () => {
    const emptyData = {
      ...mockMembersResponse,
      members: [],
      total: 0,
    };

    render(
      <MembersTable
        data={emptyData}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    expect(screen.getByText("No members found")).toBeInTheDocument();
  });

  it("handles member selection", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const firstMemberCheckbox = checkboxes[1]; // First is select all, second is first member

    fireEvent.click(firstMemberCheckbox);
    expect(firstMemberCheckbox).toBeChecked();
  });

  it("handles select all functionality", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(selectAllCheckbox);

    const memberCheckboxes = screen.getAllByRole("checkbox").slice(1);
    memberCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it("shows bulk actions when members are selected", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const firstMemberCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(firstMemberCheckbox);

    expect(screen.getByText("1 member selected")).toBeInTheDocument();
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  it("handles bulk actions", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const firstMemberCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(firstMemberCheckbox);

    const exportButton = screen.getByText("Export CSV");
    fireEvent.click(exportButton);

    expect(mockOnBulkAction).toHaveBeenCalledWith("export", ["1"]);
  });

  it("formats dates correctly", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    expect(screen.getByText("15/05/1990")).toBeInTheDocument();
    expect(screen.getByText("22/08/1985")).toBeInTheDocument();
  });

  it("renders service unit badges", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    expect(screen.getByText("Ushering")).toBeInTheDocument();
    expect(screen.getByText("Choir")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const viewButtons = screen.getAllByText("View");
    const editButtons = screen.getAllByText("Edit");

    expect(viewButtons).toHaveLength(2);
    expect(editButtons).toHaveLength(2);
  });

  it("renders pagination when multiple pages", () => {
    const multiPageData = {
      ...mockMembersResponse,
      total: 25,
      totalPages: 3,
    };

    render(
      <MembersTable
        data={multiPageData}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("handles pagination clicks", () => {
    const multiPageData = {
      ...mockMembersResponse,
      total: 25,
      totalPages: 3,
    };

    render(
      <MembersTable
        data={multiPageData}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("shows correct pagination info", () => {
    const multiPageData = {
      ...mockMembersResponse,
      members: mockMembersResponse.members, // Keep only 2 members for this page
      total: 25, // But total is 25
      totalPages: 3,
    };

    render(
      <MembersTable
        data={multiPageData}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    // Check for individual parts of the pagination text
    expect(screen.getByText("Showing")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("to")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument(); // Component calculates min(pageSize, total) = min(10, 25) = 10
    expect(screen.getByText("of")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("results")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    const multiPageData = {
      ...mockMembersResponse,
      total: 25,
      totalPages: 3,
    };

    render(
      <MembersTable
        data={multiPageData}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const previousButton = screen.getByText("Previous");
    expect(previousButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    const multiPageData = {
      ...mockMembersResponse,
      page: 3,
      total: 25,
      totalPages: 3,
    };

    render(
      <MembersTable
        data={multiPageData}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("clears selection after bulk action", async () => {
    render(
      <MembersTable
        data={mockMembersResponse}
        onPageChange={mockOnPageChange}
        onBulkAction={mockOnBulkAction}
      />
    );

    const firstMemberCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(firstMemberCheckbox);

    expect(screen.getByText("1 member selected")).toBeInTheDocument();

    const exportButton = screen.getByText("Export CSV");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.queryByText("1 member selected")).not.toBeInTheDocument();
    });
  });
});
