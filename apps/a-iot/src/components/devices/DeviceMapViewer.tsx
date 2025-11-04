import { useEffect, useRef, useState } from 'react'
import { toast, Spinner, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@plug-atlas/ui'
import {
    useViewerStore,
    useCameraStore,
    usePolygonStore,
    useMarkerStore,
} from '../../stores/cesium'
import { Viewer as CesiumViewer, Color } from 'cesium'
import type { FeatureResponse } from '@plug-atlas/web-core'

interface DeviceMapViewerProps {
    device: FeatureResponse | null
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const MapContent = ({ device }: { device: FeatureResponse }) => {
    const cesiumContainerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<CesiumViewer | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const { createViewer, setupImagery } = useViewerStore()
    const { focusOn } = useCameraStore()
    const { displayWktPolygon } = usePolygonStore()
    const { addMarker } = useMarkerStore()

    useEffect(() => {
        if (!cesiumContainerRef.current) return
        if (viewerRef.current && !viewerRef.current.isDestroyed()) return

        let mounted = true

        const initViewer = async () => {
            try {                
                setIsLoading(true);

                const viewer = createViewer(cesiumContainerRef.current!)
                
                if (!mounted) {
                    viewer.destroy()
                    return
                }
                
                viewerRef.current = viewer
                
                await setupImagery(viewer)
                
                if (!mounted) return
                
                const siteLocation = device.siteResponse?.location;

                if (siteLocation?.trim()) {
                    displayWktPolygon(viewer, siteLocation)
                    focusOn(viewer, siteLocation, 1500)
                } else if (device.longitude && device.latitude) {
                    focusOn(viewer, { lon: device.longitude, lat: device.latitude }, 1000)
                }
                
                if (device.longitude && device.latitude) {
                    addMarker(viewer, {
                        id: `device-${device.id}`,
                        lon: device.longitude,
                        lat: device.latitude,
                        label: device.name,
                        labelColor: Color.WHITE.toString(),
                    })
                }
                
                setIsLoading(false)
            } catch (error) {
                if (mounted) {
                    toast.error('지도를 로드하는 중 오류가 발생했습니다.')
                    setIsLoading(false)
                }
            }
        }

        initViewer()

        return () => {
            mounted = false
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy()
                viewerRef.current = null
            }
        }
    }, [device.id])

    return (
        <div className="relative w-full h-[500px]">
            <div
                ref={cesiumContainerRef}
                className="w-full h-full border rounded-lg overflow-hidden shadow-sm"
            />

            {isLoading && (
                <div className="absolute inset-0 bg-gray-100/80 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <Spinner />
                        <span className="text-sm text-gray-600 block">지도 로딩 중...</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function DeviceMapViewer({ 
    device, 
    open,
    onOpenChange
}: DeviceMapViewerProps) {
    if (!device) return null

    if (open !== undefined && onOpenChange) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{device.name}</DialogTitle>
                        <DialogDescription>확대 축소만 가능합니다. 마우스 휠을 사용하세요.</DialogDescription>
                    </DialogHeader>
                    <MapContent device={device} />
                </DialogContent>
            </Dialog>
        )
    }
}