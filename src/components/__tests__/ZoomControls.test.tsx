import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZoomControls } from '../ZoomControls';
import { I18nProvider } from '../../i18n/I18nProvider';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<I18nProvider>{component}</I18nProvider>);
};

describe('ZoomControls', () => {
  const mockZoomIn = vi.fn();
  const mockZoomOut = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render zoom in and zoom out buttons', () => {
    renderWithProvider(
      <ZoomControls
        onZoomIn={mockZoomIn}
        onZoomOut={mockZoomOut}
        onReset={mockReset}
        isZoomed={false}
      />
    );

    expect(screen.getByLabelText(/zoom in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zoom out/i)).toBeInTheDocument();
  });

  it('should not show reset button when not zoomed', () => {
    renderWithProvider(
      <ZoomControls
        onZoomIn={mockZoomIn}
        onZoomOut={mockZoomOut}
        onReset={mockReset}
        isZoomed={false}
      />
    );

    expect(screen.queryByLabelText(/reset/i)).not.toBeInTheDocument();
  });

  it('should show reset button when zoomed', () => {
    renderWithProvider(
      <ZoomControls
        onZoomIn={mockZoomIn}
        onZoomOut={mockZoomOut}
        onReset={mockReset}
        isZoomed={true}
      />
    );

    expect(screen.getByLabelText(/reset/i)).toBeInTheDocument();
  });

  it('should call onZoomIn when zoom in button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ZoomControls
        onZoomIn={mockZoomIn}
        onZoomOut={mockZoomOut}
        onReset={mockReset}
        isZoomed={false}
      />
    );

    await user.click(screen.getByLabelText(/zoom in/i));
    expect(mockZoomIn).toHaveBeenCalledTimes(1);
  });

  it('should call onZoomOut when zoom out button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ZoomControls
        onZoomIn={mockZoomIn}
        onZoomOut={mockZoomOut}
        onReset={mockReset}
        isZoomed={false}
      />
    );

    await user.click(screen.getByLabelText(/zoom out/i));
    expect(mockZoomOut).toHaveBeenCalledTimes(1);
  });

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ZoomControls
        onZoomIn={mockZoomIn}
        onZoomOut={mockZoomOut}
        onReset={mockReset}
        isZoomed={true}
      />
    );

    await user.click(screen.getByLabelText(/reset/i));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when disabled prop is true', () => {
    renderWithProvider(
      <ZoomControls
        onZoomIn={mockZoomIn}
        onZoomOut={mockZoomOut}
        onReset={mockReset}
        isZoomed={false}
        disabled={true}
      />
    );

    const zoomInButton = screen.getByLabelText(/zoom in/i);
    const zoomOutButton = screen.getByLabelText(/zoom out/i);

    expect(zoomInButton).toBeDisabled();
    expect(zoomOutButton).toBeDisabled();
  });
});

