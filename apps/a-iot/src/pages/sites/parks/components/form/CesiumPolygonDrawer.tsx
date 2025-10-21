import { useEffect, useRef, useState } from 'react';
import { Button } from '@plug-atlas/ui';
import * as Cesium from "cesium";
import {toast} from "sonner";

interface CesiumPolygonDrawerProps {
    onPolygonComplete: (wktString: string) => void;
    initialWkt?: string;
}

interface DrawingState {
    isDrawing: boolean;
    activePoints: Cesium.Entity[];
    activeShapePoints: Cesium.Cartesian3[];
    activeShape: Cesium.Entity | null;
    dynamicPoint: Cesium.Entity | null;
    handler: Cesium.ScreenSpaceEventHandler | null;
}

export default function CesiumPolygonDrawer({ onPolygonComplete, initialWkt }: CesiumPolygonDrawerProps) {
    const cesiumContainerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [activePoints, setActivePoints] = useState<Cesium.Entity[]>([]);
    const [showHelp, setShowHelp] = useState(true);
    const [canComplete, setCanComplete] = useState(false);
    
    const drawingStateRef = useRef<DrawingState>({
        isDrawing: false,
        activePoints: [],
        activeShapePoints: [],
        activeShape: null,
        dynamicPoint: null,
        handler: null,
    });

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isDrawing) return;
            
            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    cancelDrawing();
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (canComplete) {
                        completeDrawing();
                    }
                    break;
                case 'Backspace':
                    event.preventDefault();
                    removeLastPoint();
                    break;
                case 'h':
                case 'H':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        setShowHelp(prev => !prev);
                    }
                    break;
            }
        };

        if (isDrawing) {
            document.addEventListener('keydown', handleKeyPress);
            return () => document.removeEventListener('keydown', handleKeyPress);
        }
    }, [isDrawing, canComplete]);

    useEffect(() => {
        if (!cesiumContainerRef.current) return;

        const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
            homeButton: false,
            sceneModePicker: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            geocoder: false,
            infoBox: false,
            selectionIndicator: false,
            shadows: false,
            terrainShadows: Cesium.ShadowMode.DISABLED,
        });

        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(127.5, 37.5, 5000),
        });

        viewer.scene.globe.depthTestAgainstTerrain = false;

        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(() => {
            viewer.canvas.style.cursor = drawingStateRef.current.isDrawing ? 'crosshair' : 'default';
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        viewerRef.current = viewer;

        if (initialWkt && initialWkt.trim()) {
            displayWktPolygon(viewer, initialWkt);
        }

        return () => {
            if (viewer && !viewer.isDestroyed()) {
                cleanupDrawing();
                viewer.destroy();
            }
        };
    }, [initialWkt]);

    const displayWktPolygon = (viewer: Cesium.Viewer, wkt: string) => {
        try {
            const coordinates = parseWktToCoordinates(wkt);
            if (coordinates.length > 0) {
                const cartesianCoords = coordinates
                    .filter((coord): coord is [number, number] => coord.length === 2 &&
                        typeof coord[0] === 'number' && typeof coord[1] === 'number')
                    .map((coord) => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));

                if (cartesianCoords.length > 0) {
                    viewer.entities.add({
                        name: 'Initial Polygon',
                        polygon: {
                            hierarchy: cartesianCoords,
                            material: Cesium.Color.BLUE.withAlpha(0.4),
                            outline: true,
                            outlineColor: Cesium.Color.BLUE,
                            height: 0,
                        },
                    });

                    const center = Cesium.BoundingSphere.fromPoints(cartesianCoords).center;
                    const cartographic = Cesium.Cartographic.fromCartesian(center);
                    viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(
                            Cesium.Math.toDegrees(cartographic.longitude),
                            Cesium.Math.toDegrees(cartographic.latitude),
                            30000
                        ),
                        duration: 1.5,
                    });
                }
            }
        } catch (error) {
            console.error('WKT 파싱 오류:', error);
        }
    };

    const parseWktToCoordinates = (wkt: string): [number, number][] => {
        const match = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i);
        if (!match || !match[1]) return [];

        return match[1].split(',')
            .map((coord: string) => {
                const parts = coord.trim().split(/\s+/).map(Number);
                const lon = parts[0];
                const lat = parts[1];
                
                if (parts.length >= 2 && 
                    typeof lon === 'number' && !isNaN(lon) && 
                    typeof lat === 'number' && !isNaN(lat)) {
                    return [lon, lat] as [number, number];
                }
                return null;
            })
            .filter((coord): coord is [number, number] => coord !== null);
    };

    const createPoint = (viewer: Cesium.Viewer, worldPosition: Cesium.Cartesian3, isActive = false): Cesium.Entity => {
        return viewer.entities.add({
            position: worldPosition,
            point: {
                pixelSize: isActive ? 12 : 8,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                color: isActive ? Cesium.Color.ORANGE : Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
            },
            label: isActive ? {
                text: `점 ${drawingStateRef.current.activePoints.length + 1}`,
                font: '12pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
            } : undefined,
        });
    };

    const updateCanComplete = (pointCount: number) => {
        const newCanComplete = pointCount >= 3;
        setCanComplete(newCanComplete);
    };

    const startDrawing = () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current;
        cleanupDrawing();

        setIsDrawing(true);
        setActivePoints([]);
        setCanComplete(false);
        drawingStateRef.current.isDrawing = true;
        drawingStateRef.current.activePoints = [];
        drawingStateRef.current.activeShapePoints = [];

        const entitiesToRemove: Cesium.Entity[] = [];
        viewer.entities.values.forEach((entity: Cesium.Entity) => {
            if (entity.name !== 'Initial Polygon') {
                entitiesToRemove.push(entity);
            }
        });
        entitiesToRemove.forEach(entity => viewer.entities.remove(entity));

        viewer.canvas.style.cursor = 'crosshair';

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        drawingStateRef.current.handler = handler;

        drawingStateRef.current.dynamicPoint = viewer.entities.add({
            position: new Cesium.ConstantPositionProperty(Cesium.Cartesian3.ZERO),
            point: {
                pixelSize: 8,
                color: Cesium.Color.CYAN.withAlpha(0.7),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });

        handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            if (!drawingStateRef.current.isDrawing) return;

            const pickedPosition = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (!pickedPosition) return;

            if (drawingStateRef.current.dynamicPoint) {
                drawingStateRef.current.dynamicPoint.position = new Cesium.ConstantPositionProperty(pickedPosition);
            }

            if (drawingStateRef.current.activeShapePoints.length >= 2) {
                const tempPoints = [...drawingStateRef.current.activeShapePoints, pickedPosition];

                if (drawingStateRef.current.activeShape && drawingStateRef.current.activeShape.polygon) {
                    drawingStateRef.current.activeShape.polygon.hierarchy = new Cesium.ConstantProperty(
                        new Cesium.PolygonHierarchy(tempPoints)
                    );
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const pickedPosition = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
            if (!pickedPosition) return;

            if (drawingStateRef.current.activeShapePoints.length === 0) {
                drawingStateRef.current.activeShape = viewer.entities.add({
                    polygon: {
                        hierarchy: new Cesium.ConstantProperty(
                            new Cesium.PolygonHierarchy([pickedPosition])
                        ),
                        material: Cesium.Color.YELLOW.withAlpha(0.4),
                        outline: true,
                        outlineColor: Cesium.Color.YELLOW,
                        height: 0,
                    },
                });
            }

            const pointEntity = createPoint(viewer, pickedPosition, true);
            drawingStateRef.current.activePoints.push(pointEntity);
            drawingStateRef.current.activeShapePoints.push(pickedPosition);
            setActivePoints([...drawingStateRef.current.activePoints]);
            updateCanComplete(drawingStateRef.current.activePoints.length);

            if (drawingStateRef.current.activeShape && drawingStateRef.current.activeShape.polygon) {
                drawingStateRef.current.activeShape.polygon.hierarchy = new Cesium.ConstantProperty(
                    new Cesium.PolygonHierarchy(drawingStateRef.current.activeShapePoints)
                );
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(() => {
            completeDrawing();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        handler.setInputAction(() => {
            removeLastPoint();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(() => {}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    const removeLastPoint = () => {
        if (drawingStateRef.current.activePoints.length === 0) return;

        const viewer = viewerRef.current;
        if (!viewer) return;

        const lastPoint = drawingStateRef.current.activePoints.pop();
        if (lastPoint) {
            viewer.entities.remove(lastPoint);
        }

        drawingStateRef.current.activeShapePoints.pop();
        setActivePoints([...drawingStateRef.current.activePoints]);
        updateCanComplete(drawingStateRef.current.activePoints.length);

        if (drawingStateRef.current.activeShape && drawingStateRef.current.activeShape.polygon) {
            if (drawingStateRef.current.activeShapePoints.length >= 3) {
                drawingStateRef.current.activeShape.polygon.hierarchy = new Cesium.ConstantProperty(
                    new Cesium.PolygonHierarchy(drawingStateRef.current.activeShapePoints)
                );
            } else if (drawingStateRef.current.activeShapePoints.length === 0) {
                viewer.entities.remove(drawingStateRef.current.activeShape);
                drawingStateRef.current.activeShape = null;
            }
        }
    };

    const completeDrawing = () => {
        if (!viewerRef.current || drawingStateRef.current.activeShapePoints.length < 3) {
            toast.warning('폴리곤을 그리려면 최소 3개의 점이 필요합니다.');
            return;
        }

        const viewer = viewerRef.current;

        const coordinates = drawingStateRef.current.activeShapePoints.map((cartesian: Cesium.Cartesian3) => {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            return [
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude)
            ];
        });

        const firstCoordinate = coordinates[0];
        if (firstCoordinate) {
            coordinates.push(firstCoordinate);
        }

        const wktString = `POLYGON ((${coordinates
            .filter((coord): coord is [number, number] => coord !== undefined && coord.length === 2)
            .map((coord) => `${coord[0].toFixed(6)} ${coord[1].toFixed(6)}`)
            .join(', ')}))`;

        cleanupDrawingElements();

        viewer.entities.add({
            name: 'Drawn Polygon',
            polygon: {
                hierarchy: drawingStateRef.current.activeShapePoints,
                material: Cesium.Color.BLUE.withAlpha(0.4),
                outline: true,
                outlineColor: Cesium.Color.BLUE,
                height: 0,
            },
        });

        setIsDrawing(false);
        setActivePoints([]);
        setCanComplete(false);
        drawingStateRef.current.isDrawing = false;
        viewer.canvas.style.cursor = 'default';

        onPolygonComplete(wktString);
    };

    const cleanupDrawingElements = () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current;

        if (drawingStateRef.current.activeShape) {
            viewer.entities.remove(drawingStateRef.current.activeShape);
            drawingStateRef.current.activeShape = null;
        }

        if (drawingStateRef.current.dynamicPoint) {
            viewer.entities.remove(drawingStateRef.current.dynamicPoint);
            drawingStateRef.current.dynamicPoint = null;
        }

        drawingStateRef.current.activePoints.forEach((point: Cesium.Entity) => {
            viewer.entities.remove(point);
        });
    };

    const cleanupDrawing = () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current;

        if (drawingStateRef.current.handler) {
            drawingStateRef.current.handler.destroy();
            drawingStateRef.current.handler = null;
        }

        cleanupDrawingElements();

        drawingStateRef.current.isDrawing = false;
        drawingStateRef.current.activePoints = [];
        drawingStateRef.current.activeShapePoints = [];

        viewer.canvas.style.cursor = 'default';
    };

    const clearAll = () => {
        if (!viewerRef.current) return;

        cleanupDrawing();
        setIsDrawing(false);
        setActivePoints([]);
        setCanComplete(false);

        viewerRef.current.entities.removeAll();
        onPolygonComplete('');
    };

    const cancelDrawing = () => {
        cleanupDrawing();
        setIsDrawing(false);
        setActivePoints([]);
        setCanComplete(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap items-center">
                <Button
                    onClick={startDrawing}
                    disabled={isDrawing}
                    variant={isDrawing ? 'secondary' : 'default'}
                    className={isDrawing ? 'animate-pulse' : ''}
                >
                    {isDrawing ? '그리는 중...' : '폴리곤 그리기 시작'}
                </Button>

                {isDrawing && (
                    <>
                        <Button
                            onClick={completeDrawing}
                            disabled={!canComplete}
                            variant={canComplete ? 'default' : 'outline'}
                            className={canComplete ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                        >
                            그리기 완료 {canComplete && '(Enter)'}
                        </Button>
                        <Button
                            onClick={removeLastPoint}
                            disabled={activePoints.length === 0}
                            variant="outline"
                            size="sm"
                        >
                            실행 취소 (Backspace)
                        </Button>
                        <Button
                            onClick={cancelDrawing}
                            variant="destructive"
                            size="sm"
                        >
                            취소 (Esc)
                        </Button>
                        <Button
                            onClick={() => setShowHelp(!showHelp)}
                            variant="ghost"
                            size="sm"
                        >
                            도움말 {showHelp ? '숨기기' : '보기'}
                        </Button>
                    </>
                )}

                {!isDrawing && (
                    <Button
                        onClick={clearAll}
                        variant="destructive"
                    >
                        모두 지우기
                    </Button>
                )}
            </div>

            {isDrawing && showHelp && (
                <div className="text-sm space-y-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                    <div className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        그리기 도움말
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p>• <strong>왼쪽 클릭:</strong> 점 추가</p>
                        <p>• <strong>우클릭:</strong> 마지막 점 제거</p>
                        <p>• <strong>더블클릭:</strong> 그리기 완료</p>
                        <p>• <strong>Enter:</strong> 그리기 완료</p>
                        <p>• <strong>Backspace:</strong> 실행 취소</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-blue-200">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-800">
                                현재 점 개수: <span className="text-lg">{activePoints.length}</span>개
                            </span>
                            {canComplete && (
                                <span className="text-green-600 font-medium animate-pulse">
                                    ✓ 완료 가능
                                </span>
                            )}
                            {!canComplete && activePoints.length > 0 && (
                                <span className="text-orange-600 font-medium">
                                    {3 - activePoints.length}개 더 필요
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={cesiumContainerRef}
                className="w-full h-[400px] border rounded-md overflow-hidden shadow-sm"
                style={{ position: 'relative' }}
                tabIndex={0}
            />
        </div>
    );
}