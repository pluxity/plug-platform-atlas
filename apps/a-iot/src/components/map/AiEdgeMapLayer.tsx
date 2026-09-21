import { useEffect, useRef, useState } from 'react'
import { BillboardGraphics, LabelGraphics, Cartesian2, Cartesian3, Color, ConstantPositionProperty, CustomDataSource, HeightReference, LabelStyle, VerticalOrigin, type Entity, type Viewer } from 'cesium'
import { getDeviceStatus, type AiEdgeDevice } from '@/lib/ai-edge-device'

function markerImage(device: AiEdgeDevice) {
  const color = getDeviceStatus(device.status).color
  const shape = device.kind === 'CCTV'
    ? '<rect x="9" y="12" width="15" height="12" rx="2"/><path d="m24 16 6-3v10l-6-3"/>'
    : '<rect x="15" y="8" width="8" height="15" rx="4"/><path d="M11 19a8 8 0 0 0 16 0M19 27v4m-5 0h10"/>'
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="38" height="42" viewBox="0 0 38 42"><path fill="${color}" stroke="white" stroke-width="2" d="M19 1a18 18 0 0 1 18 18c0 10-18 22-18 22S1 29 1 19A18 18 0 0 1 19 1Z"/><g fill="none" stroke="white" stroke-width="2">${shape}</g></svg>`)}`
}

interface Props {
  viewer: Viewer | null
  devices: AiEdgeDevice[]
  selectedKey?: string | null
  focusRequest?: number
  onSelect?: (device: AiEdgeDevice) => void
}

/** Owns its data source: sensor/park entity cleanup never deletes AI EDGE markers. */
export default function AiEdgeMapLayer({ viewer, devices, selectedKey, focusRequest, onSelect }: Props) {
  const [layer, setLayer] = useState<CustomDataSource | null>(null)
  const current = useRef({ devices, onSelect })
  current.current = { devices, onSelect }

  useEffect(() => {
    if (!viewer || viewer.isDestroyed()) return
    const dataSource = new CustomDataSource('ai-edge-devices')
    let disposed = false
    void viewer.dataSources.add(dataSource).then(() => {
      if (disposed) {
        if (!viewer.isDestroyed()) viewer.dataSources.remove(dataSource, true)
        return
      }
      setLayer(dataSource)
      viewer.scene.requestRender()
    })
    const select = (entity: Entity | undefined) => {
      if (!entity || !dataSource.entities.contains(entity)) return
      const device = current.current.devices.find(item => item.key === entity.id)
      if (device) current.current.onSelect?.(device)
    }
    viewer.selectedEntityChanged.addEventListener(select)
    return () => {
      disposed = true
      if (!viewer.isDestroyed()) {
        viewer.selectedEntityChanged.removeEventListener(select)
        viewer.dataSources.remove(dataSource, true)
        viewer.scene.requestRender()
      }
    }
  }, [viewer])

  useEffect(() => {
    if (!viewer || viewer.isDestroyed() || !layer || !viewer.dataSources.contains(layer)) return
    const keys = new Set(devices.filter(device => device.position).map(device => device.key))
    for (const entity of [...layer.entities.values]) {
      if (!keys.has(entity.id)) layer.entities.remove(entity)
    }
    for (const device of devices) {
      if (!device.position) continue
      const entity = layer.entities.getById(device.key) ?? layer.entities.add({ id: device.key })
      entity.position = new ConstantPositionProperty(Cartesian3.fromDegrees(device.position.longitude, device.position.latitude))
      entity.billboard = new BillboardGraphics({
        image: markerImage(device), width: 22, height: 24,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        verticalOrigin: VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scale: selectedKey === device.key ? 1.25 : 1,
      })
      entity.label = new LabelGraphics({
        text: `${device.kind} · ${device.name}`, font: '13px sans-serif',
        fillColor: Color.WHITE, outlineColor: Color.BLACK, outlineWidth: 3, style: LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cartesian2(0, -34), heightReference: HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        show: selectedKey === device.key,
      })
    }
    viewer.scene.requestRender()
  }, [viewer, layer, devices, selectedKey])

  const focused = devices.find(device => device.key === selectedKey)?.position
  useEffect(() => {
    if (!viewer || viewer.isDestroyed() || !layer || !viewer.dataSources.contains(layer) || !focused) return
    viewer.camera.flyTo({ destination: Cartesian3.fromDegrees(focused.longitude, focused.latitude, 350), duration: 0.8 })
  }, [viewer, layer, focused?.longitude, focused?.latitude, selectedKey, focusRequest])

  return null
}
