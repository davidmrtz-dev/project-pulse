import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZoomPan } from '../useZoomPan';

/**
 * Tests to identify bugs in zoom/pan functionality
 */
describe('useZoomPan - Bug Detection Tests', () => {
  describe('BUG: Zoom calculation issues', () => {
    it('BUG: zoomIn might create invalid ranges when dataLength changes', () => {
      const { result, rerender } = renderHook(
        ({ length }: { length: number }) => useZoomPan(length),
        { initialProps: { length: 12 } }
      );

      // Zoom in
      act(() => {
        result.current.zoomIn();
      });

      // Change data length to smaller
      rerender({ length: 6 });

      // BUG: The zoom state resets, but what if we had zoomed to indices 8-10?
      // After reset, we'd have 0-5, but the previous zoom was invalid for new length
      expect(result.current.zoomState.endIndex).toBeLessThan(6);
    });

    it('BUG: zoomIn might not respect minimum range correctly', () => {
      const { result } = renderHook(() => useZoomPan(12));

      // Set a very small range manually
      act(() => {
        result.current.handleBrushChange(5, 6); // Range of 1
      });

      // Try to zoom in - should not work
      act(() => {
        result.current.zoomIn();
      });

      // BUG: The check is `range <= 2`, so range of 1 should prevent zoom
      // But what if range is exactly 2? It should still allow one more zoom
      const range = result.current.zoomState.endIndex - result.current.zoomState.startIndex;
      expect(range).toBeGreaterThanOrEqual(1);
    });

    it('BUG: zoomOut calculation might exceed dataLength', () => {
      const { result } = renderHook(() => useZoomPan(12));

      // Set zoom near the end
      act(() => {
        result.current.handleBrushChange(8, 11);
      });

      // Zoom out
      act(() => {
        result.current.zoomOut();
      });

      // BUG: newEnd calculation uses Math.min, but what if newStart calculation
      // creates a situation where newEnd would be > dataLength?
      expect(result.current.zoomState.endIndex).toBeLessThan(12);
      expect(result.current.zoomState.startIndex).toBeGreaterThanOrEqual(0);
    });
  });

  describe('BUG: Brush synchronization issues', () => {
    it('BUG: Brush might not sync with zoom buttons', () => {
      const { result } = renderHook(() => useZoomPan(12));

      // Use brush to set a range
      act(() => {
        result.current.handleBrushChange(3, 7);
      });

      const brushState = { ...result.current.zoomState };

      // Use zoom in button
      act(() => {
        result.current.zoomIn();
      });

      // BUG: The brush component needs to receive updated startIndex/endIndex
      // But if the brush is using full data and we're slicing, there might be a mismatch
      expect(result.current.zoomState.startIndex).not.toBe(brushState.startIndex);
    });

    it('BUG: Brush onChange might receive wrong indices when data is sliced', () => {
      // This is a critical bug: When we slice data for display, the brush
      // receives indices relative to the sliced array, not the full array
      const { result } = renderHook(() => useZoomPan(12));

      // If we slice data to show indices 3-7, and user selects brush range 1-3,
      // that should map to indices 4-6 in the full array, not 1-3
      
      // This test documents the expected behavior
      act(() => {
        result.current.handleBrushChange(1, 3);
      });

      // The brush should work with full data indices
      expect(result.current.zoomState.startIndex).toBe(1);
      expect(result.current.zoomState.endIndex).toBe(3);
    });
  });

  describe('BUG: Edge case handling', () => {
    it('BUG: Empty data array causes issues', () => {
      const { result } = renderHook(() => useZoomPan(0));

      // BUG: endIndex is -1, which might cause issues in array slicing
      expect(result.current.zoomState.endIndex).toBe(-1);
      
      // Trying to use this for slicing would cause issues
      // array.slice(0, -1) returns empty array, but we might expect different behavior
    });

    it('BUG: Single data point zoom behavior', () => {
      const { result } = renderHook(() => useZoomPan(1));

      // With single data point, zoomOut should not change anything
      act(() => {
        result.current.zoomOut();
      });

      // Should remain at single point (can't zoom out beyond data)
      expect(result.current.zoomState.startIndex).toBe(0);
      expect(result.current.zoomState.endIndex).toBe(0);
      expect(result.current.zoomState.isZoomed).toBe(false);
    });

    it('BUG: Very small datasets (2-3 points)', () => {
      const { result } = renderHook(() => useZoomPan(3));

      // BUG: With only 3 points, zoomIn should be disabled (range <= 2)
      act(() => {
        result.current.zoomIn();
      });

      // Should not change
      expect(result.current.zoomState.startIndex).toBe(0);
      expect(result.current.zoomState.endIndex).toBe(2);
    });
  });

  describe('BUG: Data synchronization with Overview component', () => {
    it('BUG: Using || 12 fallback might cause issues', () => {
      // In Overview.tsx: useZoomPan(series.length || 12)
      // BUG: If series.length is 0, we use 12, but then when data loads,
      // the hook resets. However, if data never loads or is empty,
      // we're working with wrong dataLength
      
      const { result, rerender } = renderHook(
        ({ length }: { length: number }) => useZoomPan(length || 12),
        { initialProps: { length: 0 } }
      );

      // Initial state with fallback
      expect(result.current.zoomState.endIndex).toBe(11); // 12 - 1

      // Data loads with actual length
      rerender({ length: 6 });

      // Should reset to actual length
      expect(result.current.zoomState.endIndex).toBe(5);
    });

    it('BUG: Multiple zoom hooks might get out of sync', () => {
      // In Overview, we have multiple useZoomPan hooks
      // BUG: If one chart's data changes but others don't, they might desync
      const velocityZoom = renderHook(() => useZoomPan(12));
      const completionZoom = renderHook(() => useZoomPan(12));

      // Zoom velocity chart
      act(() => {
        velocityZoom.result.current.zoomIn();
      });

      // Completion chart should be independent
      expect(completionZoom.result.current.zoomState.isZoomed).toBe(false);
      expect(velocityZoom.result.current.zoomState.isZoomed).toBe(true);
    });
  });

  describe('BUG: Brush component integration', () => {
    it('BUG: Brush data prop might not match displayed data', () => {
      // CRITICAL BUG: In Overview.tsx, we slice data for display:
      // data={series.slice(velocityZoom.zoomState.startIndex, velocityZoom.zoomState.endIndex + 1)}
      // But Brush uses: data={series} (full data)
      // 
      // The Brush onChange receives indices relative to the FULL data array,
      // which is correct. But we need to ensure the Brush startIndex/endIndex
      // are also relative to full data, not sliced data.
      
      // This is actually CORRECT behavior, but needs to be tested
      const { result } = renderHook(() => useZoomPan(12));

      // Simulate brush change with full data indices
      act(() => {
        result.current.handleBrushChange(3, 7);
      });

      // These indices should be used to slice the full data array
      expect(result.current.zoomState.startIndex).toBe(3);
      expect(result.current.zoomState.endIndex).toBe(7);
    });
  });
});

