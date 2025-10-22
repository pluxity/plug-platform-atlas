import { Viewer as CesiumViewer } from 'cesium'
import { Plus, Minus, Home } from 'lucide-react'
import { Button } from '@plug-atlas/ui'
import { useCameraStore, type CameraPosition } from '../stores/cesium'

interface MapControlsProps {
  viewer: CesiumViewer | null
  homePosition?: CameraPosition
  className?: string
}

export default function MapControls({ viewer, homePosition, className = '' }: MapControlsProps) {
  const { flyToPosition } = useCameraStore()

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
    </div>
  )
}
