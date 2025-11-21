import { useTrackingStore } from '../../stores/useTrackingStore'
import { Card, CardHeader, CardTitle, CardContent } from '@plug-atlas/ui'
import { User, Car, PawPrint } from 'lucide-react'

export function OverviewPanel() {
  const objects = useTrackingStore((state) => state.objects)

  // 객체 타입별 카운트
  const counts = {
    person: 0,
    vehicle: 0,
    wildlife: 0,
  }

  objects.forEach((obj) => {
    const type = obj.type as string
    if (type === 'person') counts.person++
    else if (type === 'vehicle' || type === 'car') counts.vehicle++
    else if (type === 'wildlife') counts.wildlife++
  })

  const total = counts.person + counts.vehicle + counts.wildlife

  return (
    <Card className="h-full flex flex-col bg-[#181A1D]/80 backdrop-blur-md border-slate-600/30 rounded-[12px]">
      <CardHeader className="py-2 border-b border-slate-600/20 text-center">
        <CardTitle className="text-sm font-semibold text-white">종합상황</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-3 space-y-3">

        {/* 총 탐지 객체 */}
        <div className="text-xs text-right text-white/40">
          총 탐지 객체 : <span className="text-white/40">{total}</span>
        </div>
        {/* 객체 카운트 */}
        <div className="grid grid-cols-3 gap-2">
          {/* 사람 - 이벤트 로그와 동일한 색상 */}
          <div className="bg-[#E8A500] rounded-lg p-2 text-center">
            <User className="h-5 w-5 mx-auto mb-1 text-white" />
            <div className="text-xs text-white/90">사람</div>
            <div className="text-lg font-bold text-white">{String(counts.person).padStart(2, '0')}</div>
          </div>

          {/* 자동차 - 이벤트 로그와 동일한 색상 */}
          <div className="bg-[#C83C3C] rounded-lg p-2 text-center">
            <Car className="h-5 w-5 mx-auto mb-1 text-white" />
            <div className="text-xs text-white/90">자동차</div>
            <div className="text-lg font-bold text-white">{String(counts.vehicle).padStart(2, '0')}</div>
          </div>

          {/* 야생동물 - 이벤트 로그와 동일한 색상 */}
          <div className="bg-[#4A90B8] rounded-lg p-2 text-center">
            <PawPrint className="h-5 w-5 mx-auto mb-1 text-white" />
            <div className="text-xs text-white/90">야생동물</div>
            <div className="text-lg font-bold text-white">{String(counts.wildlife).padStart(2, '0')}</div>
          </div>
        </div>

        {/* CPU 사용량 */}
        {/* <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/80">CPU 사용량</span>
            <span className="text-white font-bold">%</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/80">네트워크</span>
          <span className="text-green-400 font-semibold">정상</span>
        </div> */}
      </CardContent>
    </Card>
  )
}
