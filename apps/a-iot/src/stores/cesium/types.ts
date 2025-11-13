import { HeightReference } from 'cesium'

export interface CameraPosition {
  lon: number
  lat: number
  height: number
  heading?: number
  pitch?: number
  roll?: number
}

export interface MarkerOptions {
  id: string
  lon: number
  lat: number
  height?: number
  heightReference?: HeightReference
  image?: string
  width?: number
  heightValue?: number
  label?: string
  labelColor?: string
  disableDepthTest?: boolean
  disableScaleByDistance?: boolean
}

export const DEFAULT_CAMERA_POSITION: CameraPosition = {
  lon: 127.114416,
  lat: 37.294320,
  height: 13139,
  pitch: -52.6,
  heading: 3.2,
  roll: 0.0,
}
