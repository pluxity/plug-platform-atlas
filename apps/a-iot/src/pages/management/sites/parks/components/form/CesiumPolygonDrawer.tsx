import { useEffect, useRef, useState } from 'react'
import { Button } from '@plug-atlas/ui'
import { toast } from '@plug-atlas/ui'
import {
    useViewerStore,
    usePolygonStore,
    useCameraStore,
    DEFAULT_CAMERA_POSITION
} from '../../../../../stores/cesium'
import { Color, Viewer as CesiumViewer} from 'cesium'
import { MapIcon, RotateCcw, CheckCircle, X, Info } from 'lucide-react'

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
    const [showHelp, setShowHelp] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const initialWktProcessedRef = useRef<string | undefined>(undefined)

    const viewerId = useRef(`polygon-drawer-${Date.now()}`).current

    const { createViewer, initializeResources } = useViewerStore()
    const { setView, focusOn } = useCameraStore()
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
            if (!isDrawing || !viewerRef.current || !isInitialized) return

            try {
                switch (event.key) {
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
                    case 'Escape':
                        event.preventDefault()
                        handleCancelDrawing()
                        break
                }
            } catch (error) {
                console.error('키보드 이벤트 처리 중 오류:', error)
            }
        }

        if (isDrawing && isInitialized) {
            document.addEventListener('keydown', handleKeyPress)
            return () => document.removeEventListener('keydown', handleKeyPress)
        }
    }, [isDrawing, canComplete, isInitialized])

    useEffect(() => {
        if (!cesiumContainerRef.current) return

        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
            return
        }

        let mounted = true

        const initViewer = async () => {
            try {
                if (!mounted) return

                setIsInitialized(false)

                const viewer = createViewer(cesiumContainerRef.current!)

                if (!mounted) {
                    viewer.destroy()
                    return
                }

                viewerRef.current = viewer

                await initializeResources(viewer, {
                    imageryProvider: 'ion-default',
                    loadTerrain: false,
                    load3DTiles: false,
                })

                await new Promise(resolve => setTimeout(resolve, 100))

                if (!mounted) return

                setView(viewer, DEFAULT_CAMERA_POSITION)
                setIsInitialized(true)
            } catch (error) {
                if (mounted) {
                    toast.error('지도를 로드하는 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.')
                }
            }
        }

        initViewer()

        return () => {
            mounted = false
            try {
                if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                    cancelDrawing(viewerRef.current, viewerId)
                    viewerRef.current.destroy()
                    viewerRef.current = null
                }
            } catch (error) {
                console.error('뷰어 정리 중 오류:', error)
            }
            setIsInitialized(false)
        }
    }, [])

    useEffect(() => {
        if (!viewerRef.current || !isInitialized) return
        if (!initialWkt || !initialWkt.trim()) return

        if (initialWktProcessedRef.current === initialWkt) return

        try {
            clearAllPolygons(viewerRef.current)
            const entity = displayWktPolygon(viewerRef.current, initialWkt, {
                name: 'Initial Polygon',
                fillColor: Color.BLUE,
                fillAlpha: 0.4,
            })

            if (entity) {
                focusOn(viewerRef.current, initialWkt, 3000)
            }

            initialWktProcessedRef.current = initialWkt
        } catch (error) {
            console.error('초기 WKT 폴리곤 표시에 실패했습니다:', error)
            toast.error('초기 영역을 불러오는 데 실패했습니다.')
        }
    }, [initialWkt, isInitialized])

    const handleStartDrawing = () => {
        if (!viewerRef.current || !isInitialized) {
            toast.warning('지도가 아직 로드 중입니다. 잠시 후 다시 시도해 주세요.')
            return
        }
        
        try {
            startDrawing(viewerRef.current, viewerId)
            setShowHelp(true)
        } catch (error) {
            toast.error('그리기를 시작할 수 없습니다. 페이지를 새로고침해 주세요.')
        }
    }

    const handleCompleteDrawing = () => {
        if (!viewerRef.current || !isInitialized) return

        try {
            const wktString = completeDrawing(viewerRef.current, viewerId)
            if (wktString) {
                onPolygonComplete(wktString)
                toast.success('폴리곤이 성공적으로 생성되었습니다!')
                setShowHelp(false)
            } else {
                toast.warning('폴리곤을 완성하려면 최소 3개의 점이 필요합니다.')
            }
        } catch (error) {
            toast.error('폴리곤 생성 중 오류가 발생했습니다.')
        }
    }

    const handleCancelDrawing = () => {
        if (!viewerRef.current || !isInitialized) return
        
        try {
            cancelDrawing(viewerRef.current, viewerId)
            setShowHelp(false)
        } catch (error) {
            console.error('그리기 취소 오류:', error)
        }
    }

    const handleRemoveLastPoint = () => {
        if (!viewerRef.current || !isInitialized) return
        
        try {
            removeLastPoint(viewerRef.current, viewerId)
        } catch (error) {
            console.error('포인트 제거 오류:', error)
        }
    }

    const handleClearAll = () => {
        if (!viewerRef.current || !isInitialized) return

        try {
            clearAllPolygons(viewerRef.current)
            onPolygonComplete('')
            initialWktProcessedRef.current = undefined
            toast.info('모든 폴리곤이 제거되었습니다.')
        } catch (error) {
            console.error('폴리곤 제거 오류:', error)
        }
    }

    return (
        <div className="relative">
            <div className="mb-3">
                {!isDrawing ? (
                    <div className="flex gap-2 items-center">
                        <Button
                            onClick={handleStartDrawing}
                            disabled={!isInitialized}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
                            size="sm"
                        >
                            <MapIcon className="w-4 h-4 mr-2" />
                            {isInitialized ? '영역 그리기' : '지도 로딩중...'}
                        </Button>
                        <Button
                            onClick={handleClearAll}
                            disabled={!isInitialized}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
                        >
                            모두 지우기
                        </Button>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-blue-800">영역 그리는 중</span>
                                <span className="text-xs bg-blue-200 px-2 py-1 rounded-full text-blue-700">
                                    {pointCount}개 점
                                </span>
                            </div>
                            <button
                                onClick={() => setShowHelp(!showHelp)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                            >
                                <Info className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                onClick={handleCompleteDrawing}
                                disabled={!canComplete}
                                size="sm"
                                className={canComplete ? 
                                    'bg-green-600 hover:bg-green-700 text-white shadow-sm' : 
                                    'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                완료
                            </Button>
                            <Button
                                onClick={handleRemoveLastPoint}
                                disabled={pointCount === 0}
                                variant="outline"
                                size="sm"
                                className="text-orange-600 border-orange-200 hover:bg-orange-50 disabled:text-gray-400"
                            >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                실행취소
                            </Button>
                            <Button
                                onClick={handleCancelDrawing}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <X className="w-4 h-4 mr-1" />
                                취소
                            </Button>
                        </div>

                        {canComplete && (
                            <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                우클릭으로 완료하거나 '완료' 버튼을 누르세요
                            </div>
                        )}

                        {showHelp && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                                <div className="text-xs text-blue-700 space-y-1">
                                    <div className="font-semibold mb-1.5">⌨️ 키보드 단축키</div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-300 font-mono text-[10px]">Enter</kbd>
                                        <span>완료 (3개 이상의 점 필요)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-300 font-mono text-[10px]">Backspace</kbd>
                                        <span>마지막 점 제거</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-300 font-mono text-[10px]">Esc</kbd>
                                        <span>그리기 취소</span>
                                    </div>
                                    <div className="mt-1.5 pt-1.5 border-t border-blue-200">
                                        <div className="font-semibold mb-1">🖱️ 마우스 조작</div>
                                        <div>• 좌클릭: 점 추가</div>
                                        <div>• 우클릭: 그리기 완료</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div
                ref={cesiumContainerRef}
                className="w-full h-[400px] border rounded-lg overflow-hidden shadow-sm relative"
                style={{ position: 'relative' }}
                tabIndex={0}
            />

            {isDrawing && isInitialized && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700">점 {pointCount}개</span>
                        {canComplete && (
                            <span className="text-green-600 font-medium ml-2">✓ 완료 가능</span>
                        )}
                    </div>
                </div>
            )}

            {!isInitialized && (
                <div className="absolute inset-0 bg-gray-100/80 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <span className="text-sm text-gray-600">지도 로딩 중...</span>
                    </div>
                </div>
            )}
        </div>
    )
}