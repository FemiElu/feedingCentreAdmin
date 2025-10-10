import React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardCard } from "@/components/DashboardCard";

describe("DashboardCard Component", () => {
  it("renders card with title and value", () => {
    render(<DashboardCard title="Total Members" value={1234} />);

    expect(screen.getByText("Total Members")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("renders card with subtitle", () => {
    render(
      <DashboardCard title="New Members" value={45} subtitle="This month" />
    );

    expect(screen.getByText("New Members")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
  });

  it("renders card with trend indicator", () => {
    render(
      <DashboardCard
        title="Growth"
        value={100}
        trend={{ value: 12, isPositive: true }}
      />
    );

    expect(screen.getByText("Growth")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("12%")).toBeInTheDocument();
  });

  it("renders card with negative trend", () => {
    render(
      <DashboardCard
        title="Decline"
        value={50}
        trend={{ value: 5, isPositive: false }}
      />
    );

    expect(screen.getByText("Decline")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
  });

  it("renders card with icon", () => {
    const icon = <svg data-testid="test-icon">Icon</svg>;
    render(<DashboardCard title="With Icon" value={200} icon={icon} />);

    expect(screen.getByText("With Icon")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<DashboardCard title="Loading" value={0} loading={true} />);

    // Should show loading skeleton, not the actual content
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("formats large numbers with commas", () => {
    render(<DashboardCard title="Large Number" value={1234567} />);

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders string values correctly", () => {
    render(<DashboardCard title="String Value" value="Active" />);

    expect(screen.getByText("String Value")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <DashboardCard
        title="Custom Class"
        value={100}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders without trend when not provided", () => {
    render(<DashboardCard title="No Trend" value={75} />);

    expect(screen.getByText("No Trend")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });
});
