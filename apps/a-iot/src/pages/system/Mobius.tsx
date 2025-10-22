import { useEffect } from 'react'
import { useMobiusConfig, useUpdateMobiusConfig } from '@plug-atlas/api-hooks'
import type { MobiusConfigFormData } from '@plug-atlas/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plug-atlas/ui'
import { Button, Input, Label, toast } from '@plug-atlas/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MobiusConfigFormSchema, buildMobiusUrl, parseMobiusUrl } from '@plug-atlas/types'
import { Server } from 'lucide-react'

export default function Mobius() {
  const { data: config, mutate, isLoading } = useMobiusConfig()
  const { trigger: updateConfig, isMutating } = useUpdateMobiusConfig()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MobiusConfigFormData>({
    resolver: zodResolver(MobiusConfigFormSchema),
    defaultValues: {
      ipAddress: '',
      port: 11000,
      cseBaseName: 'Mobius',
      deviceGroup: '',
    },
  })

  useEffect(() => {
    if (config && config.url) {
      const parsed = parseMobiusUrl(config.url)
      if (parsed) {
        reset(parsed)
      }
    }
  }, [config, reset])

  const onSubmit = async (data: MobiusConfigFormData) => {
    try {
      const url = buildMobiusUrl(data)
      await updateConfig({ url })
      toast.success('Mobius 연동 설정이 성공적으로 저장되었습니다.')
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Mobius 연동 설정 저장에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">설정을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mobius 연동 관리</h1>
        <p className="text-gray-600">KETI Mobius IoT 플랫폼 연동을 설정하고 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="size-5" />
            플랫폼 연동 설정
          </CardTitle>
          <CardDescription>
            Mobius 플랫폼 서버의 연결 정보를 입력하세요. 설정 변경 후 반드시 저장 버튼을 클릭해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ipAddress">
                  IoT 플랫폼 IP 주소 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ipAddress"
                  placeholder="예: 203.253.128.181"
                  {...register('ipAddress')}
                  disabled={isMutating}
                />
                {errors.ipAddress && (
                  <p className="text-sm text-red-500">{errors.ipAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">
                  IoT 플랫폼 Port 번호 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="예: 11000"
                  {...register('port', { valueAsNumber: true })}
                  disabled={isMutating}
                />
                {errors.port && (
                  <p className="text-sm text-red-500">{errors.port.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cseBaseName">
                  CSEBASE_NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cseBaseName"
                  placeholder="예: Mobius"
                  {...register('cseBaseName')}
                  disabled={isMutating}
                />
                {errors.cseBaseName && (
                  <p className="text-sm text-red-500">{errors.cseBaseName.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Mobius CSE (Common Services Entity) 베이스 이름
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceGroup">
                  디바이스 관리 그룹명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deviceGroup"
                  placeholder="예: sawwave"
                  {...register('deviceGroup')}
                  disabled={isMutating}
                />
                {errors.deviceGroup && (
                  <p className="text-sm text-red-500">{errors.deviceGroup.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  IoT 디바이스를 관리할 그룹 이름
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isMutating}
              >
                초기화
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? '저장 중...' : 'API 정보 저장'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
