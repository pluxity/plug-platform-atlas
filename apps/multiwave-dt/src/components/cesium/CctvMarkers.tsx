import { useEffect } from 'react'
import * as Cesium from 'cesium'
import { useCesiumViewer } from '../../stores/useCesiumViewer'
import { cctvs } from '../../data/cctvs'

export function CctvMarkers() {
  const viewer = useCesiumViewer((state: any) => state.viewer)

  useEffect(() => {
    if (!viewer || viewer.isDestroyed()) return

    const billboards: Cesium.Billboard[] = []

    // CCTV 마커 이미지 로드 및 빌보드 생성
    cctvs.forEach((cctv) => {
      try {
        const billboard = viewer.entities.add({
          id: cctv.id,
          name: cctv.name,
          position: Cesium.Cartesian3.fromDegrees(
            cctv.longitude,
            cctv.latitude,
            cctv.altitude ?? 0
          ),
          billboard: {
            image: `${import.meta.env.BASE_URL}icons/cctv-marker.svg`,
            width: 48,
            height: 64,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scale: 1.0,
            // 거리에 따른 크기 조절 (near, nearValue, far, farValue)
            scaleByDistance: new Cesium.NearFarScalar(100, 1.5, 5000, 0.3),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: Cesium.HeightReference.CLAMP_TO_TERRAIN, // Terrain에 맞춤
          },
          description: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 8px 0; color: #0057FF;">${cctv.name}</h3>
              <p style="margin: 4px 0;"><strong>ID:</strong> ${cctv.id}</p>
              <p style="margin: 4px 0;"><strong>위치:</strong> ${cctv.latitude.toFixed(6)}, ${cctv.longitude.toFixed(6)}</p>
              <p style="margin: 4px 0;"><strong>상태:</strong> ${cctv.status === 'active' ? '활성' : cctv.status === 'maintenance' ? '점검중' : '비활성'}</p>
              ${cctv.description ? `<p style="margin: 8px 0 0 0;"><strong>설명:</strong> ${cctv.description}</p>` : ''}
            </div>
          `,
        })

        if (billboard.billboard) {
          billboards.push(billboard as any)
        }
      } catch (error) {
        console.error(`Failed to create CCTV marker for ${cctv.id}:`, error)
      }
    })

    // 클린업
    return () => {
      cctvs.forEach((cctv) => {
        const entity = viewer.entities.getById(cctv.id)
        if (entity) {
          viewer.entities.remove(entity)
        }
      })
    }
  }, [viewer])

  return null
}
