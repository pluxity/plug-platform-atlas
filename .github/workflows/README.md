# GitHub Actions Workflows

## Archive Done Issues

매주 일요일 자정(UTC)에 Done 상태로 2주 이상 유지된 이슈/PR을 자동으로 Archive 상태로 이동시킵니다.

### 설정 방법

#### 1. Personal Access Token (PAT) 생성

GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)에서 새 토큰 생성:

**필요한 권한:**
- `repo` (Full control of private repositories)
- `read:org` (Read org and team membership)
- `project` (Full control of projects)
  - `read:project`
  - `write:project`

#### 2. Repository Secret 추가

1. Repository Settings > Secrets and variables > Actions로 이동
2. "New repository secret" 클릭
3. Name: `PROJECT_PAT`
4. Value: 위에서 생성한 PAT 토큰 입력
5. "Add secret" 클릭

#### 3. Project 설정 확인

Organization Project (번호: 11)에 다음 상태들이 있는지 확인:
- `Done` - 완료된 이슈
- `Archive` - 아카이빙할 이슈

### 동작 방식

1. 매주 일요일 00:00 UTC (한국시간 09:00)에 자동 실행
2. Done 상태인 모든 이슈/PR 조회
3. Done으로 변경된 지 2주(14일) 이상 경과한 항목 필터링
4. 해당 항목들을 Archive 상태로 변경

### 수동 실행

GitHub Actions 페이지에서 "Archive Done Issues" 워크플로우를 선택하고 "Run workflow" 버튼으로 수동 실행 가능

### 문제 해결

- **"Could not resolve to a ProjectV2"**: Organization 이름 또는 Project 번호 확인
- **"INSUFFICIENT_SCOPES"**: PAT 토큰의 권한 확인 (`project` 권한 필요)
- **"Secret not found"**: Repository Secrets에 `PROJECT_PAT`가 올바르게 추가되었는지 확인
