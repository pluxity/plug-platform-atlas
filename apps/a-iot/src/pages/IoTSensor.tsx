import { Badge, Button, Column, DataTable, Progress, Switch, Spinner, toast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui';
import { useFeatures, useSyncFeatures, FeatureResponse, useUpdateFeature } from '@plug-atlas/web-core';
import { useState, useEffect, useMemo } from 'react';
import DeviceMapViewer from '../components/devices/DeviceMapViewer';
import { useSearchBar, usePagination } from './hooks';
import { SearchBar, TablePagination } from './components';
import { XIcon } from 'lucide-react';

export default function IoTSensor() {
  const { data, mutate, error, isLoading } = useFeatures();
  const { trigger: syncFeatures, isMutating: isSyncingFeatures } = useSyncFeatures();
  const { trigger: updateFeature } = useUpdateFeature();
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedDeviceType, setSelectedDeviceType] = useState('all');
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<FeatureResponse | null>(null);

  const sites = useMemo(() => 
    Array.from(new Set(
      (data || [])
      .map(f => f.siteResponse?.name)
      .filter((name): name is string => !!name)
    )).sort() as string[],
    [data]
  );
  
  const deviceTypes = useMemo(() => {
    if (!data) return [];

    return Array.from(new Set(
      data
      .map(f => f.deviceTypeResponse?.description)
      .filter(Boolean)
    )).sort() as string[];

  }, [data]);
  
  const filteredBySelections = useMemo(() => {
    if (!data) return [];
  
    let filtered = data;
  
    if (selectedSite !== 'all') {
      filtered = filtered.filter(f => f.siteResponse?.name === selectedSite);
    }
    if (selectedDeviceType !== 'all') {
      filtered = filtered.filter(f => f.deviceTypeResponse?.description === selectedDeviceType);
    }
  
    return filtered.sort((a, b) => {
      if (!!a.siteResponse?.name !== !!b.siteResponse?.name) {
        return b.siteResponse?.name ? 1 : -1;
      }
    
      if (a.siteResponse?.name && b.siteResponse?.name) {
        const nameCompare = a.siteResponse.name.localeCompare(b.siteResponse.name);
        if (nameCompare !== 0) return nameCompare;
      }

      if (a.deviceId && b.deviceId) {
        return a.deviceId.localeCompare(b.deviceId);
      }
      
      return a.id - b.id;
    });

  }, [data, selectedSite, selectedDeviceType]);

  const { searchTerm, filteredData, handleSearch } = useSearchBar<FeatureResponse>(filteredBySelections, ['deviceId', 'name', 'objectId']);

  const { currentPage, totalPages, currentPageData, goToPage, nextPage, prevPage, resetPage } = usePagination<FeatureResponse>(filteredData, 8);

  useEffect(() => {
    resetPage();
  }, [selectedSite, selectedDeviceType, searchTerm, resetPage]);

  const handleSyncFeatures = async () => {
    try {
      await syncFeatures();
      toast.success('디바이스 동기화가 성공적으로 완료되었습니다.');
      mutate();
    } catch (error) {
      toast.error('디바이스 동기화에 실패했습니다.');
    } 
  };

  const handleRemoveSiteFilter = () => {
    setSelectedSite('all');
  };

  const handleRemoveDeviceTypeFilter = () => {
    setSelectedDeviceType('all');
  };

  const handleClearAllFilters = () => {
    setSelectedSite('all');
    setSelectedDeviceType('all');
  };

  const activeFiltersCount = (selectedSite !== 'all' ? 1 : 0) + (selectedDeviceType !== 'all' ? 1 : 0);

  const handleToggleActive = async (featureId: number, active: boolean) => {
    try {
      await updateFeature({ id: featureId, data: { active } });
      toast.success('활성화 상태가 변경되었습니다.');
      mutate();
    } catch (error) {
      toast.error('활성화 상태 변경에 실패했습니다.');
    } 
  };

  const handleOpenMap = (device: FeatureResponse) => {
    setSelectedDevice(device);
    setIsMapDialogOpen(true);
  };

  const featureColumns: Column<FeatureResponse>[] = [
    {
      key: 'id',
      header: '번호',
      cell: (value) => value != null ? String(value) : '-'
    },
    {
      key: 'deviceId',
      header: '디바이스 코드',
      cell: (_, row) => (
        row.name ? (
          <div className="flex flex-col items-start">
            <span className="font-semibold">{row.name}</span>
            <span className="flex flex-col text-xs text-gray-500">
              {row.deviceId} ({row.objectId})
            </span>
          </div>
        ) : '-'
      )
    },
    {
      key: 'name',
      header: '공원명',
      cell: (_,row) => (
        <div className="flex items-start">
          {row.siteResponse?.name ? String(row.siteResponse?.name) : '-'}
        </div>

      )
    },
    {
      key: 'latitude',
      header: '위도',
      cell: (_,row) => (
        <span className="text-center tabular-nums block">
          {row.latitude != null ? Number(row.latitude).toFixed(5) : '-'}
        </span>
      )
    },
    {
      key: 'longitude',
      header: '경도',
      cell: (_,row) => (
        <span className="text-center tabular-nums block">
          {row.longitude != null ? Number(row.longitude).toFixed(5) : '-'}
        </span>
      )
    },
    {
      key: 'eventStatus',
      header: '이벤트 상태',
      cell: (_,row) => (
        row.eventStatus ? <Badge variant='secondary'>{row.eventStatus}</Badge> : '-'
      )
    },
    {
      key: 'batteryLevel',
      header: '배터리 잔량',
      cell: (_,row) => (
        row.batteryLevel != null ? (
          <div className="relative">
            <Progress 
              className={row.batteryLevel <= 20 ? "h-4 [&>div]:bg-destructive bg-destructive/20" : "h-4"} 
              value={row.batteryLevel} 
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-300">
              {row.batteryLevel ?? 0}%
            </span>
          </div>
        ) : '-'
      )
    },
    {
      key: 'active',
      header: '활성화',
      cell: (_,row) => (
        <Switch 
          checked={row.active ?? false} 
          onCheckedChange={(checked) => handleToggleActive(row.id, checked)}
        />
      )
    },
    {
      key: 'siteResponse',
      header: '지도보기',
      cell: (_, row) => (
        <Button variant="outline" size="sm" onClick={() => handleOpenMap(row)}>
          지도보기
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-1">IoT 센서 <span className="text-gray-500 text-sm font-normal">{data && `(${filteredData.length}개)`}</span></h1>
        <p className="text-sm text-gray-600">성남시 공원에 설치된 IoT 센서를 조회하고 관리합니다.</p>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-10">
            로딩중 ... <Spinner />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        )}
        {data && (
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">             
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="공원 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 공원</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site} value={site}>
                        {site}
                      </SelectItem> 
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedDeviceType} 
                  onValueChange={setSelectedDeviceType}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="디바이스 타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 디바이스</SelectItem>
                    {deviceTypes.map((deviceType) => (
                      <SelectItem key={deviceType} value={deviceType}>
                        {deviceType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <SearchBar
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="디바이스 ID 검색"
                  className="w-64"
                />
              </div>
              <Button onClick={handleSyncFeatures} disabled={isSyncingFeatures}>
                {isSyncingFeatures ? (
                  <>
                    디바이스 동기화 중... <Spinner size="sm" />
                  </>
                ) : (
                  '디바이스 동기화'
                )}
              </Button>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">적용된 필터:</span>
                
                {selectedSite !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedSite}
                    <Button
                      onClick={handleRemoveSiteFilter}
                      className="rounded-full h-4 w-4 !p-0 text-xs"
                      variant="ghost"
                      aria-label="공원 필터 제거"
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </Badge>
                )}

                {selectedDeviceType !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedDeviceType}
                    <Button
                      onClick={handleRemoveDeviceTypeFilter}
                      className="rounded-full h-4 w-4 !p-0 text-xs"
                      variant="ghost"
                      aria-label="디바이스 타입 필터 제거"
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </Badge>
                )}

                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={handleClearAllFilters}
                  className="ml-auto"
                >
                  모두 지우기
                </Button>
              </div>
            )}
            
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              <DataTable data={currentPageData} columns={featureColumns} />
            )}
            
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              onPrev={prevPage}
              onNext={nextPage}
            />
          </>
        )}
      </div>

      <DeviceMapViewer
        open={isMapDialogOpen}
        onOpenChange={setIsMapDialogOpen}
        device={selectedDevice}
      />
    </div>
  );
}