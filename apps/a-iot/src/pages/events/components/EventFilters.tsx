import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug-atlas/ui';
import {intervalOptions, statusOptions, timeRangeOptions} from "../utils/timeUtils.ts";
import {EventCollectInterval} from "../../../services/types";


interface EventFiltersProps {
  timeRange: string;
  statusFilter: string;
  siteFilter: string;
  interval: EventCollectInterval;
  onTimeRangeChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSiteFilterChange: (value: string) => void;
  onIntervalChange: (value: EventCollectInterval) => void;
  sites?: Array<{ id: number; name: string }>;
}

export default function EventFilters({
  timeRange,
  statusFilter,
  siteFilter,
  interval,
  onTimeRangeChange,
  onStatusFilterChange,
  onSiteFilterChange,
  onIntervalChange,
  sites
}: EventFiltersProps) {
  return (
    <div className="mb-6 flex gap-4 flex-wrap">
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {timeRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="상태 필터" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={siteFilter} onValueChange={onSiteFilterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="공원 필터" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 공원</SelectItem>
          {sites?.map((site) => (
            <SelectItem key={site.id} value={site.id.toString()}>
              {site.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={interval} onValueChange={(value) => onIntervalChange(value as EventCollectInterval)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {intervalOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}