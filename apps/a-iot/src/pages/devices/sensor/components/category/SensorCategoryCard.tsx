import {Card, CardContent, CardHeader, CardTitle, cn} from '@plug-atlas/ui';

interface DeviceTypeWithProfiles {
  id: number;
  objectId: string;
  description?: string;
  version?: string;
  profiles?: Array<{
    id?: number;
    description?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface SensorCategoryCardProps {
  deviceType: DeviceTypeWithProfiles;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function SensorCategoryCard({ 
  deviceType, 
  isSelected = false, 
  onClick 
}: SensorCategoryCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border",
        isSelected 
          ? "border-blue-500 bg-blue-50 shadow-md" 
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
              {deviceType.description || '설명 없음'}
          </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {deviceType.profiles && deviceType.profiles.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {deviceType.profiles.slice(0, 2).map((profile, index: number) => (
                  <span 
                    key={profile.id || index}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {profile.description || `프로필 ${index + 1}`}
                  </span>
                ))}
              </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}