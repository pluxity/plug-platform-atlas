import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from './calendar.component'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

const meta: Meta<typeof Calendar> = {
  title: 'Organisms/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '캘린더 컴포넌트입니다. react-day-picker를 기반으로 하며 단일 날짜, 날짜 범위, 다중 날짜 선택을 지원합니다. DatePicker의 기본 컴포넌트로 사용되며 독립적으로도 사용할 수 있습니다.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'multiple', 'range'],
      description: '선택 모드',
    },
    showOutsideDays: {
      control: 'boolean',
      description: '현재 월이 아닌 날짜 표시 여부',
    },
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {
    mode: 'single',
    showOutsideDays: true,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <div className="space-y-4">
        <Calendar
          {...args}
          mode="single"
          selected={date}
          onSelect={setDate}
        />
        {date && (
          <p className="text-sm text-muted-foreground text-center">
            선택된 날짜: <strong>{date.toLocaleDateString('ko-KR')}</strong>
          </p>
        )}
      </div>
    )
  },
}

export const Single: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    )
  },
}

export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([])

    return (
      <div className="space-y-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
        />
        {dates && dates.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">선택된 날짜들:</p>
            <ul className="list-disc list-inside">
              {dates.map((date, index) => (
                <li key={index}>{date.toLocaleDateString('ko-KR')}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>(undefined)

    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
        />
        {range?.from && (
          <p className="text-sm text-muted-foreground text-center">
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

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const today = new Date()

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-2 text-center">
          과거 날짜는 선택할 수 없습니다
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: today }}
        />
      </div>
    )
  },
}

export const WithDateRange: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-2 text-center">
          오늘부터 한 달 후까지만 선택 가능
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={today}
          toDate={nextMonth}
        />
      </div>
    )
  },
}

export const WithDisabledWeekends: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-2 text-center">
          주말(토요일, 일요일)은 선택할 수 없습니다
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ dayOfWeek: [0, 6] }}
        />
      </div>
    )
  },
}

export const WithoutOutsideDays: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showOutsideDays={false}
      />
    )
  },
}

export const MultipleMonths: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>(undefined)

    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
      />
    )
  },
}

export const WithFooter: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const handleToday = () => {
      setDate(new Date())
    }

    return (
      <div className="space-y-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
        <div className="px-3 pb-3">
          <button
            onClick={handleToday}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            오늘 날짜 선택
          </button>
        </div>
      </div>
    )
  },
}