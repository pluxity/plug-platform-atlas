import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Column, DataTable, Input, Progress, Switch, Spinner, toast, Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui';
import { useFeatures, useSyncFeatures, FeatureResponse } from '@plug-atlas/web-core';
import { useState, useEffect } from 'react';

export default function IoTSensor() {
  const { data, mutate, error, isLoading } = useFeatures();
  const { trigger: syncFeatures, isMutating: isSyncingFeatures } = useSyncFeatures();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('all');

  const itemsPerPage = 5;

  // 공원 목록 추출
  const sites = Array.from(new Set((data || []).map(f => f.siteResponse?.name).filter(Boolean))) as string[];
  
  // 선택된 공원에 따른 디바이스 타입 목록 추출
  const getDeviceTypesForSite = () => {
    if (!data) return [];
    
    const filteredData = selectedSite === 'all' 
      ? data 
      : data.filter(f => f.siteResponse?.name === selectedSite);
    
    return Array.from(new Set(filteredData.map(f => f.deviceTypeResponse?.description).filter(Boolean))) as string[];
  };

  const deviceTypes = getDeviceTypesForSite();

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // 공원 변경 시 디바이스 타입 초기화
  useEffect(() => {
    setSelectedDeviceType('all');
    setCurrentPage(1);
  }, [selectedSite]);

  // Select 박스 필터링된 데이터
  const getSelectFilteredData = () => {
    if (!data) return [];

    let filtered = data;

    if (selectedSite !== 'all') {filtered = filtered.filter(f => f.siteResponse?.name === selectedSite);}
    if (selectedDeviceType !== 'all') {filtered = filtered.filter(f => f.deviceTypeResponse?.description === selectedDeviceType);}

    return filtered;
  };

  const getSearchFilteredData = () => {
    const selectFiltered = getSelectFilteredData();
    
    if (!searchTerm.trim()) {
      return selectFiltered;
    }

    return selectFiltered.filter((feature) => {
      return feature.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.objectId.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const displayData = getSearchFilteredData().sort((a, b) => a.id - b.id);
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const currentPageData = displayData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSyncFeatures = async () => {
    try {
      await syncFeatures();
      toast.success('디바이스 동기화가 성공적으로 완료되었습니다.');
      mutate();
    } catch (error) {
      toast.error('디바이스 동기화에 실패했습니다.');
    } 
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSiteChange = (value: string) => {
    setSelectedSite(value);
  };

  const handleDeviceTypeChange = (value: string) => {
    setSelectedDeviceType(value);
    setCurrentPage(1);
  };

  const getVisiblePages = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  const featureColumns: Column<FeatureResponse>[] = [
    {
      key: 'id',
      header: '번호',
    },
    {
      key: 'deviceId',
      header: '디바이스 코드',
      cell: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.name}</span>
          <span className="flex flex-col text-xs text-gray-500">
            {row.deviceId} ({row.objectId})
          </span>
        </div>
      )
    },
    {
      key: 'siteResponse',
      header: '도면명',
      cell: (_,row) => (
        <>{row.siteResponse?.name}</>
      )
    },
    {
      key: 'latitude',
      header: '위경도',
      cell: (_,row) => (
        <div className="flex flex-col">
          <span>{row.latitude}</span>
          <span className="text-xs text-gray-500">{row.longitude}</span>
        </div>
      )
    },
    {
      key: 'eventStatus',
      header: '이벤트 상태',
      cell: (_,row) => (
          <Badge variant='secondary'>{row.eventStatus}</Badge>
      )
    },
    {
      key: 'batteryLevel',
      header: '배터리 잔량',
      cell: (_,row) => (
        <div className="flex flex-col">
          <Progress value={row.batteryLevel} />
          <span className="text-xs text-gray-500">{row.batteryLevel ?? 0}</span>
        </div>
      )
    },
    {
      key: 'deviceTypeResponse',
      header: '세부사항',
      cell: () => (
        <Button variant="outline">세부사항</Button>
      )
    },
    {
      key: 'active',
      header: '활성화',
      cell: (_,row) => (
          <Switch 
            checked={row.active ?? false} 
            onCheckedChange={() => {}}
           
          />
      )
    }
  ]

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">IoT 센서</h1>
        <p className="text-gray-600">성남시 공원에 설치된 IoT 센서를 조회하고 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            IoT 센서 목록 <span className="text-gray-500 text-sm">{data && `(${displayData.length}개)`}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">             
                  <Select value={selectedSite} onValueChange={handleSiteChange}>
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
                    onValueChange={handleDeviceTypeChange}
                    disabled={selectedSite === 'all'}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="디바이스 타입 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 타입</SelectItem>
                      {deviceTypes.map((deviceType) => (
                        <SelectItem key={deviceType} value={deviceType}>
                          {deviceType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input 
                    placeholder="디바이스 ID 검색" 
                    className="w-64" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    onKeyDown={handleKeyDown}
                  />
  
                  <Button variant="outline" onClick={handleSearch}>검색</Button>
                </div>
                <div className="flex items-center gap-2">
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
              </div>
              
              <DataTable data={currentPageData} columns={featureColumns} onRowEdit={() => {}} />
              
              {totalPages >= 1 && (
                <Pagination className="mt-5">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      />
                    </PaginationItem>

                    {getVisiblePages().map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => totalPages > currentPage && setCurrentPage(currentPage + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}