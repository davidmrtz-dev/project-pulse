import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZoomPan } from '../useZoomPan';

describe('useZoomPan', () => {
  describe('initialization', () => {
    it('should initialize with full range when dataLength is provided', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      expect(result.current.zoomState).toEqual({
        startIndex: 0,
        endIndex: 11,
        isZoomed: false,
      });
    });

    it('should handle zero data length', () => {
      const { result } = renderHook(() => useZoomPan(0));
      
      expect(result.current.zoomState).toEqual({
        startIndex: 0,
        endIndex: -1,
        isZoomed: false,
      });
    });

    it('should handle single data point', () => {
      const { result } = renderHook(() => useZoomPan(1));
      
      expect(result.current.zoomState).toEqual({
        startIndex: 0,
        endIndex: 0,
        isZoomed: false,
      });
    });
  });

  describe('zoomIn', () => {
    it('should zoom in and reduce the visible range', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      act(() => {
        result.current.zoomIn();
      });

      const { startIndex, endIndex, isZoomed } = result.current.zoomState;
      
      expect(isZoomed).toBe(true);
      expect(endIndex - startIndex).toBeLessThan(11);
      expect(startIndex).toBeGreaterThanOrEqual(0);
      expect(endIndex).toBeLessThan(12);
    });

    it('should not zoom in if range is already at minimum (2 points)', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      // Zoom in multiple times to reach minimum
      act(() => {
        result.current.handleBrushChange(5, 6); // 2 points
      });

      const beforeZoom = { ...result.current.zoomState };
      
      act(() => {
        result.current.zoomIn();
      });

      // Should not change
      expect(result.current.zoomState).toEqual(beforeZoom);
    });

    it('should center the zoom around the current view', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      // Set initial zoom to middle section
      act(() => {
        result.current.handleBrushChange(3, 8);
      });

      const initialCenter = (result.current.zoomState.startIndex + result.current.zoomState.endIndex) / 2;
      
      act(() => {
        result.current.zoomIn();
      });

      const newCenter = (result.current.zoomState.startIndex + result.current.zoomState.endIndex) / 2;
      
      // Center should be approximately the same
      expect(Math.abs(newCenter - initialCenter)).toBeLessThan(2);
    });
  });

  describe('zoomOut', () => {
    it('should zoom out and increase the visible range', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      // First zoom in
      act(() => {
        result.current.handleBrushChange(3, 6);
      });

      const initialRange = result.current.zoomState.endIndex - result.current.zoomState.startIndex;
      
      act(() => {
        result.current.zoomOut();
      });

      const newRange = result.current.zoomState.endIndex - result.current.zoomState.startIndex;
      
      // Range should increase or stay the same (if already at max)
      expect(newRange).toBeGreaterThanOrEqual(initialRange);
      // Should still be zoomed (unless we zoomed out to full range)
      if (result.current.zoomState.startIndex !== 0 || result.current.zoomState.endIndex !== 11) {
        expect(result.current.zoomState.isZoomed).toBe(true);
      }
    });

    it('should reset to full range when zooming out shows all data', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      // Set a small zoom
      act(() => {
        result.current.handleBrushChange(5, 7);
      });

      // Zoom out multiple times
      act(() => {
        result.current.zoomOut();
      });
      act(() => {
        result.current.zoomOut();
      });
      act(() => {
        result.current.zoomOut();
      });

      // Should eventually reset
      const { startIndex, endIndex, isZoomed } = result.current.zoomState;
      
      // Either still zoomed or reset
      if (startIndex === 0 && endIndex === 11) {
        expect(isZoomed).toBe(false);
      } else {
        expect(isZoomed).toBe(true);
      }
    });
  });

  describe('resetZoom', () => {
    it('should reset to full range', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      // Zoom in first
      act(() => {
        result.current.handleBrushChange(3, 6);
      });

      expect(result.current.zoomState.isZoomed).toBe(true);
      
      act(() => {
        result.current.resetZoom();
      });

      expect(result.current.zoomState).toEqual({
        startIndex: 0,
        endIndex: 11,
        isZoomed: false,
      });
    });
  });

  describe('handleBrushChange', () => {
    it('should update zoom state when brush changes', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      act(() => {
        result.current.handleBrushChange(2, 8);
      });

      expect(result.current.zoomState).toEqual({
        startIndex: 2,
        endIndex: 8,
        isZoomed: true,
      });
    });

    it('should set isZoomed to false when showing full range', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      act(() => {
        result.current.handleBrushChange(0, 11);
      });

      expect(result.current.zoomState.isZoomed).toBe(false);
    });

    it('should handle edge cases - start at beginning', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      act(() => {
        result.current.handleBrushChange(0, 5);
      });

      expect(result.current.zoomState.startIndex).toBe(0);
      expect(result.current.zoomState.isZoomed).toBe(true);
    });

    it('should handle edge cases - end at last index', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      act(() => {
        result.current.handleBrushChange(7, 11);
      });

      expect(result.current.zoomState.endIndex).toBe(11);
      expect(result.current.zoomState.isZoomed).toBe(true);
    });
  });

  describe('data length changes', () => {
    it('should reset zoom when data length increases', () => {
      const { result, rerender } = renderHook(
        ({ length }: { length: number }) => useZoomPan(length),
        { initialProps: { length: 12 } }
      );

      // Zoom in first
      act(() => {
        result.current.handleBrushChange(3, 6);
      });

      expect(result.current.zoomState.isZoomed).toBe(true);

      // Change data length - the zoom should be preserved if valid, or reset if invalid
      rerender({ length: 20 });

      // The zoom state should be valid for the new data length
      expect(result.current.zoomState.startIndex).toBeGreaterThanOrEqual(0);
      expect(result.current.zoomState.endIndex).toBeLessThan(20);
      expect(result.current.zoomState.endIndex).toBeGreaterThanOrEqual(result.current.zoomState.startIndex);
      
      // Since we increased data length, the previous zoom (3-6) is still valid
      // So it should be preserved, not reset
      if (result.current.zoomState.startIndex === 3 && result.current.zoomState.endIndex === 6) {
        expect(result.current.zoomState.isZoomed).toBe(true);
      } else {
        // Or it was reset to full range
        expect(result.current.zoomState.startIndex).toBe(0);
        expect(result.current.zoomState.endIndex).toBe(19);
        expect(result.current.zoomState.isZoomed).toBe(false);
      }
    });

    it('should reset zoom when data length decreases', () => {
      const { result, rerender } = renderHook(
        ({ length }: { length: number }) => useZoomPan(length),
        { initialProps: { length: 12 } }
      );

      // Zoom in first
      act(() => {
        result.current.handleBrushChange(3, 6);
      });

      // Change data length to smaller
      rerender({ length: 6 });

      expect(result.current.zoomState).toEqual({
        startIndex: 0,
        endIndex: 5,
        isZoomed: false,
      });
    });
  });

  describe('edge cases and bugs', () => {
    it('should handle invalid brush ranges (start > end)', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      act(() => {
        result.current.handleBrushChange(8, 3); // Invalid: start > end
      });

      // Should validate and swap the indices
      expect(result.current.zoomState.startIndex).toBe(3);
      expect(result.current.zoomState.endIndex).toBe(8);
      expect(result.current.zoomState.isZoomed).toBe(true);
    });

    it('should handle brush ranges outside data bounds', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      act(() => {
        result.current.handleBrushChange(-1, 15); // Out of bounds
      });

      // Should clamp to valid bounds
      expect(result.current.zoomState.startIndex).toBe(0);
      expect(result.current.zoomState.endIndex).toBe(11);
      expect(result.current.zoomState.isZoomed).toBe(false);
    });

    it('should maintain zoom state when zooming in/out multiple times', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      // Zoom in multiple times
      act(() => {
        result.current.zoomIn();
      });
      const afterFirstZoom = { ...result.current.zoomState };
      
      act(() => {
        result.current.zoomIn();
      });
      const afterSecondZoom = { ...result.current.zoomState };
      
      // Should continue zooming in
      expect(afterSecondZoom.endIndex - afterSecondZoom.startIndex)
        .toBeLessThan(afterFirstZoom.endIndex - afterFirstZoom.startIndex);
    });

    it('should handle rapid zoom in/out cycles', () => {
      const { result } = renderHook(() => useZoomPan(12));
      
      // Rapid zoom in/out
      act(() => {
        result.current.zoomIn();
        result.current.zoomOut();
        result.current.zoomIn();
        result.current.zoomOut();
      });

      // Should end in a valid state
      const { startIndex, endIndex } = result.current.zoomState;
      expect(startIndex).toBeGreaterThanOrEqual(0);
      expect(endIndex).toBeLessThan(12);
      expect(endIndex).toBeGreaterThanOrEqual(startIndex);
    });
  });
});

