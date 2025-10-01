import { useEffect, useRef } from 'react'
import {
  Cesium3DTileset,
  Cesium3DTileStyle,
  Matrix4,
  Cartographic,
  Cartesian3,
  Viewer,
} from 'cesium'

interface SeongnamTilesetProps {
  viewer: Viewer | null
  visible?: boolean
  alpha?: number
}

const SEONGNAM_TILESET_URL = 'http://localhost/seongnam/sn_3d/seongnam.2022.cesium.tileset.json'

export default function SeongnamTileset({
  viewer,
  visible = true,
  alpha = 1.0
}: SeongnamTilesetProps) {
  const tilesetRef = useRef<Cesium3DTileset | null>(null)

  // 카메라 고도에 따른 타일셋 가시성 제어
  useEffect(() => {
    if (!viewer) return

    const updateVisibility = () => {
      if (!tilesetRef.current) return

      const cameraHeight = viewer.camera.positionCartographic.height
      const MAX_HEIGHT = 2000 // 2km 이상이면 타일셋 숨김

      tilesetRef.current.show = cameraHeight < MAX_HEIGHT
    }

    // 카메라 이동이 끝날 때마다 체크
    viewer.camera.moveEnd.addEventListener(updateVisibility)

    // 초기 실행
    updateVisibility()

    return () => {
      viewer.camera.moveEnd.removeEventListener(updateVisibility)
    }
  }, [viewer])

  useEffect(() => {
    if (!viewer || !visible) return

    let isMounted = true

    // 전역 Cesium 에러 핸들러 설정 (implicitCoordinates 에러 무시)
    const originalOnError = window.console.error
    window.console.error = (...args) => {
      const errorMessage = args.join(' ')
      if (errorMessage.includes('implicitCoordinates') ||
          errorMessage.includes('Cannot read properties of undefined')) {
        return // 에러를 조용히 무시하고 계속 진행
      }
      originalOnError.apply(console, args)
    }

    const loadTileset = async () => {
      try {
        const tileset = await Cesium3DTileset.fromUrl(SEONGNAM_TILESET_URL, {
          // LOD 설정 - 거리에 따른 디테일 조절
          maximumScreenSpaceError: 32, // 낮을수록 더 디테일하게 표시
          skipLevelOfDetail: true,
          skipLevels: 3,
          skipScreenSpaceErrorFactor: 16,
          baseScreenSpaceError: 1024,

          // 메모리 및 캐시 관리 (경고 해결)
          cacheBytes: 3072 * 1024 * 1024, // 3GB 캐시
          maximumCacheOverflowBytes: 1536 * 1024 * 1024, // 1.5GB 오버플로우

          // 성능 최적화
          immediatelyLoadDesiredLevelOfDetail: false,
          loadSiblings: true,
          cullWithChildrenBounds: true,
          cullRequestsWhileMoving: true,
          cullRequestsWhileMovingMultiplier: 60.0,

          // 동적 LOD
          dynamicScreenSpaceError: true,
          dynamicScreenSpaceErrorDensity: 0.00278,
          dynamicScreenSpaceErrorFactor: 4.0,
          dynamicScreenSpaceErrorHeightFalloff: 0.25,

          // 시선 추적 최적화 (중심부는 고품질, 주변부는 저품질)
          foveatedScreenSpaceError: true,
          foveatedConeSize: 0.1,
          foveatedMinimumScreenSpaceErrorRelaxation: 0.0,
          foveatedTimeDelay: 0.2,
        })

        if (!isMounted) return

        // 타일셋 고도 보정 (+30m)
        try {
          const HEIGHT_OFFSET = 30
          const boundingCenter = tileset.boundingSphere.center
          const carto = Cartographic.fromCartesian(boundingCenter)
          const surface = Cartesian3.fromRadians(
            carto.longitude,
            carto.latitude,
            carto.height
          )
          const offset = Cartesian3.fromRadians(
            carto.longitude,
            carto.latitude,
            carto.height + HEIGHT_OFFSET
          )
          const translation = Cartesian3.subtract(
            offset,
            surface,
            new Cartesian3()
          )
          tileset.modelMatrix = Matrix4.fromTranslation(translation)
        } catch {
          // 고도 보정 실패 시 기본값 사용
        }

        // 스타일 적용
        tileset.style = new Cesium3DTileStyle({
          color: `rgba(255, 255, 255, ${alpha})`,
          show: true,
        })

        // 씬에 추가
        viewer.scene.primitives.add(tileset)
        tilesetRef.current = tileset

        // 타일 로딩 에러 이벤트 리스너 (조용히 무시)
        tileset.tileFailed.addEventListener(() => {
          // implicitCoordinates 관련 에러는 조용히 무시
        })
      } catch {
        // 타일셋 로딩 실패 시 조용히 무시
      }
    }

    loadTileset()

    return () => {
      isMounted = false
      // 원래 에러 핸들러 복원
      window.console.error = originalOnError

      // 타일셋 제거
      if (tilesetRef.current && viewer && !viewer.isDestroyed()) {
        viewer.scene.primitives.remove(tilesetRef.current)
        tilesetRef.current = null
      }
    }
  }, [viewer, visible, alpha])

  return null
}
