import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/Button";

describe("Button Component", () => {
  it("renders button with children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary-600");
  });

  it("applies secondary variant when specified", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary-100");
  });

  it("applies outline variant when specified", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-secondary-300");
  });

  it("applies ghost variant when specified", () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-secondary-100");
  });

  it("applies small size when specified", () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8");
  });

  it("applies large size when specified", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-12");
  });

  it("shows loading spinner when loading", () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveClass("animate-spin");
  });

  it("is disabled when loading", () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("accepts custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("forwards other props to button element", () => {
    render(
      <Button data-testid="test-button" type="submit">
        Submit Button
      </Button>
    );
    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("type", "submit");
  });
});
