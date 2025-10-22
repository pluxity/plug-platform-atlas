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
  image?: string
  width?: number
  heightValue?: number
  label?: string
  labelColor?: string
}

export const DEFAULT_CAMERA_POSITION: CameraPosition = {
  lon: 127.1114,
  lat: 37.3948,
  height: 3000,
  pitch: -35,
  heading: 0,
}
