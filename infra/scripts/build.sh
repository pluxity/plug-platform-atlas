#!/bin/bash

# Docker 이미지 빌드 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 기본 설정
IMAGE_NAME="${IMAGE_NAME:-plug-atlas-web}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
DOCKERFILE="${DOCKERFILE:-infra/docker/Dockerfile}"
BUILD_CONTEXT="${BUILD_CONTEXT:-.}"

# Build arguments
VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://dev.pluxity.com/api}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Docker 이미지 빌드${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}이미지:${NC} ${IMAGE_NAME}:${IMAGE_TAG}"
echo -e "${GREEN}Dockerfile:${NC} ${DOCKERFILE}"
echo -e "${GREEN}Context:${NC} ${BUILD_CONTEXT}"
echo -e "${GREEN}API URL:${NC} ${VITE_API_BASE_URL}"
echo ""

# 빌드 시작 시간
START_TIME=$(date +%s)

# Docker 빌드
echo -e "${YELLOW}빌드 시작...${NC}"
docker build \
  --file "${DOCKERFILE}" \
  --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
  --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
  --progress=plain \
  "${BUILD_CONTEXT}"

# 빌드 완료 시간
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ 빌드 완료!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "소요 시간: ${DURATION}초"
echo -e "이미지: ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "다음 단계:"
echo "  - 로컬 테스트: docker run -p 8080:80 ${IMAGE_NAME}:${IMAGE_TAG}"
echo "  - 이미지 푸시: ./infra/scripts/push.sh"
