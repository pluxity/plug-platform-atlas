import { useEffect, useRef, useState } from 'react'
import { Button } from '@plug-atlas/ui'
import { toast } from 'sonner'
import {
    useViewerStore,
    usePolygonStore,
    useCameraStore,
    DEFAULT_CAMERA_POSITION
} from '../../../../../stores/cesium'
import {Cartesian3, Color, Viewer as CesiumViewer} from 'cesium'

interface CesiumPolygonDrawerProps {
    onPolygonComplete: (wktString: string) => void
    initialWkt?: string
}

export default function CesiumPolygonDrawer({
                                                onPolygonComplete,
                                                initialWkt
                                            }: CesiumPolygonDrawerProps) {
    const cesiumContainerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<CesiumViewer | null>(null)
    const [showHelp, setShowHelp] = useState(true)

    const viewerId = useRef(`polygon-drawer-${Date.now()}`).current

    const { createViewer, setupCesiumResources } = useViewerStore()
    const { setView } = useCameraStore()
    const {
        startDrawing,
        completeDrawing,
        cancelDrawing,
        removeLastPoint,
        displayWktPolygon,
        clearAllPolygons,
        isDrawingActive,
        getPointCount,
    } = usePolygonStore()

    const isDrawing = isDrawingActive(viewerId)
    const pointCount = getPointCount(viewerId)
    const canComplete = pointCount >= 3

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isDrawing || !viewerRef.current) return

            switch (event.key) {
                case 'Escape':
                    event.preventDefault()
                    handleCancelDrawing()
                    break
                case 'Enter':
                    event.preventDefault()
                    if (canComplete) {
                        handleCompleteDrawing()
                    }
                    break
                case 'Backspace':
                    event.preventDefault()
                    handleRemoveLastPoint()
                    break
                case 'h':
                case 'H':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault()
                        setShowHelp(prev => !prev)
                    }
                    break
            }
        }

        if (isDrawing) {
            document.addEventListener('keydown', handleKeyPress)
            return () => document.removeEventListener('keydown', handleKeyPress)
        }
    }, [isDrawing, canComplete])

    useEffect(() => {
        if (!cesiumContainerRef.current) return

        const initViewer = async () => {
            try {
                const viewer = createViewer(cesiumContainerRef.current!)
                viewerRef.current = viewer

                setView(viewer, DEFAULT_CAMERA_POSITION)

                await setupCesiumResources(viewer)

                if (initialWkt && initialWkt.trim()) {
                    displayWktPolygon(viewer, initialWkt, {
                        name: 'Initial Polygon',
                        fillColor: Color.BLUE,
                        fillAlpha: 0.4,
                    })

                    focusOnWktPolygon(viewer, initialWkt)
                }
            } catch (error) {
                console.error('세슘 뷰어 초기화 오류:', error)
                toast.error('지도를 로드하는 중 오류가 발생했습니다.')
            }
        }

        initViewer()

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                cancelDrawing(viewerRef.current, viewerId)
                viewerRef.current.destroy()
            }
        }
    }, [initialWkt])


    const focusOnWktPolygon = async (viewer: CesiumViewer, wkt: string) => {
        try {
            const match = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i)
            if (!match || !match[1]) {
                console.warn('유효하지 않은 WKT 형식입니다.')
                return
            }

            const coordinates = match[1].split(',')
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

            if (coordinates.length === 0) {
                console.warn('좌표를 추출할 수 없습니다.')
                return
            }

            let centerLon = 0
            let centerLat = 0

            coordinates.forEach(([lon, lat]) => {
                centerLon += lon
                centerLat += lat
            })

            centerLon /= coordinates.length
            centerLat /= coordinates.length

            const lons = coordinates.map(coord => coord[0])
            const lats = coordinates.map(coord => coord[1])

            const minLon = Math.min(...lons)
            const maxLon = Math.max(...lons)
            const minLat = Math.min(...lats)
            const maxLat = Math.max(...lats)

            const lonDiff = maxLon - minLon
            const latDiff = maxLat - minLat
            const maxDiff = Math.max(lonDiff, latDiff)

            let cameraHeight = 1000
            if (maxDiff < 0.001) {
                cameraHeight = 500
            } else if (maxDiff < 0.01) {
                cameraHeight = 2000
            } else if (maxDiff < 0.1) {
                cameraHeight = 10000
            } else {
                cameraHeight = 20000
            }

            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
                orientation: {
                    heading: 0,
                    pitch: -Math.PI / 4,
                    roll: 0
                },
                duration: 2.0,
                complete: () => {
                    console.log('폴리곤 중심으로 카메라 이동 완료')
                }
            })

        } catch (error) {
            console.error('카메라 포커스 오류:', error)
        }
    }

    const handleStartDrawing = () => {
        if (!viewerRef.current) return
        startDrawing(viewerRef.current, viewerId)
    }

    const handleCompleteDrawing = () => {
        if (!viewerRef.current) return

        const wktString = completeDrawing(viewerRef.current, viewerId)
        if (wktString) {
            onPolygonComplete(wktString)
            toast.success('폴리곤이 성공적으로 생성되었습니다!')
        } else {
            toast.warning('폴리곤을 완성하려면 최소 3개의 점이 필요합니다.')
        }
    }

    const handleCancelDrawing = () => {
        if (!viewerRef.current) return
        cancelDrawing(viewerRef.current, viewerId)
    }

    const handleRemoveLastPoint = () => {
        if (!viewerRef.current) return
        removeLastPoint(viewerRef.current, viewerId)
    }

    const handleClearAll = () => {
        if (!viewerRef.current) return
        clearAllPolygons(viewerRef.current)
        onPolygonComplete('')
        toast.info('모든 폴리곤이 제거되었습니다.')
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap items-center">
                <Button
                    onClick={handleStartDrawing}
                    disabled={isDrawing}
                    variant={isDrawing ? 'secondary' : 'default'}
                    className={isDrawing ? 'animate-pulse' : ''}
                    size="sm"
                >
                    {isDrawing ? '그리는 중...' : '폴리곤 그리기 시작'}
                </Button>

                {isDrawing && (
                    <>
                        <Button
                            onClick={handleCompleteDrawing}
                            disabled={!canComplete}
                            variant={canComplete ? 'default' : 'outline'}
                            size="sm"
                            className={canComplete ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                        >
                            그리기 완료 {canComplete && '(Enter)'}
                        </Button>
                        <Button
                            onClick={handleRemoveLastPoint}
                            disabled={pointCount === 0}
                            variant="outline"
                            size="sm"
                        >
                            실행 취소 (Backspace)
                        </Button>
                        <Button
                            onClick={handleCancelDrawing}
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
                        onClick={handleClearAll}
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
                현재 점 개수: <span className="text-lg">{pointCount}</span>개
              </span>
                            {canComplete && (
                                <span className="text-green-600 font-medium animate-pulse">
                  ✓ 완료 가능
                </span>
                            )}
                            {!canComplete && pointCount > 0 && (
                                <span className="text-orange-600 font-medium">
                  {3 - pointCount}개 더 필요
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
    )
}