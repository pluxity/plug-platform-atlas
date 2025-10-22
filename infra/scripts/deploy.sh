#!/bin/bash

# 배포 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 기본 설정
ENVIRONMENT="${ENVIRONMENT:-development}"
IMAGE_NAME="${IMAGE_NAME:-plug-atlas-web}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
CONTAINER_NAME="${CONTAINER_NAME:-plug-atlas-web}"
PORT="${PORT:-8080}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}애플리케이션 배포${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}환경:${NC} ${ENVIRONMENT}"
echo -e "${GREEN}이미지:${NC} ${IMAGE_NAME}:${IMAGE_TAG}"
echo -e "${GREEN}컨테이너:${NC} ${CONTAINER_NAME}"
echo -e "${GREEN}포트:${NC} ${PORT}"
echo ""

# 기존 컨테이너 중지 및 제거
echo -e "${YELLOW}[1/3]${NC} 기존 컨테이너 정리..."
docker stop "${CONTAINER_NAME}" 2>/dev/null || true
docker rm "${CONTAINER_NAME}" 2>/dev/null || true
echo -e "${GREEN}✓ 정리 완료${NC}"
echo ""

# 새 컨테이너 실행
echo -e "${YELLOW}[2/3]${NC} 컨테이너 시작..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${PORT}:80" \
  "${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${GREEN}✓ 컨테이너 시작 완료${NC}"
echo ""

# 헬스체크
echo -e "${YELLOW}[3/3]${NC} 헬스체크..."
sleep 3

if curl -f http://localhost:${PORT}/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 애플리케이션 정상 실행 중${NC}"
else
    echo -e "${RED}❌ 헬스체크 실패${NC}"
    echo "로그 확인: docker logs ${CONTAINER_NAME}"
    exit 1
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ 배포 완료!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "접속 URL: http://localhost:${PORT}"
echo -e "로그 확인: docker logs -f ${CONTAINER_NAME}"
echo -e "컨테이너 중지: docker stop ${CONTAINER_NAME}"
