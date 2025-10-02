import type { Meta, StoryObj } from '@storybook/react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.component'
import { Button } from '../../atoms/button/button.component'
import { Label } from '../../atoms/label/label.component'
import { Input } from '../../atoms/input/input.component'

const meta: Meta<typeof Sheet> = {
  title: 'Molecules/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '화면 가장자리에서 슬라이드되는 오버레이 컴포넌트입니다. 사이드 패널이나 드로어로 사용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">시트 열기</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>시트 제목</SheetTitle>
          <SheetDescription>
            시트의 내용을 설명하는 텍스트입니다. 여기에 추가 정보를 제공할 수
            있습니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            여기에 시트의 주요 콘텐츠가 들어갑니다.
          </p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">닫기</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const FromLeft: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">왼쪽에서 열기</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>네비게이션 메뉴</SheetTitle>
          <SheetDescription>
            왼쪽에서 슬라이드되는 시트입니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              대시보드
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              프로젝트
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              설정
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              도움말
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const FromTop: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">위에서 열기</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>알림 센터</SheetTitle>
          <SheetDescription>
            위에서 슬라이드되는 시트입니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">새로운 메시지</p>
              <p className="text-xs text-muted-foreground">5분 전</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">시스템 업데이트</p>
              <p className="text-xs text-muted-foreground">1시간 전</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">새로운 댓글</p>
              <p className="text-xs text-muted-foreground">2시간 전</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const FromBottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">아래에서 열기</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>빠른 액션</SheetTitle>
          <SheetDescription>
            아래에서 슬라이드되는 시트입니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="grid grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-auto py-4">
              <span className="text-2xl mb-2">📝</span>
              <span className="text-xs">메모</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-4">
              <span className="text-2xl mb-2">📷</span>
              <span className="text-xs">카메라</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-4">
              <span className="text-2xl mb-2">📁</span>
              <span className="text-xs">파일</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-4">
              <span className="text-2xl mb-2">🔗</span>
              <span className="text-xs">링크</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>프로필 편집</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>프로필 편집</SheetTitle>
          <SheetDescription>
            여기에서 프로필 정보를 수정할 수 있습니다. 완료되면 저장을
            클릭하세요.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" placeholder="홍길동" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="example@email.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input id="phone" type="tel" placeholder="010-1234-5678" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">자기소개</Label>
            <textarea
              id="bio"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="자기소개를 입력하세요..."
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button type="submit">저장</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const WithScrollContent: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">긴 콘텐츠 보기</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>이용 약관</SheetTitle>
          <SheetDescription>
            스크롤 가능한 긴 콘텐츠를 포함한 시트입니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">제1조 (목적)</h3>
            <p className="leading-relaxed">
              이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 회원
              간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">제2조 (정의)</h3>
            <p className="leading-relaxed">
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다. "서비스"란
              회사가 제공하는 모든 서비스를 의미합니다. "회원"이란 회사와
              서비스 이용계약을 체결한 자를 말합니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              제3조 (약관의 효력 및 변경)
            </h3>
            <p className="leading-relaxed">
              이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을
              발생합니다. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위
              내에서 이 약관을 변경할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              제4조 (서비스의 제공)
            </h3>
            <p className="leading-relaxed">
              회사는 회원에게 다양한 서비스를 제공합니다. 서비스는 연중무휴,
              1일 24시간 제공함을 원칙으로 합니다. 다만, 회사는 서비스의
              종류나 성질에 따라 제공하는 서비스의 내용을 추가, 변경 또는
              삭제할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              제5조 (서비스 이용계약의 성립)
            </h3>
            <p className="leading-relaxed">
              서비스 이용계약은 이용자의 이용신청에 대한 회사의 승낙과 이용자의
              약관 내용에 대한 동의로 성립됩니다. 회원가입은 신청자가 온라인
              가입신청 양식에 필요사항을 기입하고 동의 버튼을 누르는 방법으로
              신청합니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              제6조 (회원정보의 변경)
            </h3>
            <p className="leading-relaxed">
              회원은 개인정보관리를 통해 언제든지 본인의 개인정보를 열람하고
              수정할 수 있습니다. 회원은 회원가입 시 기재한 사항이 변경되었을
              경우 온라인으로 수정을 하거나 고객센터를 통해 변경사항을 알려야
              합니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              제7조 (개인정보의 보호)
            </h3>
            <p className="leading-relaxed">
              회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기
              위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령 및
              회사의 개인정보처리방침이 적용됩니다.
            </p>
          </div>
        </div>
        <SheetFooter className="sticky bottom-0 bg-background pt-4 border-t mt-4">
          <SheetClose asChild>
            <Button variant="outline">닫기</Button>
          </SheetClose>
          <Button>동의</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const SettingsPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">설정</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>설정</SheetTitle>
          <SheetDescription>
            앱 설정을 관리할 수 있습니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">알림 설정</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm">이메일 알림</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">푸시 알림</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">SMS 알림</span>
                <input type="checkbox" className="rounded" />
              </label>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t">
            <h4 className="text-sm font-medium">표시 설정</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm">다크 모드</span>
                <input type="checkbox" className="rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">컴팩트 뷰</span>
                <input type="checkbox" className="rounded" />
              </label>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t">
            <h4 className="text-sm font-medium">계정</h4>
            <Button variant="ghost" className="w-full justify-start">
              비밀번호 변경
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
            >
              계정 삭제
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const FilterPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">필터</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>필터</SheetTitle>
          <SheetDescription>
            검색 결과를 필터링할 수 있습니다.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>카테고리</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">전자제품</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">의류</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">도서</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">가구</span>
              </label>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t">
            <Label>가격 범위</Label>
            <div className="flex gap-2 items-center">
              <Input type="number" placeholder="최소" />
              <span className="text-muted-foreground">~</span>
              <Input type="number" placeholder="최대" />
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t">
            <Label>정렬</Label>
            <select className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
              <option>최신순</option>
              <option>가격 낮은순</option>
              <option>가격 높은순</option>
              <option>인기순</option>
            </select>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">초기화</Button>
          <Button>적용</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
