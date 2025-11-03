import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  ScrollArea,
  Card,
  CardContent,
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DatePicker,
} from '@plug-atlas/ui'
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Video,
  MapPin,
  Clock,
  User,
  ShoppingBag,
  Shirt,
  Filter,
  Info,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { useVideoSearchStore } from '../../stores/useVideoSearchStore'

export default function VideoSearchDialog() {
  const {
    isOpen,
    closeDialog,
    filter,
    setFilter,
    resetFilter,
    search,
    results,
    selectedResult,
    selectResult,
    isSearching,
  } = useVideoSearchStore()

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = async () => {
    await search()
  }

  const handleReset = () => {
    resetFilter()
  }

  const eventTypeLabels: Record<string, string> = {
    all: '전체',
    'object-detection': '객체 탐지',
    'fence-proximity': '철책 근접',
    'fence-breach': '철책 돌파',
  }

  const genderLabels: Record<string, string> = {
    all: '전체',
    male: '남성',
    female: '여성',
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="!max-w-[1600px] w-[90vw] max-h-[90vh] h-[85vh] p-0 flex flex-col bg-slate-950 text-slate-100 border-slate-800 sm:!max-w-[1600px]">
        <DialogHeader className="px-6 py-4 border-b border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-slate-100">
            <Video className="size-5" />
            영상 기록 검색
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* 좌측: 검색 조건 */}
          <div className="w-[360px] border-r border-slate-800 flex flex-col bg-slate-950">
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* 검색 조건 헤더 */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2 text-slate-100">
                    <Filter className="size-4" />
                    검색 조건
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 px-2 text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  >
                    <X className="size-3 mr-1" />
                    초기화
                  </Button>
                </div>

                {/* 날짜 */}
                <div className="space-y-3">
                  <Label className="text-sm text-slate-300 flex items-center gap-2">
                    <CalendarIcon className="size-3.5" />
                    날짜
                  </Label>
                  <div className="space-y-2">
                    <DatePicker
                      mode="single"
                      value={filter.startDate}
                      onChange={(date) => setFilter({ startDate: date })}
                      placeholder="년-월-일"
                      className="w-full bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800 hover:border-slate-600"
                    />
                  </div>
                </div>

                {/* 이벤트 종류 */}
                <div className="space-y-3">
                  <Label className="text-sm text-slate-300">이벤트 종류</Label>
                  <Select
                    value={filter.eventType || 'all'}
                    onValueChange={(value) =>
                      setFilter({ eventType: value as typeof filter.eventType })
                    }
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                      {Object.entries(eventTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="hover:bg-slate-800 focus:bg-slate-800">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 객체 ID */}
                <div className="space-y-3">
                  <Label className="text-sm text-slate-300">객체 ID</Label>
                  <Input
                    placeholder="객체 ID 입력"
                    value={filter.objectId || ''}
                    onChange={(e) => setFilter({ objectId: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 hover:bg-slate-800"
                  />
                </div>

                {/* 사람 속성 검색 (고급) */}
                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
                      size="sm"
                    >
                      <span className="flex items-center gap-2">
                        <User className="size-4" />
                        사람 속성 검색
                      </span>
                      {showAdvanced ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {/* 성별 */}
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">성별</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(genderLabels).map(([value, label]) => (
                          <Button
                            key={value}
                            variant={filter.gender === value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              setFilter({ gender: value as typeof filter.gender })
                            }
                            className={filter.gender === value
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* 나이 */}
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">나이</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="최소"
                          value={filter.ageMin || ''}
                          onChange={(e) =>
                            setFilter({
                              ageMin: e.target.value ? parseInt(e.target.value) : undefined,
                            })
                          }
                          className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
                        />
                        <span className="text-sm text-slate-500">~</span>
                        <Input
                          type="number"
                          placeholder="최대"
                          value={filter.ageMax || ''}
                          onChange={(e) =>
                            setFilter({
                              ageMax: e.target.value ? parseInt(e.target.value) : undefined,
                            })
                          }
                          className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* 상의 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-sm text-slate-300">
                        <Shirt className="size-3" />
                        상의
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={filter.topType || ''}
                          onValueChange={(value) => setFilter({ topType: value })}
                        >
                          <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectValue placeholder="종류" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectItem value="전체">전체</SelectItem>
                            <SelectItem value="shirt">셔츠</SelectItem>
                            <SelectItem value="jacket">재킷</SelectItem>
                            <SelectItem value="tshirt">티셔츠</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={filter.topColor || ''}
                          onValueChange={(value) => setFilter({ topColor: value })}
                        >
                          <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectValue placeholder="색상" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectItem value="전체">전체</SelectItem>
                            <SelectItem value="black">검정</SelectItem>
                            <SelectItem value="white">흰색</SelectItem>
                            <SelectItem value="blue">파랑</SelectItem>
                            <SelectItem value="red">빨강</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 하의 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-sm text-slate-300">
                        <Shirt className="size-3" />
                        하의
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={filter.bottomType || ''}
                          onValueChange={(value) => setFilter({ bottomType: value })}
                        >
                          <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectValue placeholder="종류" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectItem value="전체">전체</SelectItem>
                            <SelectItem value="pants">바지</SelectItem>
                            <SelectItem value="skirt">치마</SelectItem>
                            <SelectItem value="shorts">반바지</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={filter.bottomColor || ''}
                          onValueChange={(value) => setFilter({ bottomColor: value })}
                        >
                          <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectValue placeholder="색상" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectItem value="전체">전체</SelectItem>
                            <SelectItem value="black">검정</SelectItem>
                            <SelectItem value="blue">파랑</SelectItem>
                            <SelectItem value="red">빨강</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 가방 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-sm text-slate-300">
                        <ShoppingBag className="size-3" />
                        가방
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: null, label: '전체' },
                          { value: true, label: '있음' },
                          { value: false, label: '없음' },
                        ].map((option) => (
                          <Button
                            key={String(option.value)}
                            variant={filter.hasBag === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter({ hasBag: option.value })}
                            className={filter.hasBag === option.value
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>

            {/* 검색 버튼 */}
            <div className="p-4 border-t border-slate-800">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSearch}
                disabled={isSearching}
              >
                <Search className="size-4 mr-2" />
                {isSearching ? '검색 중...' : '검색'}
              </Button>
            </div>
          </div>

          {/* 우측: 재생 화면 + 검색 결과 */}
          <div className="flex-1 flex flex-col bg-slate-900">
            <Tabs defaultValue="video" className="flex-1 flex flex-col">
              {/* 탭 헤더 */}
              <div className="border-b border-slate-800 px-4">
                <TabsList className="bg-transparent h-12">
                  <TabsTrigger value="video" className="gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400">
                    <Video className="size-4" />
                    재생 화면
                  </TabsTrigger>
                  <TabsTrigger value="details" className="gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400">
                    <Info className="size-4" />
                    상세 정보
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* 재생 화면 탭 */}
              <TabsContent value="video" className="flex-1 m-0 flex flex-col">
                <div className="bg-black aspect-video relative">
                  {selectedResult?.videoUrl ? (
                    <video
                      key={selectedResult.id}
                      controls
                      className="w-full h-full"
                      src={selectedResult.videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <div className="text-center">
                        <Video className="size-16 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">검색 결과를 선택하면 영상이 재생됩니다</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* 상세 정보 탭 */}
              <TabsContent value="details" className="flex-1 m-0 bg-slate-900">
                <ScrollArea className="h-full">
                  {selectedResult ? (
                    <div className="p-6 space-y-6">
                      {/* 기본 정보 */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-slate-100">기본 정보</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-slate-400">객체 ID</p>
                            <Badge variant="outline" className="border-slate-700 text-slate-300">{selectedResult.objectId}</Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-400">이벤트 종류</p>
                            <Badge className="bg-blue-600 text-white">{eventTypeLabels[selectedResult.eventType] || selectedResult.eventType}</Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-400">탐지 시간</p>
                            <p className="text-sm flex items-center gap-1 text-slate-300">
                              <Clock className="size-3" />
                              {selectedResult.timestamp.toLocaleString('ko-KR')}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-400">위치</p>
                            <p className="text-sm flex items-center gap-1 text-slate-300">
                              <MapPin className="size-3" />
                              {selectedResult.location.lat.toFixed(6)}, {selectedResult.location.lon.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 스냅샷 */}
                      {selectedResult.snapshotUrl && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-slate-100">스냅샷</h4>
                          <img
                            src={selectedResult.snapshotUrl}
                            alt="Snapshot"
                            className="w-full rounded-lg border border-slate-700"
                          />
                        </div>
                      )}

                      {/* 메타데이터 */}
                      {selectedResult.metadata && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-slate-100">AI 분석 정보</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedResult.metadata.gender && (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-400">성별</p>
                                <p className="text-sm font-medium text-slate-200">
                                  {genderLabels[selectedResult.metadata.gender]}
                                </p>
                              </div>
                            )}
                            {selectedResult.metadata.age && (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-400">나이</p>
                                <p className="text-sm font-medium text-slate-200">{selectedResult.metadata.age}세</p>
                              </div>
                            )}
                            {selectedResult.metadata.topType && (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-400">상의 종류</p>
                                <p className="text-sm font-medium text-slate-200">{selectedResult.metadata.topType}</p>
                              </div>
                            )}
                            {selectedResult.metadata.topColor && (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-400">상의 색상</p>
                                <p className="text-sm font-medium text-slate-200">{selectedResult.metadata.topColor}</p>
                              </div>
                            )}
                            {selectedResult.metadata.bottomType && (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-400">하의 종류</p>
                                <p className="text-sm font-medium text-slate-200">{selectedResult.metadata.bottomType}</p>
                              </div>
                            )}
                            {selectedResult.metadata.bottomColor && (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-400">하의 색상</p>
                                <p className="text-sm font-medium text-slate-200">{selectedResult.metadata.bottomColor}</p>
                              </div>
                            )}
                            {selectedResult.metadata.hasBag !== undefined && (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-400">가방 소지</p>
                                <p className="text-sm font-medium text-slate-200">
                                  {selectedResult.metadata.hasBag ? '있음' : '없음'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 p-8">
                      <div className="text-center">
                        <Info className="size-16 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">검색 결과를 선택하면 상세 정보가 표시됩니다</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {/* 검색 결과 */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-slate-800">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950">
                <h3 className="font-semibold text-slate-100">검색 결과</h3>
                {results.length > 0 && (
                  <p className="text-sm text-slate-400 mt-1">
                    총 {results.length}개의 결과
                  </p>
                )}
              </div>
              <ScrollArea className="flex-1">
                {results.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 p-8">
                    <div className="text-center">
                      <Search className="size-16 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">검색 버튼을 눌러 영상 기록을 검색하세요</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {results.map((result) => (
                      <Card
                        key={result.id}
                        className={`cursor-pointer transition-all bg-slate-900 border-slate-700 hover:bg-slate-800 ${
                          selectedResult?.id === result.id ? 'ring-2 ring-blue-600 bg-slate-800' : ''
                        }`}
                        onClick={() => selectResult(result)}
                      >
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="w-32 h-24 bg-slate-950 rounded overflow-hidden flex-shrink-0">
                              {result.snapshotUrl ? (
                                <img
                                  src={result.snapshotUrl}
                                  alt={`Snapshot ${result.id}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Video className="size-8 text-slate-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                  {result.objectId}
                                </Badge>
                                <Badge className="text-xs bg-blue-600 text-white">
                                  {eventTypeLabels[result.eventType] || result.eventType}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-300 flex items-center gap-1">
                                <Clock className="size-3" />
                                {result.timestamp.toLocaleString('ko-KR')}
                              </p>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="size-3" />
                                {result.location.lat.toFixed(4)}, {result.location.lon.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
