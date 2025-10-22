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

    createPoint: (viewer: CesiumViewer, worldPosition: Cartesian3, pointIndex: number): Entity => {
        return viewer.entities.add({
            position: worldPosition,
            point: {
                pixelSize: 12,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                color: Color.CYAN,
                outlineColor: Color.AQUAMARINE,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                scaleByDistance: new NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
            },
            label: {
                text: `점 ${pointIndex + 1}`,
                font: '12pt monospace',
                style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian2(0, -10),
                fillColor: Color.WHITE,
                outlineColor: Color.BLACK,
            },
        })
    },

    cleanupDrawingElements: (viewer: CesiumViewer, viewerId: string) => {
        const state = get().getDrawingState(viewerId)
        if (!state) return

        if (state.activeShape) {
            viewer.entities.remove(state.activeShape)
            state.activeShape = null
        }

        if (state.dynamicPoint) {
            viewer.entities.remove(state.dynamicPoint)
            state.dynamicPoint = null
        }

        state.activePoints.forEach((point: Entity) => {
            viewer.entities.remove(point)
        })

        state.activePoints = []
        state.activeShapePoints = []
    },

    parseWktToCoordinates: (wkt: string): [number, number][] => {
        const match = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i)
        if (!match || !match[1]) return []

        return match[1].split(',')
            .map((coord: string) => {
                const parts = coord.trim().split(/\s+/).map(Number)
                const lon = parts[0]
                const lat = parts[1]

                if (parts.length >= 2 &&
                    typeof lon === 'number' && !isNaN(lon) &&
                    typeof lat === 'number' && !isNaN(lat)) {
                    return [lon, lat] as [number, number]
                }
                return null
            })
            .filter((coord): coord is [number, number] => coord !== null)
    },

    updateDynamicPoint: (viewer: CesiumViewer, viewerId: string, position: Cartesian3) => {
        const state = get().getDrawingState(viewerId)
        if (!state?.isDrawing) return

        if (state.dynamicPoint) {
            viewer.entities.remove(state.dynamicPoint)
        }

        state.dynamicPoint = viewer.entities.add({
            position: position,
            point: {
                pixelSize: 8,
                color: Color.CYAN.withAlpha(0.7),
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        })

        set((prev) => ({
            drawingStates: new Map(prev.drawingStates.set(viewerId, state))
        }))
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
        
        const entitiesToRemove: Entity[] = []
        viewer.entities.values.forEach((entity: Entity) => {
            if (entity.name !== 'Initial Polygon') {
                entitiesToRemove.push(entity)
            }
        })
        entitiesToRemove.forEach(entity => viewer.entities.remove(entity))

        viewer.canvas.style.cursor = 'crosshair'
        
        // 초기 동적 포인트 생성
        newState.dynamicPoint = viewer.entities.add({
            position: Cartesian3.ZERO,
            point: {
                pixelSize: 8,
                color: Color.CYAN.withAlpha(0.7),
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        })

        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
        newState.handler = handler

        // 마우스 이동 이벤트
        handler.setInputAction((movement: any) => {
            const state = get().getDrawingState(viewerId)
            if (!state?.isDrawing) return

            const pickedPosition = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
            if (!pickedPosition) return

            get().updateDynamicPoint(viewer, viewerId, pickedPosition)

            if (state.activeShapePoints.length >= 2) {
                const tempPoints = [...state.activeShapePoints, pickedPosition]
                if (state.activeShape?.polygon) {
                    state.activeShape.polygon.hierarchy = new ConstantProperty(
                        new PolygonHierarchy(tempPoints)
                    )
                }
            }
        }, ScreenSpaceEventType.MOUSE_MOVE)

        // 왼쪽 클릭 이벤트
        handler.setInputAction((click: any) => {
            const state = get().getDrawingState(viewerId)
            if (!state?.isDrawing) return

            const pickedPosition = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid)
            if (!pickedPosition) return

            if (state.activeShapePoints.length === 0) {
                state.activeShape = viewer.entities.add({
                    polygon: {
                        hierarchy: new ConstantProperty(new PolygonHierarchy([pickedPosition])),
                        material: Color.CYAN.withAlpha(0.4),
                        outline: true,
                        outlineColor: Color.CYAN,
                        height: 0,
                    },
                })
            }

            // 포인트 엔티티 생성
            const pointEntity = get().createPoint(viewer, pickedPosition, state.activePoints.length)
            state.activePoints.push(pointEntity)
            state.activeShapePoints.push(pickedPosition)

            if (state.activeShape?.polygon) {
                state.activeShape.polygon.hierarchy = new ConstantProperty(
                    new PolygonHierarchy(state.activeShapePoints)
                )
            }

            set((prev) => ({
                drawingStates: new Map(prev.drawingStates.set(viewerId, state))
            }))
        }, ScreenSpaceEventType.LEFT_CLICK)

        handler.setInputAction(() => {
            get().completeDrawing(viewer, viewerId)
        }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

        handler.setInputAction(() => {
            get().removeLastPoint(viewer, viewerId)
        }, ScreenSpaceEventType.RIGHT_CLICK)

        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(() => {}, ScreenSpaceEventType.RIGHT_CLICK)

        set((prev) => ({
            drawingStates: new Map(prev.drawingStates.set(viewerId, newState))
        }))
    },

    removeLastPoint: (viewer: CesiumViewer, viewerId: string) => {
        const state = get().getDrawingState(viewerId)
        if (!state?.isDrawing || state.activePoints.length === 0) return

        const lastPoint = state.activePoints.pop()
        if (lastPoint) {
            viewer.entities.remove(lastPoint)
        }

        state.activeShapePoints.pop()

        if (state.activeShape?.polygon) {
            if (state.activeShapePoints.length >= 3) {
                state.activeShape.polygon.hierarchy = new ConstantProperty(
                    new PolygonHierarchy(state.activeShapePoints)
                )
            } else if (state.activeShapePoints.length === 0) {
                viewer.entities.remove(state.activeShape)
                state.activeShape = null
            }
        }

        set((prev) => ({
            drawingStates: new Map(prev.drawingStates.set(viewerId, state))
        }))
    },

    completeDrawing: (viewer: CesiumViewer, viewerId: string): string | null => {
        const state = get().getDrawingState(viewerId)
        if (!state?.isDrawing || state.activeShapePoints.length < 3) {
            return null
        }

        const coordinates = state.activeShapePoints.map((cartesian: Cartesian3) => {
            const cartographic = Cartographic.fromCartesian(cartesian)
            return [
                CesiumMath.toDegrees(cartographic.longitude),
                CesiumMath.toDegrees(cartographic.latitude)
            ]
        })

        const firstCoordinate = coordinates[0]
        if (firstCoordinate) {
            coordinates.push(firstCoordinate)
        }

        const wktString = `POLYGON ((${coordinates
            .filter((coord): coord is [number, number] => coord !== undefined && coord.length === 2)
            .map((coord) => `${coord[0].toFixed(6)} ${coord[1].toFixed(6)}`)
            .join(', ')})))`

        get().cleanupDrawingElements(viewer, viewerId)

        viewer.entities.add({
            name: 'Drawn Polygon',
            polygon: {
                hierarchy: state.activeShapePoints,
                material: Color.BLUE.withAlpha(0.4),
                outline: true,
                outlineColor: Color.BLUE,
                height: 0,
            },
        })

        state.isDrawing = false
        viewer.canvas.style.cursor = 'default'

        set((prev) => ({
            drawingStates: new Map(prev.drawingStates.set(viewerId, state))
        }))

        return wktString
    },

    cancelDrawing: (viewer: CesiumViewer, viewerId: string) => {
        const state = get().getDrawingState(viewerId)
        if (!state) return

        get().cleanupDrawingElements(viewer, viewerId)

        if (state.handler) {
            state.handler.destroy()
            state.handler = null
        }

        const newState = createInitialDrawingState()
        viewer.canvas.style.cursor = 'default'

        set((prev) => ({
            drawingStates: new Map(prev.drawingStates.set(viewerId, newState))
        }))
    },

    displayWktPolygon: (viewer: CesiumViewer, wkt: string, options?: PolygonDisplayOptions): Entity | null => {
        try {
            const coordinates = get().parseWktToCoordinates(wkt)
            if (coordinates.length === 0) return null

            const cartesianCoords = coordinates
                .filter((coord: [number, number]): coord is [number, number] =>
                    coord.length === 2 &&
                    typeof coord[0] === 'number' &&
                    typeof coord[1] === 'number'
                )
                .map((coord: [number, number]) => Cartesian3.fromDegrees(coord[0], coord[1]))

            if (cartesianCoords.length === 0) return null

            const entity = viewer.entities.add({
                name: options?.name || 'WKT Polygon',
                polygon: {
                    hierarchy: cartesianCoords,
                    material: options?.fillColor?.withAlpha(options.fillAlpha || 0.4) || Color.BLUE.withAlpha(0.4),
                    outline: true,
                    outlineColor: options?.outlineColor || Color.BLUE,
                    height: options?.height || 0,
                },
            })

            return entity
        } catch (error) {
            console.error('WKT 폴리곤 표시 오류:', error)
            return null
        }
    },

    removePolygon: (viewer: CesiumViewer, entityId: string) => {
        const entity = viewer.entities.getById(entityId)
        if (entity) {
            viewer.entities.remove(entity)
        }
    },

    clearAllPolygons: (viewer: CesiumViewer) => {
        const entitiesToRemove: Entity[] = []
        viewer.entities.values.forEach((entity: Entity) => {
            if (entity.polygon) {
                entitiesToRemove.push(entity)
            }
        })
        entitiesToRemove.forEach(entity => viewer.entities.remove(entity))
    },
}))