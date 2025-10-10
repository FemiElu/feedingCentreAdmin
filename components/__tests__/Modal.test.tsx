import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/Modal";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/",
    push: jest.fn(),
  }),
}));

describe("Modal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.body.style
    Object.defineProperty(document.body, "style", {
      value: {},
      writable: true,
    });
  });

  it("renders modal when isOpen is true", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-labelledby",
      "modal-title"
    );
  });

  it("renders close button when showCloseButton is true", () => {
    render(
      <Modal {...defaultProps} title="Test Modal" showCloseButton={true} />
    );
    expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
  });

  it("does not render close button when showCloseButton is false", () => {
    render(
      <Modal {...defaultProps} title="Test Modal" showCloseButton={false} />
    );
    expect(screen.queryByLabelText("Close modal")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} title="Test Modal" onClose={onClose} />);

    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const backdrop = screen
      .getByRole("dialog")
      .parentElement?.querySelector(".fixed.inset-0");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(
      screen.getByRole("dialog").querySelector(".max-w-md")
    ).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(
      screen.getByRole("dialog").querySelector(".max-w-2xl")
    ).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(
      screen.getByRole("dialog").querySelector(".max-w-4xl")
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Modal {...defaultProps} className="custom-modal" />);
    const modalContent = screen.getByRole("dialog").querySelector(".relative");
    expect(modalContent).toHaveClass("custom-modal");
  });

  it("handles escape key press", () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sets body overflow hidden when modal opens", () => {
    const originalOverflow = document.body.style.overflow;
    render(<Modal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");

    // Cleanup
    document.body.style.overflow = originalOverflow;
  });

  it("restores body overflow when modal closes", () => {
    const originalOverflow = document.body.style.overflow;
    const { rerender } = render(<Modal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("unset");

    // Cleanup
    document.body.style.overflow = originalOverflow;
  });

  it("renders children in modal content", () => {
    render(
      <Modal {...defaultProps}>
        <div data-testid="modal-children">Test content</div>
      </Modal>
    );
    expect(screen.getByTestId("modal-children")).toBeInTheDocument();
  });
});
