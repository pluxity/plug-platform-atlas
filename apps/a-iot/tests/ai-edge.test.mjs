import test from 'node:test'
import assert from 'node:assert/strict'
import { cctvToDevice, micToDevice, getDevicePosition, getDeviceStatus, filterDevices, isDeviceCacheKey } from '../src/lib/ai-edge-device.ts'
import { ApiClient } from '../../../packages/api-hooks/src/client/client.ts'
import { getDeviceMutationError } from '../src/lib/device-mutation-error.ts'
import { normalizeFeatureResponse } from '../src/services/types/feature.ts'
import { getCoordinateEditState } from '../src/lib/ai-edge-device.ts'
import { getHeightEditState } from '../src/lib/sensor-edit.ts'
import { hasSensorMeasurement, isAiEdgeEvent, isSensorEvent, getEventSourceLabel } from '../src/lib/event-presentation.ts'
import { getEventMapTarget } from '../src/lib/event-map-target.ts'
import { fetchEvent } from '../src/lib/fetch-event.ts'
import { isEventListCacheKey, replaceCachedEvent } from '../src/lib/event-cache.ts'
import { useNotificationStore } from '../src/stores/notificationStore.ts'
import { countEventSummary } from '../src/lib/event-summary.ts'
import { getEventPageKey, flattenEventPages, createEventPageLoader } from '../src/lib/event-page.ts'

test('500 rapid scroll callbacks start one page request and do not queue more pages', async () => {
  const loadPage = createEventPageLoader()
  let calls = 0
  let finish
  const fetchPage = () => { calls++; return new Promise(resolve => { finish = resolve }) }
  const requests = Array.from({ length: 500 }, () => loadPage('park2:SENSOR:cursor20', fetchPage))
  await Promise.resolve()
  assert.equal(calls, 1)
  loadPage('park2:SENSOR:cursor40', fetchPage)
  assert.equal(calls, 1)
  finish()
  await Promise.all(requests)
  await loadPage('park2:SENSOR:cursor20', fetchPage)
  assert.equal(calls, 1)
  await loadPage('park2:SENSOR:cursor40', async () => { calls++ })
  assert.equal(calls, 2)
  await assert.rejects(loadPage('park3:SENSOR:cursor20', async () => { throw new Error('network') }))
  await loadPage('park3:SENSOR:cursor20', async () => { calls++ })
  assert.equal(calls, 3)
})
import { getRecentEventRange } from '../src/lib/event-date-range.ts'
import { mergeNotificationFeed } from '../src/lib/notification-feed.ts'

test('notification pages merge with live events, hide handled and expired events, and retain more than 50 items', () => {
  const range = getRecentEventRange(new Date(2026, 8, 21, 12))
  const event = (eventId, extra = {}) => ({ eventId, status: 'ACTIVE', occurredAt: '2026-09-20T10:00:00', ...extra })
  const notification = payload => ({ id: `event-${payload.eventId}`, type: 'sensor-alarm', payload, timestamp: new Date(payload.occurredAt) })
  const fetched = Array.from({ length: 60 }, (_, index) => event(index + 1))
  const live = [notification(event(1)), notification(event(61, { occurredAt: '2026-09-21T11:00:00' })),
    notification(event(62, { occurredAt: '2026-09-14T23:59:59' }))]
  const latest = new Map([[2, event(2, { status: 'RESOLVED' })], [3, event(3, { status: 'IN_PROGRESS' })]])
  const result = mergeNotificationFeed(fetched, live, latest, range)
  assert.equal(result.length, 59)
  assert.equal(result[0].eventId, 61)
  assert.equal(result.filter(item => item.eventId === 1).length, 1)
  assert.ok(!result.some(item => [2, 3, 62].includes(item.eventId)))
  assert.equal(mergeNotificationFeed([event(99, { status: 'RESOLVED' })], [], new Map(), range).length, 0)
})

test('dashboard lists and summary share seven calendar days including today across month boundaries', () => {
  const range = getRecentEventRange(new Date(2026, 8, 3, 12))
  assert.deepEqual(range, { from: '20260828000000', to: '20260903235959' })
  const next = new URL(getEventPageKey({ sourceType: 'SENSOR', ...range }, 20, 1,
    { hasNext: true, nextCursor: 8, nextStatus: 'RESOLVED' }), 'http://test')
  assert.equal(next.searchParams.get('from'), range.from)
  assert.equal(next.searchParams.get('to'), range.to)
  assert.notDeepEqual(getRecentEventRange(new Date(2026, 8, 4)), range)
})

test('event pagination requests 20 rows per source and carries both cursor fields within the selected park', () => {
  for (const sourceType of ['SENSOR', 'CCTV', 'MIC']) {
    const scope = { sourceType, siteId: 2 }
    const first = new URL(getEventPageKey(scope, 20, 0, null), 'http://test')
    assert.equal(first.searchParams.get('size'), '20')
    assert.equal(first.searchParams.get('sourceType'), sourceType)
    assert.equal(first.searchParams.get('siteId'), '2')
    const next = new URL(getEventPageKey(scope, 20, 1, { hasNext: true, nextCursor: 0, nextStatus: 'IN_PROGRESS' }), 'http://test')
    assert.equal(next.searchParams.get('lastId'), '0')
    assert.equal(next.searchParams.get('lastStatus'), 'IN_PROGRESS')
    assert.equal(getEventPageKey(scope, 20, 1, { hasNext: false }), null)
    assert.equal(getEventPageKey(scope, 20, 1, { hasNext: true, nextCursor: null }), null)
    const switched = new URL(getEventPageKey({ sourceType, siteId: 3 }, 20, 0, null), 'http://test')
    assert.equal(switched.searchParams.get('siteId'), '3')
    assert.equal(switched.searchParams.has('lastId'), false)
  }
})

test('loaded event pages exceed the former 50 row cap and deduplicate live cursor overlap', () => {
  const page = offset => ({ content: Array.from({ length: 20 }, (_, index) => ({ eventId: offset + index, status: 'ACTIVE' })) })
  const result = flattenEventPages([page(0), page(20), page(40), { content: [{ eventId: 1, status: 'RESOLVED' }] }])
  assert.equal(result.length, 60)
  assert.equal(result.find(event => event.eventId === 1).status, 'RESOLVED')
})

test('dashboard summary counts all server status groups, beyond one page and per event rather than device', () => {
  const active = Array.from({ length: 137 }, (_, eventId) => ({ eventId, deviceId: 'same-device' }))
  const resolved = Array.from({ length: 42 }, (_, eventId) => ({ eventId: 200 + eventId, occurredAt: '2020-01-01' }))
  assert.deepEqual(countEventSummary({ ACTIVE: active, IN_PROGRESS: [{ eventId: 180 }], RESOLVED: resolved }), {
    active: 137, inProgress: 1, resolved: 42, total: 180,
  })
  assert.deepEqual(countEventSummary({}), { active: 0, inProgress: 0, resolved: 0, total: 0 })
  assert.throws(() => countEventSummary({ ACTIVE: 20 }), /응답 형식/)
})

test('status socket messages remove handled alarms and never create non-ACTIVE alerts', () => {
  const store = useNotificationStore.getState()
  const alarm = (eventId, status) => ({ id: `event-${eventId}`, type: 'sensor-alarm', timestamp: new Date(), payload: { eventId, status } })
  store.clearNotifications()
  try {
    store.addNotification(alarm(1, 'ACTIVE'))
    store.addNotification(alarm(1, 'ACTIVE'))
    assert.equal(useNotificationStore.getState().notifications.length, 1)
    store.addNotification(alarm(2, 'ACTIVE'))
    store.addNotification(alarm(1, 'IN_PROGRESS'))
    assert.equal(useNotificationStore.getState().unreadCount, 1)
    assert.deepEqual(useNotificationStore.getState().notifications.map(n => n.eventId), [2])
    store.addNotification(alarm(2, 'RESOLVED'))
    store.addNotification(alarm(3, 'RESOLVED'))
    assert.equal(useNotificationStore.getState().notifications.length, 0)
    assert.equal(useNotificationStore.getState().unreadCount, 0)
    store.setNotifications([alarm(1, 'ACTIVE'), alarm(2, 'IN_PROGRESS'), alarm(3, 'RESOLVED')])
    assert.equal(useNotificationStore.getState().notifications.length, 1)
  } finally {
    store.clearNotifications()
  }
})

test('completed events update dashboard and paginated list caches without mutating old data', () => {
  const original = { eventId: 7, status: 'ACTIVE' }
  const other = { eventId: 8, status: 'IN_PROGRESS' }
  const completed = { eventId: 7, status: 'RESOLVED', updatedBy: 'operator' }
  const page = { content: [original, other], hasNext: true, nextCursor: 8 }
  assert.deepEqual(replaceCachedEvent([original, other], completed), [completed, other])
  assert.deepEqual(replaceCachedEvent([page], completed), [{ ...page, content: [completed, other] }])
  assert.equal(original.status, 'ACTIVE')
  assert.equal(page.content[0], original)
  assert.equal(replaceCachedEvent(undefined, completed), undefined)
  for (const key of ['events', 'events?sourceType=SENSOR&siteId=2', 'events?sourceType=CCTV', 'events?sourceType=MIC', '$inf$events?size=10']) {
    assert.equal(isEventListCacheKey(key), true)
  }
  for (const key of ['events/time-series', 'events/7/action-histories', 'cctvs', ['event-detail', 7]]) {
    assert.equal(isEventListCacheKey(key), false)
  }
})

test('event detail reload follows the resolved cursor page after action history changes server status', async () => {
  let saved = false
  const paths = []
  const client = { get: async path => {
    paths.push(path)
    const query = new URL(path, 'http://test').searchParams
    assert.equal(query.get('sourceType'), 'SENSOR')
    assert.equal(query.get('siteId'), '2')
    assert.equal(query.has('status'), false)
    if (!saved) return { data: { content: [{ eventId: 7, status: 'ACTIVE' }], hasNext: false } }
    if (!query.has('lastId')) return { data: { content: [{ eventId: 8, status: 'ACTIVE' }], hasNext: true, nextCursor: 8, nextStatus: 'ACTIVE' } }
    assert.equal(query.get('lastStatus'), 'ACTIVE')
    return { data: { content: [{ eventId: 7, status: 'RESOLVED' }], hasNext: false } }
  } }
  assert.equal((await fetchEvent(client, 7, { sourceType: 'SENSOR', siteId: 2 })).status, 'ACTIVE')
  saved = true
  assert.equal((await fetchEvent(client, 7, { sourceType: 'SENSOR', siteId: 2 })).status, 'RESOLVED')
  assert.ok(paths.every(path => path.startsWith('events?')))
})

test('event detail reports missing events and rejects repeated cursors', async () => {
  await assert.rejects(fetchEvent({ get: async () => ({ data: { content: [], hasNext: false } }) }, 7), /찾을 수 없습니다/)
  await assert.rejects(fetchEvent({ get: async () => ({ data: { content: [], hasNext: true, nextCursor: 8, nextStatus: 'ACTIVE' } }) }, 7), /반복/)
})

test('event navigation matches both park and source, then falls back to event coordinates', () => {
  const sensor = { deviceId: 'shared', siteResponse: { id: 2 }, longitude: 127, latitude: 37 }
  const devices = [
    { kind: 'CCTV', externalId: 'shared', site: { id: 2 }, position: { longitude: 128, latitude: 38 } },
    { kind: 'MIC', externalId: 'shared', site: { id: 2 }, position: { longitude: 129, latitude: 39 } },
  ]
  const event = { deviceId: 'shared', siteId: 2, longitude: 126, latitude: 36 }
  assert.deepEqual(getEventMapTarget({ ...event, sourceType: 'SENSOR' }, [sensor], devices), { longitude: 127, latitude: 37 })
  assert.deepEqual(getEventMapTarget({ ...event, sourceType: 'CCTV' }, [sensor], devices), devices[0].position)
  assert.deepEqual(getEventMapTarget({ ...event, sourceType: 'MIC' }, [sensor], devices), devices[1].position)
  assert.deepEqual(getEventMapTarget({ ...event, sourceType: 'SENSOR', siteId: 3 }, [sensor], devices), { longitude: 126, latitude: 36 })
  assert.equal(getEventMapTarget({ ...event, sourceType: 'MIC', siteId: 3, longitude: null, latitude: null }, [sensor], devices), null)
})

test('mixed incident feeds separate IoT sensors from CCTV and MIC events', () => {
  const events = [
    { sourceType: 'SENSOR', eventId: 1 },
    { sourceType: 'CCTV', eventId: 2 },
    { sourceType: 'MIC', eventId: 3 },
    { eventId: 4 },
    { sourceType: 'UNKNOWN', eventId: 5 },
  ]
  assert.deepEqual(events.filter(isSensorEvent).map(event => event.eventId), [1, 4])
  assert.deepEqual(events.filter(isAiEdgeEvent).map(event => event.eventId), [2, 3])
  assert.equal(getEventSourceLabel(events[0]), 'IoT 센서')
  assert.equal(getEventSourceLabel(events[1]), 'AI EDGE · CCTV')
  assert.equal(getEventSourceLabel(events[2]), 'AI EDGE · MIC')
})

test('AI EDGE common event details never display sensor measurements, including numeric placeholders', () => {
  for (const sourceType of ['CCTV', 'MIC']) {
    assert.equal(isAiEdgeEvent({ sourceType }), true)
    for (const value of [0, 1, 42, null, undefined]) {
      assert.equal(hasSensorMeasurement({ sourceType, value }), false)
    }
  }
  for (const sourceType of ['SENSOR', null, undefined]) {
    assert.equal(isAiEdgeEvent({ sourceType }), false)
    assert.equal(hasSensorMeasurement({ sourceType, value: 0 }), true)
    assert.equal(hasSensorMeasurement({ sourceType, value: 12.5 }), true)
    for (const value of [null, undefined, NaN, Infinity, '12']) {
      assert.equal(hasSensorMeasurement({ sourceType, value }), false)
    }
  }
})

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
