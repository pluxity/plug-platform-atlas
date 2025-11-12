import { Viewer as CesiumViewer } from 'cesium'
import { Map, Satellite } from 'lucide-react'
import { Button } from '@plug-atlas/ui'
import { useImageryStore, type ImageryProviderType } from '../stores/cesium'
import { useState } from 'react'

interface MapLayerSelectorProps {
  viewer: CesiumViewer | null
  className?: string
}

export default function MapLayerSelector({ viewer, className = '' }: MapLayerSelectorProps) {
  const { currentProvider, switchImageryLayer } = useImageryStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleLayerSwitch = async (providerType: ImageryProviderType) => {
    if (!viewer || viewer.isDestroyed() || currentProvider === providerType || isLoading) return

    setIsLoading(true)
    try {
      await switchImageryLayer(viewer, providerType)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        type="button"
        onClick={() => handleLayerSwitch('ion-default')}
        variant="outline"
        size="icon"
        title="기본 지도"
        disabled={isLoading}
        className={currentProvider === 'ion-default' ? 'bg-blue-100 border-blue-300' : ''}
      >
        <Map className={currentProvider === 'ion-default' ? 'text-blue-600' : ''} />
      </Button>

      <Button
        type="button"
        onClick={() => handleLayerSwitch('ion-satellite')}
        variant="outline"
        size="icon"
        title="위성 지도"
        disabled={isLoading}
        className={currentProvider === 'ion-satellite' ? 'bg-blue-100 border-blue-300' : ''}
      >
        <Satellite className={currentProvider === 'ion-satellite' ? 'text-blue-600' : ''} />
      </Button>
    </div>
  )
}
