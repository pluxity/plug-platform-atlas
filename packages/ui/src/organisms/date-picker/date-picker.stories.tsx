import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from './date-picker.component'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

const meta: Meta<typeof DatePicker> = {
  title: 'Organisms/Date Picker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '날짜 선택 컴포넌트입니다. react-day-picker를 사용한 캘린더 UI를 통해 단일 날짜 또는 날짜 범위를 선택할 수 있으며 필터링, 일정 관리, 기간 설정 등에 사용됩니다. 한국어 로케일을 기본으로 지원합니다.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'range'],
      description: '날짜 선택 모드 (단일 날짜 또는 범위)',
    },
    placeholder: {
      control: 'text',
      description: '날짜가 선택되지 않았을 때 표시되는 텍스트',
    },
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
      <div className="space-y-4">
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="날짜를 선택하세요"
        />
        {date && (
          <p className="text-sm text-muted-foreground">
            선택된 날짜: <strong>{date.toLocaleDateString('ko-KR')}</strong>
          </p>
        )}
      </div>
    )
  },
}

export const WithInitialValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <div className="space-y-4">
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="날짜를 선택하세요"
        />
        {date && (
          <p className="text-sm text-muted-foreground">
            선택된 날짜: <strong>{date.toLocaleDateString('ko-KR')}</strong>
          </p>
        )}
      </div>
    )
  },
}

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
      <DatePicker
        value={date}
        onChange={setDate}
        placeholder="시작 날짜 선택"
      />
    )
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>(undefined)

    return (
      <div className="space-y-4">
        <DatePicker
          mode="range"
          value={range}
          onChange={setRange}
          placeholder="기간을 선택하세요"
        />
        {range?.from && (
          <p className="text-sm text-muted-foreground">
            선택된 기간:{' '}
            <strong>
              {range.from.toLocaleDateString('ko-KR')}
              {range.to && ` ~ ${range.to.toLocaleDateString('ko-KR')}`}
            </strong>
          </p>
        )}
      </div>
    )
  },
}

export const RangeWithRestriction: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>(undefined)
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

    return (
      <div className="space-y-4 w-[450px]">
        <div className="space-y-2">
          <label className="text-sm font-medium">예약 기간 선택</label>
          <p className="text-xs text-muted-foreground">오늘부터 다음 달까지 선택 가능</p>
          <DatePicker
            mode="range"
            value={range}
            onChange={setRange}
            placeholder="예약 기간을 선택하세요"
            fromDate={today}
            toDate={nextMonth}
            className="w-full"
          />
        </div>
        {range?.from && range?.to && (
          <div className="rounded-md bg-primary-50 border border-primary-200 p-3">
            <p className="text-sm text-primary-900">
              📅 선택된 기간: <strong>{range.from.toLocaleDateString('ko-KR')} ~ {range.to.toLocaleDateString('ko-KR')}</strong>
            </p>
          </div>
        )}
      </div>
    )
  },
}

export const InForm: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>(undefined)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (range?.from && range?.to) {
        alert(`기간: ${range.from.toLocaleDateString('ko-KR')} ~ ${range.to.toLocaleDateString('ko-KR')}`)
      } else {
        alert('기간을 선택해주세요')
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 w-[450px]">
        <div className="space-y-2">
          <label className="text-sm font-medium">조회 기간</label>
          <DatePicker
            mode="range"
            value={range}
            onChange={setRange}
            placeholder="조회할 기간을 선택하세요"
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          기간 조회
        </button>
      </form>
    )
  },
}

export const Filter: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [filterActive, setFilterActive] = useState(false)

    const handleDateChange = (newDate: Date | undefined) => {
      setDate(newDate)
      setFilterActive(!!newDate)
    }

    const clearFilter = () => {
      setDate(undefined)
      setFilterActive(false)
    }

    return (
      <div className="space-y-4 w-[350px]">
        <div className="flex items-center gap-2">
          <DatePicker
            value={date}
            onChange={handleDateChange}
            placeholder="날짜로 필터링"
            className="flex-1"
          />
          {filterActive && (
            <button
              onClick={clearFilter}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
          )}
        </div>

        {filterActive && (
          <div className="rounded-md bg-primary-50 border border-primary-200 p-3">
            <p className="text-sm text-primary-900">
              📅 <strong>{date?.toLocaleDateString('ko-KR')}</strong> 날짜로 필터링 중
            </p>
          </div>
        )}

        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            여기에 필터링된 데이터가 표시됩니다
          </p>
        </div>
      </div>
    )
  },
}

export const CustomWidth: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">좁은 너비 (200px)</p>
          <DatePicker
            value={date}
            onChange={setDate}
            placeholder="날짜 선택"
            className="w-[200px]"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">기본 너비 (280px)</p>
          <DatePicker
            value={date}
            onChange={setDate}
            placeholder="날짜 선택"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">전체 너비</p>
          <DatePicker
            value={date}
            onChange={setDate}
            placeholder="날짜 선택"
            className="w-full"
          />
        </div>
      </div>
    )
  },
}

export const Appointment: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [confirmed, setConfirmed] = useState(false)

    const handleConfirm = () => {
      if (selectedDate) {
        setConfirmed(true)
        setTimeout(() => setConfirmed(false), 3000)
      }
    }

    return (
      <div className="w-[350px] space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">예약 날짜 선택</h3>
          <p className="text-sm text-muted-foreground">
            원하시는 날짜를 선택해주세요
          </p>
        </div>

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="예약 날짜 선택"
          className="w-full"
        />

        {selectedDate && (
          <div className="rounded-md border p-4 space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">선택한 날짜:</span>{' '}
              <span className="font-medium">{selectedDate.toLocaleDateString('ko-KR')}</span>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700 transition-colors"
            >
              예약 확정
            </button>
          </div>
        )}

        {confirmed && (
          <div className="rounded-md bg-success-50 border border-success-200 p-3">
            <p className="text-sm text-success-900">
              ✅ 예약이 확정되었습니다!
            </p>
          </div>
        )}
      </div>
    )
  },
}