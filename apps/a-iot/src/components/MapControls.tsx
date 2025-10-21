import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath } from 'cesium'
import { Plus, Minus, Home } from 'lucide-react'
import { Button } from '@plug-atlas/ui'

interface MapControlsProps {
  viewer: CesiumViewer | null
  homePosition?: { lon: number; lat: number; height: number }
  className?: string
}

export default function MapControls({ viewer, homePosition, className = '' }: MapControlsProps) {

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

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        homePosition.lon,
        homePosition.lat,
        homePosition.height
      ),
      orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-45),
        roll: 0,
      },
      duration: 1.0,
    })
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
