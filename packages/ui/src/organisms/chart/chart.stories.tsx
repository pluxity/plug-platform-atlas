import type { Meta, StoryObj } from '@storybook/react'
import { Chart, ChartContainer } from './chart.component'

const meta: Meta<typeof Chart> = {
  title: 'Organisms/Chart',
  component: Chart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '차트 시각화 컴포넌트입니다. 다양한 차트 타입(Line, Bar, Pie, Area)을 지원하며 데이터 시각화에 사용됩니다. (현재 기본 구현, Chart.js/Recharts 통합 예정)',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'bar', 'pie', 'area'],
      description: '차트 타입',
    },
  },
}

export default meta
type Story = StoryObj<typeof Chart>

const sampleData = [
  { name: '1월', value: 30 },
  { name: '2월', value: 45 },
  { name: '3월', value: 35 },
  { name: '4월', value: 55 },
  { name: '5월', value: 48 },
  { name: '6월', value: 60 },
]

export const Default: Story = {
  args: {
    data: sampleData,
    type: 'line',
  },
}

export const LineChart: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">월별 사용자 수</h3>
      <Chart data={sampleData} type="line" />
    </div>
  ),
}

export const BarChart: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">월별 매출</h3>
      <Chart
        data={[
          { name: '1월', value: 4500 },
          { name: '2월', value: 5200 },
          { name: '3월', value: 4800 },
          { name: '4월', value: 6100 },
          { name: '5월', value: 5900 },
          { name: '6월', value: 7200 },
        ]}
        type="bar"
      />
    </div>
  ),
}

export const PieChart: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">장치 유형 분포</h3>
      <Chart
        data={[
          { name: '센서', value: 35 },
          { name: '카메라', value: 25 },
          { name: '제어기', value: 20 },
          { name: '게이트웨이', value: 20 },
        ]}
        type="pie"
      />
    </div>
  ),
}

export const AreaChart: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">트래픽 추이</h3>
      <Chart
        data={[
          { name: '00:00', value: 120 },
          { name: '04:00', value: 80 },
          { name: '08:00', value: 350 },
          { name: '12:00', value: 450 },
          { name: '16:00', value: 380 },
          { name: '20:00', value: 280 },
        ]}
        type="area"
      />
    </div>
  ),
}

export const Dashboard: Story = {
  render: () => (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">일일 방문자</h3>
          <Chart
            data={[
              { name: '월', value: 1200 },
              { name: '화', value: 1500 },
              { name: '수', value: 1350 },
              { name: '목', value: 1800 },
              { name: '금', value: 1650 },
              { name: '토', value: 900 },
              { name: '일', value: 800 },
            ]}
            type="line"
          />
        </ChartContainer>

        <ChartContainer className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">상태별 장치 수</h3>
          <Chart
            data={[
              { name: '정상', value: 45 },
              { name: '경고', value: 8 },
              { name: '오류', value: 3 },
            ]}
            type="pie"
          />
        </ChartContainer>
      </div>

      <ChartContainer className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">월별 이벤트 현황</h3>
        <Chart
          data={[
            { name: '1월', value: 230 },
            { name: '2월', value: 310 },
            { name: '3월', value: 280 },
            { name: '4월', value: 450 },
            { name: '5월', value: 390 },
            { name: '6월', value: 520 },
          ]}
          type="bar"
        />
      </ChartContainer>
    </div>
  ),
}

export const RealTimeMonitoring: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">실시간 모니터링</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-success-50 text-success-700">
          <span className="w-2 h-2 rounded-full bg-success-600 mr-2 animate-pulse"></span>
          실시간 업데이트
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">총 장치 수</p>
          <p className="text-3xl font-bold mt-1">56</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">활성 장치</p>
          <p className="text-3xl font-bold text-success-600 mt-1">45</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">오류 장치</p>
          <p className="text-3xl font-bold text-error-600 mt-1">3</p>
        </div>
      </div>

      <Chart
        data={[
          { name: '10:00', value: 42 },
          { name: '10:05', value: 43 },
          { name: '10:10', value: 44 },
          { name: '10:15', value: 45 },
          { name: '10:20', value: 44 },
          { name: '10:25', value: 45 },
        ]}
        type="area"
      >
        <div className="mt-4 text-sm text-muted-foreground">
          마지막 업데이트: 방금 전
        </div>
      </Chart>
    </div>
  ),
}

export const Analytics: Story = {
  render: () => (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold">데이터 분석</h2>
        <p className="text-sm text-muted-foreground mt-1">
          최근 6개월간의 데이터 분석 결과입니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">사용자 증가율</h3>
          <Chart
            data={[
              { name: '1월', value: 1000 },
              { name: '2월', value: 1200 },
              { name: '3월', value: 1450 },
              { name: '4월', value: 1800 },
              { name: '5월', value: 2100 },
              { name: '6월', value: 2500 },
            ]}
            type="area"
          />
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-900">
              📈 전월 대비 <strong>19% 증가</strong>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">카테고리별 비율</h3>
          <Chart
            data={[
              { name: '모바일', value: 45 },
              { name: '데스크톱', value: 35 },
              { name: '태블릿', value: 15 },
              { name: '기타', value: 5 },
            ]}
            type="pie"
          />
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">주요 플랫폼:</span>
              <span className="font-medium">모바일 (45%)</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">일별 활성 사용자</h3>
        <Chart
          data={Array.from({ length: 30 }, (_, i) => ({
            name: `${i + 1}일`,
            value: Math.floor(Math.random() * 1000) + 500,
          }))}
          type="bar"
        />
      </div>
    </div>
  ),
}

export const SimpleWithLegend: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Chart data={sampleData} type="line">
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-600 rounded"></div>
            <span className="text-sm text-muted-foreground">월별 데이터</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              평균: <strong>{(sampleData.reduce((sum, d) => sum + d.value, 0) / sampleData.length).toFixed(1)}</strong>
            </span>
          </div>
        </div>
      </Chart>
    </div>
  ),
}