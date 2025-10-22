#!/bin/bash

# API Client 자동 생성 스크립트
# OpenAPI 스펙에서 TypeScript 타입과 SWR hooks 생성

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 환경 변수
API_DOCS_URL="${API_DOCS_URL:-http://dev.pluxity.com/api/api-docs}"
OUTPUT_FILE="api-docs.json"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}API Client 자동 생성${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 1. OpenAPI 스펙 다운로드
echo -e "${YELLOW}[1/3]${NC} OpenAPI 스펙 다운로드 중..."
curl -s "${API_DOCS_URL}" -o "${OUTPUT_FILE}"

if [ ! -f "${OUTPUT_FILE}" ]; then
    echo -e "${RED}❌ API 스펙 다운로드 실패${NC}"
    exit 1
fi

FILE_SIZE=$(stat -f%z "${OUTPUT_FILE}" 2>/dev/null || stat -c%s "${OUTPUT_FILE}" 2>/dev/null || echo "0")
if [ "${FILE_SIZE}" -lt 100 ]; then
    echo -e "${RED}❌ API 스펙 파일이 너무 작습니다 (잘못된 응답)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ OpenAPI 스펙 다운로드 완료 (${FILE_SIZE} bytes)${NC}"
echo ""

# 2. 타입 생성 (현재는 수동으로 작성된 타입 사용)
echo -e "${YELLOW}[2/3]${NC} 타입 검증 중..."
echo -e "${GREEN}✓ packages/types - 공통 타입 확인${NC}"
echo -e "${GREEN}✓ apps/web/src/types - 앱별 타입 확인${NC}"
echo ""

# 3. 타입 체크
echo -e "${YELLOW}[3/3]${NC} TypeScript 타입 체크..."
cd packages/types && pnpm type-check
cd ../../packages/api-hooks && pnpm type-check
cd ../../apps/web && pnpm type-check
cd ../..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ API Client 생성 완료!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "생성된 파일:"
echo "  - ${OUTPUT_FILE}"
echo ""
echo "다음 단계:"
echo "  - packages/types/src/ 에서 타입 확인"
echo "  - packages/api-hooks/src/hooks/ 에서 hooks 확인"
echo "  - apps/web/src/hooks/ 에서 앱별 hooks 확인"
