import { useState } from 'react'
import { ObjectModal, ObjectType } from './ObjectModal'

export function ObjectModalDemo() {
  const [activeModal, setActiveModal] = useState<ObjectType | null>(null)

  const personFields = [
    { label: '종류', value: '사람' },
    { label: '위도', value: '126.734086' },
    { label: '경도', value: '127.269311' },
    { label: '구역', value: 'ZONE 1' },
    { label: '성별', value: '남성' },
    { label: '나이추정', value: '20~30세' },
    { label: '상의', value: '긴소매' },
    { label: '하의', value: '반바지' },
    { label: '악세서리', value: '가방' },
  ]

  const wildlifeFields = [
    { label: '종류', value: '너구리' },
    { label: '위도', value: '126.734086' },
    { label: '경도', value: '127.269311' },
    { label: '구역', value: 'ZONE 3' },
  ]

  const vehicleFields = [
    { label: '종류', value: '차량' },
    { label: '위도', value: '126.734086' },
    { label: '경도', value: '127.269311' },
    { label: '구역', value: 'ZONE 4' },
  ]

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <button
        onClick={() => setActiveModal('person')}
        className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        사람 모달 열기
      </button>
      <button
        onClick={() => setActiveModal('wildlife')}
        className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        동물 모달 열기
      </button>
      <button
        onClick={() => setActiveModal('vehicle')}
        className="block w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        차량 모달 열기
      </button>

      <ObjectModal
        isOpen={activeModal === 'person'}
        onClose={() => setActiveModal(null)}
        type="person"
        objectId="P-006"
        imageUrl="/path-to-person-image.jpg"
        fields={personFields}
      />

      <ObjectModal
        isOpen={activeModal === 'wildlife'}
        onClose={() => setActiveModal(null)}
        type="wildlife"
        objectId="P-006"
        imageUrl="/path-to-wildlife-image.jpg"
        fields={wildlifeFields}
      />

      <ObjectModal
        isOpen={activeModal === 'vehicle'}
        onClose={() => setActiveModal(null)}
        type="vehicle"
        objectId="P-006"
        imageUrl="/path-to-vehicle-image.jpg"
        alertBanner="구역 외 침범"
        fields={vehicleFields}
      />
    </div>
  )
}
