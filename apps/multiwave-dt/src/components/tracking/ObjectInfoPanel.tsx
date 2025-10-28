import { useEffect, useState } from 'react'
import { SceneTransforms } from 'cesium'
import * as Cesium from 'cesium'
import { useCesiumViewer } from '../../stores/useCesiumViewer'
import { useTrackingStore } from '../../stores/useTrackingStore'
import { X, User, HelpCircle } from 'lucide-react'

interface ObjectPanelPosition {
  objectId: string
  screenX: number
  screenY: number
  visible: boolean
}

export function ObjectInfoPanel() {
  const viewer = useCesiumViewer((state: any) => state.viewer)
  const objects = useTrackingStore((state: any) => state.objects)
  const pinnedObjects = useTrackingStore((state: any) => state.pinnedObjects)
  const togglePinObject = useTrackingStore((state: any) => state.togglePinObject)

  const [positions, setPositions] = useState<Map<string, ObjectPanelPosition>>(new Map())

  useEffect(() => {
    if (!viewer) return

    let animationFrameId: number
    let lastUpdateTime = 0
    const UPDATE_INTERVAL = 1000 / 30

    const updatePositions = (currentTime: number) => {
      if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
        animationFrameId = requestAnimationFrame(updatePositions)
        return
      }
      lastUpdateTime = currentTime

      const newPositions = new Map<string, ObjectPanelPosition>()

      pinnedObjects.forEach((objectId: string) => {
        const obj = objects.get(objectId)
        if (!obj) return

        try {
          const cartographic = Cesium.Cartographic.fromDegrees(
            obj.position.longitude,
            obj.position.latitude,
            obj.position.altitude ?? 0
          )

          const height = viewer.scene.globe.getHeight(cartographic)
          if (height !== undefined) {
            cartographic.height = height + (obj.position.altitude ?? 0)
          }

          const position = viewer.scene.globe.ellipsoid.cartographicToCartesian(cartographic)

          const screenPosition = SceneTransforms.worldToWindowCoordinates(viewer.scene, position)

          if (screenPosition) {
            newPositions.set(objectId, {
              objectId,
              screenX: screenPosition.x,
              screenY: screenPosition.y,
              visible: true,
            })
          } else {
            newPositions.set(objectId, {
              objectId,
              screenX: 0,
              screenY: 0,
              visible: false,
            })
          }
        } catch (error) {
          newPositions.set(objectId, {
            objectId,
            screenX: 0,
            screenY: 0,
            visible: false,
          })
        }
      })

      setPositions(newPositions)

      animationFrameId = requestAnimationFrame(updatePositions)
    }

    animationFrameId = requestAnimationFrame(updatePositions)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [viewer, objects, pinnedObjects])

  const getIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="h-4 w-4" />
      case 'wildlife':
        return <span className="text-sm">🦌</span>
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'person':
        return '사람'
      case 'wildlife':
        return '야생동물'
      default:
        return '미지정'
    }
  }

  return (
    <>
      {Array.from(positions.entries()).map(([objectId, pos]) => {
        const obj = objects.get(objectId)
        if (!obj || !pos.visible) return null

        return (
          <div key={objectId}>
            <svg
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
              }}
            >
              <line
                x1={pos.screenX}
                y1={pos.screenY}
                x2={pos.screenX}
                y2={pos.screenY - 60}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.7"
              />
              <circle
                cx={pos.screenX}
                cy={pos.screenY}
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            </svg>

            <div
              className="absolute pointer-events-auto"
              style={{
                left: `${pos.screenX}px`,
                top: `${pos.screenY}px`,
                transform: 'translate(-50%, -100%)',
                zIndex: 2,
              }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border-2 border-blue-500 min-w-[350px] mb-16">
              <div className="flex items-center justify-between p-3 border-b bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-white/20">
                    {getIcon(obj.type)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {obj.metadata?.name || obj.id.slice(0, 8)}
                    </div>
                    <div className="text-xs opacity-90">{getTypeLabel(obj.type)}</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePinObject(objectId)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative w-full aspect-video bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/-u536iqt-Pk?autoplay=1&mute=1&controls=1&modestbranding=1"
                  title="CCTV Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-none"
                />
              </div>

              <div className="p-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-600">위도</span>
                    <div className="text-gray-900 font-mono">
                      {obj.position.latitude.toFixed(6)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-600">경도</span>
                    <div className="text-gray-900 font-mono">
                      {obj.position.longitude.toFixed(6)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {obj.metadata?.speed !== undefined && obj.metadata.speed !== null && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-600">속도</span>
                      <div className="text-gray-900">{obj.metadata.speed.toFixed(1)} km/h</div>
                    </div>
                  )}
                  {obj.metadata?.direction !== undefined && obj.metadata.direction !== null && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-600">방향</span>
                      <div className="text-gray-900">{obj.metadata.direction.toFixed(1)}°</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {obj.metadata?.confidence !== undefined && obj.metadata.confidence !== null && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-600">신뢰도</span>
                      <div className="text-gray-900">
                        {(obj.metadata.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                  {obj.cameraId && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-600">카메라</span>
                      <div className="text-gray-900">{obj.cameraId}</div>
                    </div>
                  )}
                </div>

                {obj.metadata?.detection_count !== undefined && obj.metadata.detection_count !== null && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-600">감지 횟수</span>
                    <div className="text-gray-900">{obj.metadata.detection_count}</div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
