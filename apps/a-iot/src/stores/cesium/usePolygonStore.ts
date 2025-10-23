import { create } from 'zustand'
import {
    Viewer as CesiumViewer,
    Entity,
    Cartesian3,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Color,
    ConstantProperty,
    PolygonHierarchy,
    Cartographic,
    Math as CesiumMath,
    HeightReference,
    NearFarScalar,
    VerticalOrigin,
    Cartesian2,
    LabelStyle,
    defined,
} from 'cesium'

interface DrawingState {
    isDrawing: boolean
    activePoints: Entity[]
    activeShapePoints: Cartesian3[]
    activeShape: Entity | null
    dynamicPoint: Entity | null
    handler: ScreenSpaceEventHandler | null
}

interface PolygonState {
    drawingStates: Map<string, DrawingState>
}

interface PolygonActions {
    // 폴리곤 그리기
    startDrawing: (viewer: CesiumViewer, viewerId: string) => void
    completeDrawing: (viewer: CesiumViewer, viewerId: string) => string | null
    cancelDrawing: (viewer: CesiumViewer, viewerId: string) => void
    removeLastPoint: (viewer: CesiumViewer, viewerId: string) => void

    // 폴리곤 표시
    displayWktPolygon: (viewer: CesiumViewer, wkt: string, options?: PolygonDisplayOptions) => Entity | null
    removePolygon: (viewer: CesiumViewer, entityId: string) => void
    clearAllPolygons: (viewer: CesiumViewer) => void

    // 상태 관리
    getDrawingState: (viewerId: string) => DrawingState | null
    isDrawingActive: (viewerId: string) => boolean
    getPointCount: (viewerId: string) => number

    // 헬퍼 메서드들
    createPoint: (viewer: CesiumViewer, worldPosition: Cartesian3, pointIndex: number) => Entity
    cleanupDrawingElements: (viewer: CesiumViewer, viewerId: string) => void
    parseWktToCoordinates: (wkt: string) => [number, number][]
    updateDynamicPoint: (viewer: CesiumViewer, viewerId: string, position: Cartesian3) => void
    isValidCartesian3: (position: Cartesian3) => boolean
    safeFromDegrees: (lon: number, lat: number, height?: number) => Cartesian3 | null
}

interface PolygonDisplayOptions {
    name?: string
    fillColor?: Color
    outlineColor?: Color
    fillAlpha?: number
    height?: number
}

type PolygonStore = PolygonState & PolygonActions

const createInitialDrawingState = (): DrawingState => ({
    isDrawing: false,
    activePoints: [],
    activeShapePoints: [],
    activeShape: null,
    dynamicPoint: null,
    handler: null,
})

export const usePolygonStore = create<PolygonStore>((set, get) => ({
    drawingStates: new Map(),

    getDrawingState: (viewerId: string) => {
        const state = get().drawingStates.get(viewerId)
        return state || null
    },

    isDrawingActive: (viewerId: string) => {
        const state = get().getDrawingState(viewerId)
        return state?.isDrawing || false
    },

    getPointCount: (viewerId: string) => {
        const state = get().getDrawingState(viewerId)
        return state?.activePoints.length || 0
    },

    // Cartesian3 좌표 검증 함수
    isValidCartesian3: (position: Cartesian3): boolean => {
        return defined(position) &&
               defined(position.x) && !isNaN(position.x) && isFinite(position.x) &&
               defined(position.y) && !isNaN(position.y) && isFinite(position.y) &&
               defined(position.z) && !isNaN(position.z) && isFinite(position.z)
    },

    // 안전한 좌표 변환 함수
    safeFromDegrees: (lon: number, lat: number, height: number = 0): Cartesian3 | null => {
        try {
            // 좌표값 유효성 검증
            if (!isFinite(lon) || !isFinite(lat) || !isFinite(height) ||
                Math.abs(lon) > 180 || Math.abs(lat) > 90) {
                console.warn('잘못된 좌표값:', lon, lat, height)
                return null
            }

            const cartesian = Cartesian3.fromDegrees(lon, lat, height)
            
            // 결과 검증
            if (!get().isValidCartesian3(cartesian)) {
                console.warn('변환된 좌표가 유효하지 않음:', cartesian)
                return null
            }

            return cartesian
        } catch (error) {
            console.error('좌표 변환 실패:', error, lon, lat, height)
            return null
        }
    },

    createPoint: (viewer: CesiumViewer, worldPosition: Cartesian3, pointIndex: number): Entity => {
        if (!get().isValidCartesian3(worldPosition)) {
            console.error('잘못된 좌표로 포인트를 생성할 수 없습니다:', worldPosition)
            throw new Error('Invalid cartesian coordinates for point creation')
        }

        return viewer.entities.add({
            position: worldPosition,
            point: {
                pixelSize: 14,
                color: Color.fromCssColorString('#3B82F6'),
                outlineColor: Color.WHITE,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                scaleByDistance: new NearFarScalar(1.5e2, 1.2, 1.5e7, 0.6),
                heightReference: HeightReference.CLAMP_TO_GROUND,
            },
            label: {
                text: `${pointIndex + 1}`,
                font: '14pt "Inter", "SF Pro Display", system-ui, sans-serif',
                style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 3,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian2(0, -12),
                fillColor: Color.WHITE,
                outlineColor: Color.fromCssColorString('#3B82F6'),
                scale: 1.0,
                backgroundColor: Color.fromCssColorString('#3B82F6').withAlpha(0.9),
                backgroundPadding: new Cartesian2(8, 4),
                showBackground: true,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            ellipse: {
                semiMajorAxis: 2.0,
                semiMinorAxis: 2.0,
                material: Color.fromCssColorString('#3B82F6').withAlpha(0.3),
                outline: true,
                outlineColor: Color.fromCssColorString('#3B82F6').withAlpha(0.6),
                heightReference: HeightReference.CLAMP_TO_GROUND,
            },

        })
    },

    cleanupDrawingElements: (viewer: CesiumViewer, viewerId: string) => {
        const state = get().getDrawingState(viewerId)
        if (!state) return

        try {
            if (state.activeShape) {
                viewer.entities.remove(state.activeShape)
                state.activeShape = null
            }

            if (state.dynamicPoint) {
                viewer.entities.remove(state.dynamicPoint)
                state.dynamicPoint = null
            }

            state.activePoints.forEach((point: Entity) => {
                if (viewer.entities.contains(point)) {
                    viewer.entities.remove(point)
                }
            })

            state.activePoints = []
            state.activeShapePoints = []
        } catch (error) {
            console.error('엔티티 정리 중 오류 발생:', error)
        }
    },

    parseWktToCoordinates: (wkt: string): [number, number][] => {
        if (!wkt || typeof wkt !== 'string') return []

        const match = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i)
        if (!match || !match[1]) return []

        return match[1].split(',')
            .map((coord: string) => {
                const parts = coord.trim().split(/\s+/).map(Number)
                const lon = parts[0]
                const lat = parts[1]

                if (parts.length >= 2 &&
                    typeof lon === 'number' && !isNaN(lon) && isFinite(lon) &&
                    typeof lat === 'number' && !isNaN(lat) && isFinite(lat) &&
                    Math.abs(lon) <= 180 && Math.abs(lat) <= 90) {
                    return [lon, lat] as [number, number]
                }
                return null
            })
            .filter((coord): coord is [number, number] => coord !== null)
    },

    updateDynamicPoint: (viewer: CesiumViewer, viewerId: string, position: Cartesian3) => {
        const state = get().getDrawingState(viewerId)
        if (!state?.isDrawing) return

        if (!get().isValidCartesian3(position)) {
            console.warn('잘못된 좌표로 동적 포인트를 업데이트할 수 없습니다:', position)
            return
        }

        try {
            if (state.dynamicPoint) {
                viewer.entities.remove(state.dynamicPoint)
                state.dynamicPoint = null
            }

            state.dynamicPoint = viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 8,
                    color: Color.YELLOW.withAlpha(0.8),
                    outlineColor: Color.WHITE,
                    outlineWidth: 2,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    // HeightReference 제거
                },
            })

            set((prev) => ({
                drawingStates: new Map(prev.drawingStates.set(viewerId, state))
            }))
        } catch (error) {
            console.error('동적 포인트 업데이트 중 오류 발생:', error)
        }
    },

    startDrawing: (viewer: CesiumViewer, viewerId: string) => {
        const currentState = get().drawingStates.get(viewerId)
        if (currentState?.isDrawing) {
            console.warn('이미 그리기 모드가 활성화되어 있습니다.')
            return
        }
        
        get().cancelDrawing(viewer, viewerId)

        const newState = createInitialDrawingState()
        newState.isDrawing = true
        
        try {
            const entitiesToRemove: Entity[] = []
            viewer.entities.values.forEach((entity: Entity) => {
                if (entity.name !== 'Initial Polygon') {
                    entitiesToRemove.push(entity)
                }
            })
            entitiesToRemove.forEach(entity => viewer.entities.remove(entity))

            viewer.canvas.style.cursor = 'crosshair'

            const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
            newState.handler = handler

            // 마우스 이동 이벤트
// 마우스 이동 이벤트 부분을 다음과 같이 수정하세요:

// 마우스 이동 이벤트 - 개선된 버전
            handler.setInputAction((movement: any) => {
                const state = get().getDrawingState(viewerId)
                if (!state?.isDrawing) return

                try {
                    // 더 정확한 좌표 획득을 위해 다양한 방법 시도
                    let pickedPosition: Cartesian3 | undefined

                    // 1. 먼저 3D 객체와의 교점을 확인
                    const pickedObject = viewer.scene.pick(movement.endPosition)
                    if (defined(pickedObject)) {
                        pickedPosition = viewer.scene.pickPosition(movement.endPosition)
                    }

                    // 2. 3D 객체가 없으면 지구 표면과의 교점 계산
                    if (!pickedPosition || !get().isValidCartesian3(pickedPosition)) {
                        pickedPosition = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
                    }

                    // 3. 지구 표면도 없으면 지형과의 교점 시도
                    if (!pickedPosition || !get().isValidCartesian3(pickedPosition)) {
                        const ray = viewer.camera.getPickRay(movement.endPosition)
                        if (ray) {
                            pickedPosition = viewer.scene.globe.pick(ray, viewer.scene)
                        }
                    }

                    if (!pickedPosition || !get().isValidCartesian3(pickedPosition)) {
                        return
                    }

                    // 동적 포인트 업데이트
                    get().updateDynamicPoint(viewer, viewerId, pickedPosition)

                    // 활성 폴리곤 실시간 미리보기 업데이트
                    if (state.activeShapePoints.length >= 2) {
                        const tempPoints = [...state.activeShapePoints, pickedPosition]
                        if (state.activeShape?.polygon && tempPoints.every(p => get().isValidCartesian3(p))) {
                            state.activeShape.polygon.hierarchy = new ConstantProperty(
                                new PolygonHierarchy(tempPoints)
                            )
                        }
                    }

                    // 렌더링 요청 (부드러운 애니메이션을 위해)
                    viewer.scene.requestRender()

                } catch (error) {
                    console.error('마우스 이동 처리 중 오류:', error)
                }
            }, ScreenSpaceEventType.MOUSE_MOVE)

            handler.setInputAction((click: any) => {
                const state = get().getDrawingState(viewerId)
                if (!state?.isDrawing) return

                try {
                    const pickedPosition = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid)
                    if (!pickedPosition || !get().isValidCartesian3(pickedPosition)) {
                        console.warn('유효하지 않은 좌표입니다. 다른 위치를 클릭해 주세요.')
                        return
                    }

                    if (state.activeShapePoints.length === 0) {
                        state.activeShape = viewer.entities.add({
                            polygon: {
                                hierarchy: new ConstantProperty(new PolygonHierarchy([pickedPosition])),
                                material: Color.BLUE.withAlpha(0.3),
                                outline: true,
                                outlineColor: Color.BLUE,
                                height: 0,
                                // HeightReference 제거
                            },
                        })
                    }

                    // 포인트 엔티티 생성
                    const pointEntity = get().createPoint(viewer, pickedPosition, state.activePoints.length)
                    state.activePoints.push(pointEntity)
                    state.activeShapePoints.push(pickedPosition)

                    if (state.activeShape?.polygon && state.activeShapePoints.every(p => get().isValidCartesian3(p))) {
                        state.activeShape.polygon.hierarchy = new ConstantProperty(
                            new PolygonHierarchy(state.activeShapePoints)
                        )
                    }

                    set((prev) => ({
                        drawingStates: new Map(prev.drawingStates.set(viewerId, state))
                    }))
                } catch (error) {
                    console.error('점 추가 중 오류 발생:', error)
                }
            }, ScreenSpaceEventType.LEFT_CLICK)

            // 우클릭 이벤트 - 완료 (3개 이상의 점이 있을 때)
            handler.setInputAction((click: any) => {
                const state = get().getDrawingState(viewerId)
                if (!state?.isDrawing) return

                try {
                    // 우클릭 위치에서 좌표를 가져옵니다
                    const pickedPosition = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid)

                    if (state.activeShapePoints.length >= 3) {
                        // 3개 이상의 점이 있으면 완료
                        get().completeDrawing(viewer, viewerId)
                    } else if (state.activeShapePoints.length > 0 && pickedPosition && get().isValidCartesian3(pickedPosition)) {
                        // 3개 미만이면 우클릭 위치에 점을 추가하고 완료 시도
                        const pointEntity = get().createPoint(viewer, pickedPosition, state.activePoints.length)
                        state.activePoints.push(pointEntity)
                        state.activeShapePoints.push(pickedPosition)

                        if (state.activeShape?.polygon && state.activeShapePoints.every(p => get().isValidCartesian3(p))) {
                            state.activeShape.polygon.hierarchy = new ConstantProperty(
                                new PolygonHierarchy(state.activeShapePoints)
                            )
                        }

                        set((prev) => ({
                            drawingStates: new Map(prev.drawingStates.set(viewerId, state))
                        }))

                        // 3개가 되면 완료
                        if (state.activeShapePoints.length >= 3) {
                            get().completeDrawing(viewer, viewerId)
                        }
                    } else {
                        // 점이 없거나 유효하지 않은 위치면 마지막 점 제거
                        get().removeLastPoint(viewer, viewerId)
                    }
                } catch (error) {
                    console.error('우클릭 처리 중 오류:', error)
                }
            }, ScreenSpaceEventType.RIGHT_CLICK)

            // 기본 우클릭 메뉴 차단
            viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(() => {}, ScreenSpaceEventType.RIGHT_CLICK)

            set((prev) => ({
                drawingStates: new Map(prev.drawingStates.set(viewerId, newState))
            }))
        } catch (error) {
            console.error('그리기 시작 중 오류 발생:', error)
            get().cancelDrawing(viewer, viewerId)
        }
    },

    removeLastPoint: (viewer: CesiumViewer, viewerId: string) => {
        const state = get().getDrawingState(viewerId)
        if (!state?.isDrawing || state.activePoints.length === 0) return

        try {
            const lastPoint = state.activePoints.pop()
            if (lastPoint && viewer.entities.contains(lastPoint)) {
                viewer.entities.remove(lastPoint)
            }

            state.activeShapePoints.pop()

            if (state.activeShape?.polygon) {
                if (state.activeShapePoints.length >= 1 && state.activeShapePoints.every(p => get().isValidCartesian3(p))) {
                    state.activeShape.polygon.hierarchy = new ConstantProperty(
                        new PolygonHierarchy(state.activeShapePoints)
                    )
                } else {
                    viewer.entities.remove(state.activeShape)
                    state.activeShape = null
                }
            }

            set((prev) => ({
                drawingStates: new Map(prev.drawingStates.set(viewerId, state))
            }))
        } catch (error) {
            console.error('마지막 점 제거 중 오류 발생:', error)
        }
    },

    completeDrawing: (viewer: CesiumViewer, viewerId: string): string | null => {
        const state = get().getDrawingState(viewerId)
        if (!state?.isDrawing || state.activeShapePoints.length < 3) {
            return null
        }

        try {
            // 모든 좌표가 유효한지 확인
            const validPoints = state.activeShapePoints.filter(point => get().isValidCartesian3(point))
            if (validPoints.length < 3) {
                console.error('유효한 좌표가 3개 미만입니다.')
                return null
            }

            const coordinates = validPoints.map((cartesian: Cartesian3) => {
                try {
                    const cartographic = Cartographic.fromCartesian(cartesian)
                    const lon = CesiumMath.toDegrees(cartographic.longitude)
                    const lat = CesiumMath.toDegrees(cartographic.latitude)
                    
                    // 좌표 유효성 재검증
                    if (!isFinite(lon) || !isFinite(lat) || Math.abs(lon) > 180 || Math.abs(lat) > 90) {
                        console.warn('변환된 좌표가 범위를 벗어남:', lon, lat)
                        return null
                    }
                    
                    return [lon, lat] as [number, number]
                } catch (error) {
                    console.error('좌표 변환 오류:', error, cartesian)
                    return null
                }
            }).filter((coord): coord is [number, number] => coord !== null)

            if (coordinates.length < 3) {
                console.error('변환된 유효한 좌표가 3개 미만입니다.')
                return null
            }

            const firstCoordinate = coordinates[0]
            if (firstCoordinate) {
                coordinates.push(firstCoordinate)
            }

            const wktString = `POLYGON ((${coordinates
                .map((coord) => `${coord[0].toFixed(6)} ${coord[1].toFixed(6)}`)
                .join(', ')})))`

            get().cleanupDrawingElements(viewer, viewerId)

            viewer.entities.add({
                name: 'Drawn Polygon',
                polygon: {
                    hierarchy: validPoints,
                    material: Color.BLUE.withAlpha(0.4),
                    outline: true,
                    outlineColor: Color.BLUE,
                    outlineWidth: 2,
                    height: 0,
                    // HeightReference 제거
                },
            })

            state.isDrawing = false
            viewer.canvas.style.cursor = 'default'

            set((prev) => ({
                drawingStates: new Map(prev.drawingStates.set(viewerId, state))
            }))

            return wktString
        } catch (error) {
            console.error('그리기 완료 중 오류 발생:', error)
            return null
        }
    },

    cancelDrawing: (viewer: CesiumViewer, viewerId: string) => {
        try {
            const state = get().getDrawingState(viewerId)
            if (!state) return

            get().cleanupDrawingElements(viewer, viewerId)

            if (state.handler && !state.handler.isDestroyed()) {
                state.handler.destroy()
                state.handler = null
            }

            const newState = createInitialDrawingState()
            viewer.canvas.style.cursor = 'default'

            set((prev) => ({
                drawingStates: new Map(prev.drawingStates.set(viewerId, newState))
            }))
        } catch (error) {
            console.error('그리기 취소 중 오류 발생:', error)
        }
    },

    displayWktPolygon: (viewer: CesiumViewer, wkt: string, options?: PolygonDisplayOptions): Entity | null => {
        try {
            const coordinates = get().parseWktToCoordinates(wkt)
            if (coordinates.length === 0) {
                console.warn('WKT에서 좌표를 추출할 수 없습니다:', wkt)
                return null
            }

            const cartesianCoords = coordinates
                .map((coord: [number, number]) => {
                    return get().safeFromDegrees(coord[0], coord[1], 0)
                })
                .filter((coord): coord is Cartesian3 => coord !== null)

            if (cartesianCoords.length === 0) {
                console.error('변환된 유효한 좌표가 없습니다.')
                return null
            }

            const entity = viewer.entities.add({
                name: options?.name || 'WKT Polygon',
                polygon: {
                    hierarchy: cartesianCoords,
                    material: options?.fillColor?.withAlpha(options.fillAlpha || 0.4) || Color.BLUE.withAlpha(0.4),
                    outline: true,
                    outlineColor: options?.outlineColor || Color.BLUE,
                    outlineWidth: 2,
                    height: options?.height || 0,
                    // HeightReference 제거
                },
            })

            return entity
        } catch (error) {
            console.error('WKT 폴리곤 표시 오류:', error)
            return null
        }
    },

    removePolygon: (viewer: CesiumViewer, entityId: string) => {
        try {
            const entity = viewer.entities.getById(entityId)
            if (entity && viewer.entities.contains(entity)) {
                viewer.entities.remove(entity)
            }
        } catch (error) {
            console.error('폴리곤 제거 중 오류 발생:', error)
        }
    },

    clearAllPolygons: (viewer: CesiumViewer) => {
        try {
            const entitiesToRemove: Entity[] = []
            viewer.entities.values.forEach((entity: Entity) => {
                if (entity.polygon) {
                    entitiesToRemove.push(entity)
                }
            })
            entitiesToRemove.forEach(entity => {
                if (viewer.entities.contains(entity)) {
                    viewer.entities.remove(entity)
                }
            })
        } catch (error) {
            console.error('모든 폴리곤 제거 중 오류 발생:', error)
        }
    },
}))