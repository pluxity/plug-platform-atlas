import type { Meta, StoryObj } from '@storybook/react'
import { Combobox } from './combobox.component'
import { useState } from 'react'

const meta: Meta<typeof Combobox> = {
  title: 'Organisms/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '검색 가능한 드롭다운 컴보박스 컴포넌트입니다. Select와 Input을 결합한 형태로 많은 옵션에서 빠르게 검색하고 선택할 수 있습니다.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: '선택 전 표시되는 플레이스홀더',
    },
    searchPlaceholder: {
      control: 'text',
      description: '검색 입력 필드의 플레이스홀더',
    },
    emptyText: {
      control: 'text',
      description: '검색 결과가 없을 때 표시되는 텍스트',
    },
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'ember', label: 'Ember' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="w-[300px]">
        <Combobox
          options={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="프레임워크를 선택하세요..."
          searchPlaceholder="프레임워크 검색..."
          emptyText="검색 결과가 없습니다."
          className="w-full"
        />
        {value && (
          <p className="mt-4 text-sm text-muted-foreground">
            선택된 값: <strong>{value}</strong>
          </p>
        )}
      </div>
    )
  },
}

const countries = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'gb', label: '영국' },
  { value: 'fr', label: '프랑스' },
  { value: 'de', label: '독일' },
  { value: 'it', label: '이탈리아' },
  { value: 'es', label: '스페인' },
  { value: 'ca', label: '캐나다' },
]

export const Countries: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="w-[300px]">
        <Combobox
          options={countries}
          value={value}
          onValueChange={setValue}
          placeholder="국가를 선택하세요..."
          searchPlaceholder="국가 검색..."
          emptyText="해당하는 국가가 없습니다."
          className="w-full"
        />
      </div>
    )
  },
}

const statusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'pending', label: '대기 중' },
  { value: 'archived', label: '보관됨' },
]

export const Status: Story = {
  render: () => {
    const [value, setValue] = useState('active')

    return (
      <div className="w-[300px]">
        <Combobox
          options={statusOptions}
          value={value}
          onValueChange={setValue}
          placeholder="상태 선택..."
          searchPlaceholder="상태 검색..."
          emptyText="상태를 찾을 수 없습니다."
          className="w-full"
        />
      </div>
    )
  },
}

const cities = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'incheon', label: '인천' },
  { value: 'daegu', label: '대구' },
  { value: 'daejeon', label: '대전' },
  { value: 'gwangju', label: '광주' },
  { value: 'ulsan', label: '울산' },
  { value: 'sejong', label: '세종' },
  { value: 'suwon', label: '수원' },
  { value: 'changwon', label: '창원' },
  { value: 'goyang', label: '고양' },
  { value: 'yongin', label: '용인' },
  { value: 'seongnam', label: '성남' },
  { value: 'cheongju', label: '청주' },
  { value: 'jeonju', label: '전주' },
]

export const LargeList: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="w-[300px] space-y-4">
        <p className="text-sm text-muted-foreground">
          많은 옵션에서 검색하여 선택할 수 있습니다
        </p>
        <Combobox
          options={cities}
          value={value}
          onValueChange={setValue}
          placeholder="도시를 선택하세요..."
          searchPlaceholder="도시 이름 입력..."
          emptyText="해당하는 도시가 없습니다."
          className="w-full"
        />
      </div>
    )
  },
}

export const CustomWidth: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">좁은 너비 (150px)</p>
          <Combobox
            options={frameworks}
            value={value}
            onValueChange={setValue}
            placeholder="선택..."
            searchPlaceholder="검색..."
            emptyText="없음"
            className="w-[150px]"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">기본 너비 (200px)</p>
          <Combobox
            options={frameworks}
            value={value}
            onValueChange={setValue}
            placeholder="선택..."
            searchPlaceholder="검색..."
            emptyText="없음"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">넓은 너비 (400px)</p>
          <Combobox
            options={frameworks}
            value={value}
            onValueChange={setValue}
            placeholder="선택..."
            searchPlaceholder="검색..."
            emptyText="없음"
            className="w-[400px]"
          />
        </div>
      </div>
    )
  },
}

const deviceTypes = [
  { value: 'sensor', label: '센서' },
  { value: 'camera', label: '카메라' },
  { value: 'controller', label: '제어기' },
  { value: 'gateway', label: '게이트웨이' },
  { value: 'actuator', label: '액추에이터' },
]

export const DeviceSelector: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="w-[300px] space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">장치 유형</label>
          <Combobox
            options={deviceTypes}
            value={value}
            onValueChange={setValue}
            placeholder="장치 유형을 선택하세요..."
            searchPlaceholder="장치 유형 검색..."
            emptyText="해당하는 장치 유형이 없습니다."
            className="w-full"
          />
        </div>
        {value && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm font-medium">선택된 장치 유형:</p>
            <p className="text-sm text-muted-foreground mt-1">
              {deviceTypes.find(d => d.value === value)?.label}
            </p>
          </div>
        )}
      </div>
    )
  },
}