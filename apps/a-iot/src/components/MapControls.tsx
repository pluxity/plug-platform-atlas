import { Viewer as CesiumViewer } from 'cesium'
import { Plus, Minus, Home, Layers } from 'lucide-react'
import { Button } from '@plug-atlas/ui'
import { useCameraStore, type CameraPosition } from '../stores/cesium'
import { useState } from 'react'

interface MapControlsProps {
  viewer: CesiumViewer | null
  homePosition?: CameraPosition
  onToggleSeongnamTileset?: (visible: boolean) => void
  className?: string
}

export default function MapControls({ viewer, homePosition, onToggleSeongnamTileset, className = '' }: MapControlsProps) {
  const { flyToPosition } = useCameraStore()
  const [seongnamVisible, setSeongnamVisible] = useState(false) // 기본값 off

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

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        type="button"
        onClick={zoomIn}
        variant="outline"
        size="icon"
        title="확대"
      >
        <Plus />
      </Button>

      <Button
        type="button"
        onClick={zoomOut}
        variant="outline"
        size="icon"
        title="축소"
      >
        <Minus />
      </Button>

      {homePosition && (
        <Button
          type="button"
          onClick={goHome}
          variant="outline"
          size="icon"
          title="홈으로"
        >
          <Home />
        </Button>
      )}

      <Button
        type="button"
        onClick={toggle3DLayers}
        variant="outline"
        size="icon"
        title="3D 레이어"
        className={seongnamVisible ? 'bg-blue-100 border-blue-300' : ''}
      >
        <Layers className={seongnamVisible ? 'text-blue-600' : ''} />
      </Button>
    </div>
  )
}
