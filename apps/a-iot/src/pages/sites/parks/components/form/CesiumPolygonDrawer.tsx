
import { useEffect, useRef, useState } from 'react';
import { Button } from '@plug-atlas/ui';
import * as Cesium from "cesium";

interface CesiumPolygonDrawerProps {
    onPolygonComplete: (wktString: string) => void;
    initialWkt?: string;
}

interface DrawingState {
    isDrawing: boolean;
    activePoints: Cesium.Entity[];
    activeShapePoints: Cesium.Cartesian3[];
    activeShape: Cesium.Entity | null;
    floatingPoint: Cesium.Entity | null;
    dynamicPoint: Cesium.Entity | null;
    handler: Cesium.ScreenSpaceEventHandler | null;
}

export default function CesiumPolygonDrawer({ onPolygonComplete, initialWkt }: CesiumPolygonDrawerProps) {
    const cesiumContainerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [activePoints, setActivePoints] = useState<Cesium.Entity[]>([]);
    const drawingStateRef = useRef<DrawingState>({
        isDrawing: false,
        activePoints: [],
        activeShapePoints: [],
        activeShape: null,
        floatingPoint: null,
        dynamicPoint: null,
        handler: null,
    });

    useEffect(() => {
        if (!cesiumContainerRef.current) return;

        // 세슘 뷰어 초기화
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

        // 한국 중심으로 카메라 위치 설정
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(127.5, 37.5, 500000),
        });

        // 깊이 테스트 비활성화
        viewer.scene.globe.depthTestAgainstTerrain = false;

        // 마우스 커서 개선
        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(() => {
            viewer.canvas.style.cursor = drawingStateRef.current.isDrawing ? 'crosshair' : 'default';
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        viewerRef.current = viewer;

        // 초기 WKT가 있으면 표시
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

                    // 폴리곤 중심으로 카메라 이동
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
                if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    return [parts[0], parts[1]] as [number, number];
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

    const startDrawing = () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current;
        cleanupDrawing();

        setIsDrawing(true);
        setActivePoints([]);
        drawingStateRef.current.isDrawing = true;
        drawingStateRef.current.activePoints = [];
        drawingStateRef.current.activeShapePoints = [];

        // 기존 그려진 폴리곤 제거 (초기 폴리곤 제외)
        const entitiesToRemove: Cesium.Entity[] = [];
        viewer.entities.values.forEach((entity: Cesium.Entity) => {
            if (entity.name !== 'Initial Polygon') {
                entitiesToRemove.push(entity);
            }
        });
        entitiesToRemove.forEach(entity => viewer.entities.remove(entity));

        // 커서 변경
        viewer.canvas.style.cursor = 'crosshair';

        // 이벤트 핸들러 설정
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        drawingStateRef.current.handler = handler;

        // 동적 점 생성 (마우스를 따라다니는 점)
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

        // 마우스 이동: 동적 점 위치 업데이트
        handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            if (!drawingStateRef.current.isDrawing) return;

            const pickedPosition = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (!pickedPosition) return;

            // 동적 점 위치 업데이트
            if (drawingStateRef.current.dynamicPoint) {
                drawingStateRef.current.dynamicPoint.position = new Cesium.ConstantPositionProperty(pickedPosition);
            }

            // 임시 폴리곤 업데이트 (2개 이상의 점이 있을 때)
            if (drawingStateRef.current.activeShapePoints.length >= 2) {
                const tempPoints = [...drawingStateRef.current.activeShapePoints, pickedPosition];

                if (drawingStateRef.current.activeShape && drawingStateRef.current.activeShape.polygon) {
                    drawingStateRef.current.activeShape.polygon.hierarchy = new Cesium.ConstantProperty(
                        new Cesium.PolygonHierarchy(tempPoints)
                    );
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 왼쪽 클릭: 점 추가
        handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const pickedPosition = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
            if (!pickedPosition) return;

            // 첫 번째 점일 때 임시 폴리곤 생성
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

            // 점 추가
            const pointEntity = createPoint(viewer, pickedPosition, true);
            drawingStateRef.current.activePoints.push(pointEntity);
            drawingStateRef.current.activeShapePoints.push(pickedPosition);
            setActivePoints([...drawingStateRef.current.activePoints]);

            // 폴리곤 업데이트
            if (drawingStateRef.current.activeShape && drawingStateRef.current.activeShape.polygon) {
                drawingStateRef.current.activeShape.polygon.hierarchy = new Cesium.ConstantProperty(
                    new Cesium.PolygonHierarchy(drawingStateRef.current.activeShapePoints)
                );
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 더블클릭: 그리기 완료
        handler.setInputAction(() => {
            completeDrawing();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // 우클릭: 마지막 점 제거
        handler.setInputAction(() => {
            removeLastPoint();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    const removeLastPoint = () => {
        if (drawingStateRef.current.activePoints.length === 0) return;

        const viewer = viewerRef.current;
        if (!viewer) return;

        // 마지막 점 제거
        const lastPoint = drawingStateRef.current.activePoints.pop();
        if (lastPoint) {
            viewer.entities.remove(lastPoint);
        }

        drawingStateRef.current.activeShapePoints.pop();
        setActivePoints([...drawingStateRef.current.activePoints]);

        // 폴리곤 업데이트
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
            alert('폴리곤을 그리려면 최소 3개의 점이 필요합니다.');
            return;
        }

        const viewer = viewerRef.current;

        // 좌표를 경위도로 변환
        const coordinates = drawingStateRef.current.activeShapePoints.map((cartesian: Cesium.Cartesian3) => {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            return [
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude)
            ];
        });

        // 첫 번째 점을 마지막에 추가하여 폴리곤 닫기 (null 체크 추가)
        const firstCoordinate = coordinates[0];
        if (firstCoordinate) {
            coordinates.push(firstCoordinate);
        }

        // WKT 형식으로 변환 (소수점 6자리로 반올림)
        const wktString = `POLYGON ((${coordinates
            .filter((coord): coord is [number, number] => coord !== undefined && coord.length === 2)
            .map((coord) => `${coord[0].toFixed(6)} ${coord[1].toFixed(6)}`)
            .join(', ')}))`;

        // 임시 요소들 제거
        cleanupDrawingElements();

        // 최종 폴리곤 추가
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

        // 상태 초기화
        setIsDrawing(false);
        setActivePoints([]);
        drawingStateRef.current.isDrawing = false;
        viewer.canvas.style.cursor = 'default';

        onPolygonComplete(wktString);
    };

    const cleanupDrawingElements = () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current;

        // 임시 폴리곤 제거
        if (drawingStateRef.current.activeShape) {
            viewer.entities.remove(drawingStateRef.current.activeShape);
            drawingStateRef.current.activeShape = null;
        }

        // 동적 점 제거
        if (drawingStateRef.current.dynamicPoint) {
            viewer.entities.remove(drawingStateRef.current.dynamicPoint);
            drawingStateRef.current.dynamicPoint = null;
        }

        // 모든 그리기 점들 제거
        drawingStateRef.current.activePoints.forEach((point: Cesium.Entity) => {
            viewer.entities.remove(point);
        });
    };

    const cleanupDrawing = () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current;

        // 이벤트 핸들러 제거
        if (drawingStateRef.current.handler) {
            drawingStateRef.current.handler.destroy();
            drawingStateRef.current.handler = null;
        }

        // 그리기 요소들 정리
        cleanupDrawingElements();

        // 상태 초기화
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

        // 모든 엔티티 제거
        viewerRef.current.entities.removeAll();
        onPolygonComplete('');
    };

    const cancelDrawing = () => {
        cleanupDrawing();
        setIsDrawing(false);
        setActivePoints([]);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                <Button
                    onClick={startDrawing}
                    disabled={isDrawing}
                    variant={isDrawing ? 'secondary' : 'default'}
                >
                    {isDrawing ? '그리는 중...' : '폴리곤 그리기 시작'}
                </Button>

                {isDrawing && (
                    <>
                        <Button
                            onClick={completeDrawing}
                            disabled={activePoints.length < 3}
                            variant="outline"
                        >
                            그리기 완료
                        </Button>
                        <Button
                            onClick={removeLastPoint}
                            disabled={activePoints.length === 0}
                            variant="outline"
                            size="sm"
                        >
                            마지막 점 제거
                        </Button>
                        <Button
                            onClick={cancelDrawing}
                            variant="destructive"
                            size="sm"
                        >
                            취소
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

            {isDrawing && (
                <div className="text-sm text-muted-foreground space-y-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="font-medium text-blue-800 mb-2">그리기 도움말:</div>
                    <p>• <strong>왼쪽 클릭:</strong> 점 추가</p>
                    <p>• <strong>우클릭:</strong> 마지막 점 제거</p>
                    <p>• <strong>더블클릭:</strong> 그리기 완료</p>
                    <p>• <strong>현재 점 개수:</strong> {activePoints.length}개 {activePoints.length >= 3 && '(완료 가능)'}</p>
                </div>
            )}

            <div
                ref={cesiumContainerRef}
                className="w-full h-[400px] border rounded-md overflow-hidden"
                style={{ position: 'relative' }}
            />
        </div>
    );
}