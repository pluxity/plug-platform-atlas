#!/bin/bash

# Docker 이미지 푸시 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 기본 설정
REGISTRY="${REGISTRY:-}"
IMAGE_NAME="${IMAGE_NAME:-plug-atlas-web}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# 레지스트리가 설정되어 있으면 이미지에 추가
if [ -n "${REGISTRY}" ]; then
    FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
else
    FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Docker 이미지 푸시${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}이미지:${NC} ${FULL_IMAGE_NAME}"
echo ""

# 레지스트리 로그인 확인
if [ -n "${REGISTRY}" ]; then
    echo -e "${YELLOW}레지스트리 로그인 확인...${NC}"
    # 필요시 docker login 수행
    # docker login ${REGISTRY}
fi

# 이미지 태그 (레지스트리가 있는 경우)
if [ -n "${REGISTRY}" ]; then
    echo -e "${YELLOW}이미지 태그 추가...${NC}"
    docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${FULL_IMAGE_NAME}"
fi

# 이미지 푸시
echo -e "${YELLOW}이미지 푸시 중...${NC}"
docker push "${FULL_IMAGE_NAME}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ 푸시 완료!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "푸시된 이미지: ${FULL_IMAGE_NAME}"
