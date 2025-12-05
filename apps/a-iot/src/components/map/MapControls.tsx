import { Viewer as CesiumViewer } from 'cesium'
import { Plus, Minus, Home, Layers, Building2 } from 'lucide-react'
import { Button } from '@plug-atlas/ui'
import { useCameraStore, type CameraPosition } from '../../stores/cesium'
import { useState } from 'react'

interface MapControlsProps {
  viewer: CesiumViewer | null
  homePosition?: CameraPosition
  onToggleSeongnamTileset?: (visible: boolean) => void
  onToggleDistrictBoundary?: (visible: boolean) => void
  className?: string
}

export default function MapControls({ viewer, homePosition, onToggleSeongnamTileset, onToggleDistrictBoundary, className = '' }: MapControlsProps) {
  const { flyToPosition } = useCameraStore()
  const [seongnamVisible, setSeongnamVisible] = useState(false)
  const [districtVisible, setDistrictVisible] = useState(true) // 행정구역 경계 기본값 ON (CesiumMap에서 초기화)

  const zoomIn = () => {
    if (!viewer || viewer.isDestroyed()) return
    const camera = viewer.camera
    const height = camera.positionCartographic.height
    camera.zoomIn(height * 0.3)
  }

  const zoomOut = () => {
    if (!viewer || viewer.isDestroyed()) return
    const camera = viewer.camera
    const height = camera.positionCartographic.height
    camera.zoomOut(height * 0.3)
  }

  const goHome = () => {
    if (!viewer || viewer.isDestroyed()) return
    if (!homePosition) return
    flyToPosition(viewer, homePosition)
  }

  const toggle3DLayers = () => {
    const newVisible = !seongnamVisible
    setSeongnamVisible(newVisible)
    onToggleSeongnamTileset?.(newVisible)
  }

  const toggleDistrictBoundary = () => {
    const newVisible = !districtVisible
    setDistrictVisible(newVisible)
    onToggleDistrictBoundary?.(newVisible)
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        type="button"
        onClick={zoomIn}
        variant="outline"
        size="icon"
        title="확대"
        className="bg-white/70 backdrop-blur-md shadow-xl hover:bg-white/80 hover:shadow-2xl transition-all"
      >
        <Plus className="text-gray-900 stroke-2 drop-shadow-sm transition-colors" />
      </Button>

      <Button
        type="button"
        onClick={zoomOut}
        variant="outline"
        size="icon"
        title="축소"
        className="bg-white/70 backdrop-blur-md shadow-xl hover:bg-white/80 hover:shadow-2xl transition-all"
      >
        <Minus className="text-gray-900 stroke-2 drop-shadow-sm transition-colors" />
      </Button>

      {homePosition && (
        <Button
          type="button"
          onClick={goHome}
          variant="outline"
          size="icon"
          title="홈으로"
          className="bg-white/70 backdrop-blur-md shadow-sm hover:bg-white/80 hover:shadow-2xl transition-all"
        >
          <Home className="text-gray-900 stroke-2 drop-shadow-sm transition-colors" />
        </Button>
      )}

      <Button
        type="button"
        onClick={toggle3DLayers}
        variant="outline"
        size="icon"
        title="3D 빌딩"
        className={`backdrop-blur-md transition-all ${
          seongnamVisible
            ? 'bg-white shadow-lg hover:shadow-xl border-blue-400'
            : 'bg-white/70 shadow-sm hover:bg-white/90 hover:shadow-lg'
        }`}
      >
        <Building2 className={`stroke-2 drop-shadow-sm transition-colors ${seongnamVisible ? 'text-blue-600' : 'text-gray-900 hover:text-gray-950'}`} />
      </Button>

      <Button
        type="button"
        onClick={toggleDistrictBoundary}
        variant="outline"
        size="icon"
        title="행정구역 경계"
        className={`backdrop-blur-md transition-all ${
          districtVisible
            ? 'bg-white shadow-lg hover:shadow-xl border-purple-400'
            : 'bg-white/70 shadow-sm hover:bg-white/90 hover:shadow-lg'
        }`}
      >
        <Layers className={`stroke-2 drop-shadow-sm transition-colors ${districtVisible ? 'text-purple-600' : 'text-gray-900 hover:text-gray-950'}`} />
      </Button>
    </div>
  )
}
