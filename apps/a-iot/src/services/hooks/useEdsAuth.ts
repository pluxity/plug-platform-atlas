import { useEffect, useRef, useState } from 'react'
import { edsLogin, edsLogout, edsKeepalive } from '@/lib/eds/eds-client'
import { useEdsStore } from '@/stores/edsStore'
import { EDS_CONFIG } from '@/constants/eds'

/**
 * EDS 인증 세션을 관리하는 훅.
 * 마운트 시 로그인, keep-alive 인터벌, 언마운트 시 로그아웃.
 */
export function useEdsAuth() {
  const { apiKey, isAuthenticated, setApiKey, clearSession } = useEdsStore()
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const apiKeyRef = useRef<string | null>(null)

  // apiKeyRef를 최신 상태로 유지
  apiKeyRef.current = apiKey

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const key = await edsLogin()
        if (cancelled) {
          // 이미 언마운트됐으면 바로 로그아웃
          await edsLogout(key).catch(() => {})
          return
        }
        setApiKey(key)
        apiKeyRef.current = key
        setIsReady(true)
        setError(null)

        // keep-alive 인터벌
        intervalRef.current = setInterval(async () => {
          const currentKey = apiKeyRef.current
          if (currentKey) {
            try {
              await edsKeepalive(currentKey)
            } catch {
              // keep-alive 실패 시 재로그인 시도
              try {
                const newKey = await edsLogin()
                setApiKey(newKey)
                apiKeyRef.current = newKey
              } catch {
                clearSession()
                setIsReady(false)
              }
            }
          }
        }, EDS_CONFIG.keepaliveIntervalMs)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'EDS 로그인 실패')
          setIsReady(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      // 로그아웃 (best-effort)
      const key = apiKeyRef.current
      if (key) {
        edsLogout(key).catch(() => {})
      }
      clearSession()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { isReady, isAuthenticated, error, apiKey }
}
