import type { Meta, StoryObj } from "@storybook/react"
import { TwoColumnLayout } from "./two-column-layout.component"

const meta: Meta<typeof TwoColumnLayout> = {
  title: "Templates/TwoColumnLayout",
  component: TwoColumnLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "2-컬럼 레이아웃 템플릿입니다. 왼쪽과 오른쪽 영역을 35:65 비율로 분할하며, 각 영역의 너비, 간격, 스크롤 동작을 커스터마이징할 수 있습니다. 권한 관리, 안내방송 관리 등 마스터-디테일 또는 폼-리스트 패턴에 사용됩니다.",
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TwoColumnLayout>

export const Default: Story = {
  args: {
    leftWidth: "35%",
    rightWidth: "65%",
    gap: 16,
  },
  render: (args) => (
    <div className="h-screen p-4">
      <TwoColumnLayout {...args}>
        <TwoColumnLayout.Left>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">왼쪽 영역</h2>
            <p className="text-gray-600">35% 너비의 왼쪽 컬럼입니다.</p>
          </div>
        </TwoColumnLayout.Left>
        <TwoColumnLayout.Right>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">오른쪽 영역</h2>
            <p className="text-gray-600">65% 너비의 오른쪽 컬럼입니다.</p>
          </div>
        </TwoColumnLayout.Right>
      </TwoColumnLayout>
    </div>
  ),
}

export const MasterDetail: Story = {
  args: {
    leftWidth: "35%",
    rightWidth: "65%",
    gap: 16,
  },
  parameters: {
    docs: {
      description: {
        story:
          "마스터-디테일 패턴입니다. 왼쪽에서 항목을 선택하면 오른쪽에 상세 정보가 표시됩니다. 권한 관리, 사용자 관리 등에 사용됩니다.",
      },
    },
  },
  render: (args) => (
    <div className="h-screen p-4">
      <TwoColumnLayout {...args}>
        <TwoColumnLayout.Left>
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">항목 목록</h3>
              <input
                type="text"
                placeholder="검색..."
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              {["항목 A", "항목 B", "항목 C", "항목 D"].map((item, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">{item}</div>
                  <div className="text-sm text-gray-500">상세 정보 {i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </TwoColumnLayout.Left>
        <TwoColumnLayout.Right>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">상세 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input
                  type="text"
                  defaultValue="항목 A"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <textarea
                  defaultValue="항목에 대한 상세 설명입니다."
                  className="w-full px-3 py-2 border rounded-md h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">옵션</label>
                <div className="space-y-2">
                  {["옵션 1", "옵션 2", "옵션 3", "옵션 4"].map((option, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={i < 2} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TwoColumnLayout.Right>
      </TwoColumnLayout>
    </div>
  ),
}

export const FormList: Story = {
  args: {
    leftWidth: "40%",
    rightWidth: "60%",
    gap: 20,
  },
  parameters: {
    docs: {
      description: {
        story:
          "폼-리스트 패턴입니다. 왼쪽에서 데이터를 입력/생성하고 오른쪽에 결과 목록이 표시됩니다. 안내방송 관리, 알림 생성 등에 사용됩니다.",
      },
    },
  },
  render: (args) => (
    <div className="h-screen p-4">
      <TwoColumnLayout {...args}>
        <TwoColumnLayout.Left>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">새 항목 등록</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">카테고리</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>카테고리 1</option>
                  <option>카테고리 2</option>
                  <option>카테고리 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                  placeholder="내용을 입력하세요"
                  className="w-full px-3 py-2 border rounded-md h-32"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">날짜</label>
                <input type="datetime-local" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                등록하기
              </button>
            </div>
          </div>
        </TwoColumnLayout.Left>
        <TwoColumnLayout.Right>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">등록 목록</h3>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-3 border rounded-md hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">항목 제목 {i + 1}</div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      카테고리 {(i % 3) + 1}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    항목에 대한 간단한 설명이 여기에 표시됩니다.
                  </div>
                  <div className="text-xs text-gray-400">2025-10-29 {14 + i}:30</div>
                </div>
              ))}
            </div>
          </div>
        </TwoColumnLayout.Right>
      </TwoColumnLayout>
    </div>
  ),
}

export const CustomWidths: Story = {
  args: {
    leftWidth: "300px",
    rightWidth: "calc(100% - 300px - 24px)",
    gap: 24,
  },
  render: (args) => (
    <div className="h-screen p-4">
      <TwoColumnLayout {...args}>
        <TwoColumnLayout.Left>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">고정 너비</h2>
            <p className="text-gray-600">300px 고정 너비의 왼쪽 컬럼입니다.</p>
          </div>
        </TwoColumnLayout.Left>
        <TwoColumnLayout.Right>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">유동 너비</h2>
            <p className="text-gray-600">남은 공간을 채우는 오른쪽 컬럼입니다.</p>
          </div>
        </TwoColumnLayout.Right>
      </TwoColumnLayout>
    </div>
  ),
}

export const ScrollBehavior: Story = {
  args: {
    leftWidth: "35%",
    rightWidth: "65%",
    gap: 16,
  },
  render: (args) => (
    <div className="h-screen p-4">
      <TwoColumnLayout {...args}>
        <TwoColumnLayout.Left scroll={true}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">스크롤 가능</h3>
            <div className="space-y-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="p-2 border rounded">
                  항목 {i + 1}
                </div>
              ))}
            </div>
          </div>
        </TwoColumnLayout.Left>
        <TwoColumnLayout.Right scroll={false}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">스크롤 불가능</h3>
            <p className="text-gray-600">
              이 영역은 스크롤이 비활성화되어 있습니다. Left와 Right 컴포넌트의 scroll prop으로
              각 컬럼의 스크롤 동작을 독립적으로 제어할 수 있습니다.
            </p>
          </div>
        </TwoColumnLayout.Right>
      </TwoColumnLayout>
    </div>
  ),
}

export const MinimumWidths: Story = {
  args: {
    leftWidth: "30%",
    rightWidth: "70%",
    gap: 16,
    minLeftWidth: 250,
    minRightWidth: 400,
  },
  render: (args) => (
    <div className="h-screen p-4">
      <TwoColumnLayout {...args}>
        <TwoColumnLayout.Left>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">최소 너비 250px</h2>
            <p className="text-gray-600">
              브라우저 창을 줄여도 250px 이하로는 줄어들지 않습니다.
            </p>
          </div>
        </TwoColumnLayout.Left>
        <TwoColumnLayout.Right>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">최소 너비 400px</h2>
            <p className="text-gray-600">
              브라우저 창을 줄여도 400px 이하로는 줄어들지 않습니다.
            </p>
          </div>
        </TwoColumnLayout.Right>
      </TwoColumnLayout>
    </div>
  ),
}
