import test from 'node:test'
import assert from 'node:assert/strict'
import { cctvToDevice, micToDevice, getDevicePosition, getDeviceStatus, filterDevices, isDeviceCacheKey } from '../src/lib/ai-edge-device.ts'
import { ApiClient } from '../../../packages/api-hooks/src/client/client.ts'
import { getDeviceMutationError } from '../src/lib/device-mutation-error.ts'
import { normalizeFeatureResponse } from '../src/services/types/feature.ts'
import { getCoordinateEditState } from '../src/lib/ai-edge-device.ts'
import { getHeightEditState } from '../src/lib/sensor-edit.ts'

test('coordinate drafts reject blanks and invalid ranges without losing zero or original precision', () => {
  const original = { longitude: 126.98168635368349, latitude: 37.586992734702 }
  const draft = { lon: String(original.longitude), lat: String(original.latitude) }
  assert.deepEqual(getCoordinateEditState(draft, original), { position: original, changed: false })
  for (const invalid of [{ lon: '', lat: '37' }, { lon: '127', lat: ' ' }, { lon: '181', lat: '37' }, { lon: '127', lat: '-91' }, { lon: 'NaN', lat: '37' }, { lon: 'Infinity', lat: '37' }]) {
    assert.deepEqual(getCoordinateEditState(invalid, original), { position: null, changed: false })
  }
  assert.deepEqual(getCoordinateEditState({ lon: '0', lat: '0' }, null), {
    position: { longitude: 0, latitude: 0 }, changed: true,
  })
  assert.equal(getCoordinateEditState({ lon: '127.000', lat: '37.0' }, { longitude: 127, latitude: 37 }).changed, false)
})

test('height drafts preserve zero defaults, blank rejection and explicit changes back to zero', () => {
  for (const original of [undefined, null, 0]) {
    assert.deepEqual(getHeightEditState('0', original), { height: 0, valid: true, changed: false })
  }
  for (const draft of ['', ' ', 'NaN', 'Infinity', 'invalid']) {
    const state = getHeightEditState(draft, 10)
    assert.equal(state.valid, false)
    assert.equal(state.changed, false)
  }
  assert.deepEqual(getHeightEditState('0', 10), { height: 0, valid: true, changed: true })
  assert.deepEqual(getHeightEditState('-2.5', 10), { height: -2.5, valid: true, changed: true })
  assert.equal(getHeightEditState('10.00', 10).changed, false)
})

test('IoT activation uses actual isActive responses, preserves false and supports documented active', () => {
  const sensor = { id: 65, deviceId: 'sensor-65', objectId: '34959', name: '센서', height: 0 }
  assert.equal(normalizeFeatureResponse({ ...sensor, isActive: true }).active, true)
  assert.equal(normalizeFeatureResponse({ ...sensor, isActive: false }).active, false)
  assert.equal(normalizeFeatureResponse({ ...sensor, isActive: false, active: true }).active, false)
  assert.equal(normalizeFeatureResponse({ ...sensor, active: true }).active, true)
  assert.equal(normalizeFeatureResponse({ ...sensor, active: false }).active, false)
  assert.equal(normalizeFeatureResponse(sensor).active, undefined)
  assert.equal(normalizeFeatureResponse({ ...sensor, isActive: true }).height, 0)
})

const cctv = { id: 1, name: '공원 CCTV', edsCameraId: 'camera-001', cameraStatus: 'NORMAL', lon: 127.1, lat: 37.4, site: { id: 1, name: '공원 A' } }
const mic = { id: 1, name: '공원 MIC', vendorMicId: 'vendor-mic-001', status: 'ACTIVE', longitude: null, latitude: null, site: null }

test('device identities and vendor IDs remain distinct across vendors', () => {
  const camera = cctvToDevice(cctv)
  const microphone = micToDevice(mic)
  assert.notEqual(camera.key, microphone.key)
  assert.equal(microphone.externalId, 'vendor-mic-001')
  assert.equal(microphone.position, null)
  assert.equal(camera.position.longitude, 127.1)
})

test('coordinates reject absent, non-finite, string and out-of-range values but allow zero axes', () => {
  for (const coordinates of [[null, 37], [127, undefined], [NaN, 1], [1, Infinity], [181, 1], [1, -91], ['127', 37]]) {
    assert.equal(getDevicePosition(...coordinates), null)
  }
  assert.deepEqual(getDevicePosition(0, 37), { longitude: 0, latitude: 37 })
  assert.deepEqual(getDevicePosition(127, 0), { longitude: 127, latitude: 0 })
})

test('MIC activation is not mislabeled as CCTV connection health', () => {
  assert.equal(getDeviceStatus('ACTIVE').label, '활성')
  assert.equal(getDeviceStatus('NORMAL').label, '정상')
  assert.equal(getDeviceStatus('FAULT').label, '장애')
  assert.equal(getDeviceStatus('future-value').label, '알 수 없음')
})

test('site, kind, status, missing-location and vendor search filters intersect', () => {
  const devices = [cctvToDevice(cctv), micToDevice(mic)]
  const all = { kind: 'all', site: 'all', status: 'all', location: 'all', search: '' }
  assert.equal(filterDevices(devices, all).length, 2)
  assert.deepEqual(filterDevices(devices, { ...all, kind: 'MIC', site: 'unmapped', location: 'missing', search: ' VENDOR-MIC ' }).map(d => d.key), ['mic:1'])
  assert.equal(filterDevices(devices, { ...all, site: '1', status: 'ACTIVE' }).length, 0)
  assert.equal(filterDevices(devices, { ...all, site: '1', location: 'registered' })[0].key, 'cctv:1')
})

test('cache invalidation includes filtered lists/details but excludes other devices/events/streams', () => {
  for (const key of ['cctvs', 'cctvs?siteId=2', 'cctvs/1']) assert.ok(isDeviceCacheKey(key, 'cctvs'))
  for (const key of ['mics', 'cctvs/events', 'cctvs/1/stream/realtime', ['cctvs'], null]) assert.equal(isDeviceCacheKey(key, 'cctvs'), false)
})

test('403 is local only for opted-in requests, with legacy redirect behavior preserved', async () => {
  const originalFetch = globalThis.fetch
  let forbidden = 0
  globalThis.fetch = async () => Response.json({ message: 'Forbidden' }, { status: 403 })
  try {
    const client = new ApiClient({ baseUrl: 'https://example.test/api', onForbidden: () => forbidden++ })
    await assert.rejects(client.get('cctvs', { handleForbiddenLocally: true, retry: 0 }), /403/)
    await assert.rejects(client.put('features/1', { active: false }, { handleForbiddenLocally: true, retry: 0 }), /403/)
    assert.equal(forbidden, 0)
    await assert.rejects(client.get('cctvs', { retry: 0 }), /403/)
    assert.equal(forbidden, 1)
    await assert.rejects(client.put('features/1', { active: false }, { retry: 0 }), /403/)
    assert.equal(forbidden, 2)
  } finally { globalThis.fetch = originalFetch }
})

test('401 refresh retry keeps a subsequent 403 local and does not log the user out', async () => {
  const originalFetch = globalThis.fetch
  let refreshes = 0, unauthorized = 0, forbidden = 0
  globalThis.fetch = async input => {
    const url = typeof input === 'string' ? input : input.url
    if (url.endsWith('/auth/refresh-token')) { refreshes++; return new Response(null, { status: 204 }) }
    return Response.json({ message: 'denied' }, { status: input.headers.get('X-Auth-Retry') ? 403 : 401 })
  }
  try {
    const client = new ApiClient({ baseUrl: 'https://example.test/api', onUnauthorized: () => unauthorized++, onForbidden: () => forbidden++ })
    await assert.rejects(client.get('cctvs', { handleForbiddenLocally: true, retry: 0 }), /403/)
    assert.equal(refreshes, 1)
    assert.equal(forbidden, 0)
    assert.equal(unauthorized, 0)
  } finally { globalThis.fetch = originalFetch }
})

test('device mutations preserve 204, zero coordinates/height and explicit false activation', async () => {
  const originalFetch = globalThis.fetch
  const requests = []
  globalThis.fetch = async request => {
    requests.push({ method: request.method, url: request.url, body: await request.text() })
    return new Response(null, { status: 204 })
  }
  try {
    const client = new ApiClient({ baseUrl: 'https://example.test/api' })
    assert.equal(await client.post('mics/sync', undefined, { handleForbiddenLocally: true }), undefined)
    assert.equal(await client.patch('cctvs/1/coordinates', { lon: 0, lat: 37 }, { handleForbiddenLocally: true }), undefined)
    assert.equal(await client.put('features/1', { active: false, height: 0 }, { handleForbiddenLocally: true }), undefined)
    assert.equal(requests[0].method, 'POST')
    assert.equal(requests[1].method, 'PATCH')
    assert.deepEqual(JSON.parse(requests[1].body), { lon: 0, lat: 37 })
    assert.equal(requests[2].method, 'PUT')
    assert.deepEqual(JSON.parse(requests[2].body), { active: false, height: 0 })
  } finally { globalThis.fetch = originalFetch }
})

test('mutation errors distinguish permissions, missing devices and vendor failure', () => {
  assert.match(getDeviceMutationError({ response: { status: 403 } }, 'fallback'), /권한/)
  assert.match(getDeviceMutationError({ response: { status: 404 } }, 'fallback'), /장비를 찾을 수/)
  assert.match(getDeviceMutationError({ response: { status: 502 } }, 'fallback'), /연동 업체/)
  assert.equal(getDeviceMutationError(new Error('network'), '연결 실패'), '연결 실패')
})
