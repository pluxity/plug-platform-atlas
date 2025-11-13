import { useEffect, useRef, useState } from 'react';
import { Viewer as CesiumViewer } from 'cesium';
import { useViewerStore, useMarkerStore, useCameraStore } from '../../../../stores/cesium';

interface EventLocationMapProps {
  longitude: number;
  latitude: number;
  eventName?: string;
}

export default function EventLocationMap({ longitude, latitude, eventName }: EventLocationMapProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { createViewer, setupImagery } = useViewerStore();
  const { addMarker, clearAllMarkers } = useMarkerStore();
  const { focusOn } = useCameraStore();

  // Validate coordinates
  const hasValidCoordinates =
    longitude !== undefined &&
    longitude !== null &&
    latitude !== undefined &&
    latitude !== null &&
    !isNaN(longitude) &&
    !isNaN(latitude);

  useEffect(() => {
    if (!cesiumContainerRef.current || !hasValidCoordinates) return;

    if (viewerRef.current && !viewerRef.current.isDestroyed()) {
      return;
    }

    let mounted = true;

    const initViewer = async () => {
      try {
        if (!mounted || !hasValidCoordinates) return;

        setIsInitialized(false);

        const viewer = createViewer(cesiumContainerRef.current!);

        if (!mounted) {
          viewer.destroy();
          return;
        }

        viewerRef.current = viewer;

        await setupImagery(viewer);
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!mounted) return;

        addMarker(viewer, {
          id: 'event-marker',
          lon: longitude,
          lat: latitude,
          height: 50,
          label: eventName,
          labelColor: '#DC2626',
        });

        focusOn(viewer, { lon: longitude, lat: latitude }, 800);

        setIsInitialized(true);
      } catch (error) {
        console.error('지도 초기화 오류:', error);
      }
    };

    initViewer();

    return () => {
      mounted = false;
      try {
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          clearAllMarkers(viewerRef.current);
          viewerRef.current.destroy();
          viewerRef.current = null;
        }
      } catch (error) {
        console.error('뷰어 정리 중 오류:', error);
      }
      setIsInitialized(false);
    };
  }, [longitude, latitude, hasValidCoordinates]);

  if (!hasValidCoordinates) {
    return (
      <div className="relative">
        <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-sm">위치 정보가 없습니다.</p>
            <p className="text-xs mt-1">경도: {longitude || 'N/A'}, 위도: {latitude || 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={cesiumContainerRef}
        className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200"
        style={{ position: 'relative' }}
      />

      {!isInitialized && (
        <div className="absolute inset-0 bg-gray-100/80 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-sm text-gray-600">지도 로딩 중...</span>
          </div>
        </div>
      )}
    </div>
  );
}
