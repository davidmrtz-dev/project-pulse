import { useState, useCallback, useEffect } from 'react';

export type ZoomState = {
  startIndex: number;
  endIndex: number;
  isZoomed: boolean;
};

export function useZoomPan(dataLength: number) {
  const [zoomState, setZoomState] = useState<ZoomState>({
    startIndex: 0,
    endIndex: Math.max(0, dataLength - 1),
    isZoomed: false,
  });

  // Reset zoom when data length changes, but only if current range is invalid
  useEffect(() => {
    setZoomState((prev) => {
      // Handle empty data
      if (dataLength === 0) {
        return {
          startIndex: 0,
          endIndex: -1,
          isZoomed: false,
        };
      }
      // Only reset if current range is invalid for new data length
      if (prev.endIndex >= dataLength || prev.startIndex < 0 || prev.startIndex >= dataLength || prev.endIndex < prev.startIndex) {
        return {
          startIndex: 0,
          endIndex: Math.max(0, dataLength - 1),
          isZoomed: false,
        };
      }
      // Adjust endIndex if it's beyond new data length but startIndex is still valid
      if (prev.endIndex >= dataLength) {
        return {
          startIndex: prev.startIndex,
          endIndex: Math.max(0, dataLength - 1),
          isZoomed: prev.startIndex !== 0 || Math.max(0, dataLength - 1) !== dataLength - 1,
        };
      }
      // Keep current zoom if it's still valid
      return prev;
    });
  }, [dataLength]);

  const zoomIn = useCallback(() => {
    setZoomState((prev) => {
      const range = prev.endIndex - prev.startIndex;
      if (range <= 2) return prev; // Don't zoom in too much

      const newRange = Math.max(2, Math.floor(range * 0.7));
      const center = prev.startIndex + Math.floor(range / 2);
      let newStart = Math.max(0, center - Math.floor(newRange / 2));
      let newEnd = Math.min(dataLength - 1, newStart + newRange - 1);
      
      // Ensure we have a valid range
      if (newEnd < newStart) {
        newEnd = Math.min(dataLength - 1, newStart + newRange - 1);
      }
      
      // If we hit the end boundary, adjust start
      if (newEnd === dataLength - 1 && newEnd - newStart < newRange) {
        newStart = Math.max(0, newEnd - newRange + 1);
      }

      return {
        startIndex: newStart,
        endIndex: newEnd,
        isZoomed: true,
      };
    });
  }, [dataLength]);

  const zoomOut = useCallback(() => {
    setZoomState((prev) => {
      // Handle edge case: single data point or empty data
      if (dataLength <= 1) {
        return {
          startIndex: 0,
          endIndex: Math.max(0, dataLength - 1),
          isZoomed: false,
        };
      }
      
      const range = prev.endIndex - prev.startIndex;
      const newRange = Math.min(dataLength, Math.floor(range * 1.4));
      const center = prev.startIndex + Math.floor(range / 2);
      let newStart = Math.max(0, center - Math.floor(newRange / 2));
      let newEnd = Math.min(dataLength - 1, newStart + newRange - 1);
      
      // Ensure we have a valid range
      if (newEnd < newStart) {
        newEnd = Math.min(dataLength - 1, newStart + newRange - 1);
      }
      
      // If we hit boundaries, adjust
      if (newEnd === dataLength - 1 && newStart > 0) {
        newStart = Math.max(0, newEnd - newRange + 1);
      }
      if (newStart === 0 && newEnd < dataLength - 1) {
        newEnd = Math.min(dataLength - 1, newStart + newRange - 1);
      }

      // If we've zoomed out to show all data, reset
      if (newStart === 0 && newEnd === dataLength - 1) {
        return {
          startIndex: 0,
          endIndex: dataLength - 1,
          isZoomed: false,
        };
      }

      return {
        startIndex: newStart,
        endIndex: newEnd,
        isZoomed: true,
      };
    });
  }, [dataLength]);

  const resetZoom = useCallback(() => {
    setZoomState({
      startIndex: 0,
      endIndex: dataLength - 1,
      isZoomed: false,
    });
  }, [dataLength]);

  const handleBrushChange = useCallback((startIndex: number, endIndex: number) => {
    // Validate and fix invalid ranges
    let validStart = Math.max(0, Math.min(startIndex, dataLength - 1));
    let validEnd = Math.max(0, Math.min(endIndex, dataLength - 1));
    
    // Ensure start <= end
    if (validStart > validEnd) {
      [validStart, validEnd] = [validEnd, validStart];
    }
    
    // Ensure at least one point is visible
    if (validStart === validEnd && dataLength > 1) {
      if (validEnd < dataLength - 1) {
        validEnd = validStart + 1;
      } else {
        validStart = validEnd - 1;
      }
    }
    
    setZoomState({
      startIndex: validStart,
      endIndex: validEnd,
      isZoomed: validStart !== 0 || validEnd !== dataLength - 1,
    });
  }, [dataLength]);

  return {
    zoomState,
    zoomIn,
    zoomOut,
    resetZoom,
    handleBrushChange,
  };
}

