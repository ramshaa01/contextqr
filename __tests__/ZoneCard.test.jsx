import { render, screen, fireEvent } from '@testing-library/react';
import ZoneCard from '@/components/ZoneCard';
import { Home } from 'lucide-react';
import { vi } from 'vitest';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock framer-motion to avoid complex animation rendering in jsdom
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, whileHover, whileTap, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
    },
    useReducedMotion: () => false,
  };
});

describe('ZoneCard', () => {
  it('renders title, description and handles click', async () => {
    // Mock fetch for the API call
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    render(
      <ZoneCard
        zone="gate"
        title="Test Gate"
        description="A description"
        icon={Home}
        accent="#10b981"
      />
    );

    expect(screen.getByText('Test Gate')).toBeInTheDocument();
    expect(screen.getByText('A description')).toBeInTheDocument();

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should set loading state and call fetch
    expect(screen.getByText('Scanning...')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
