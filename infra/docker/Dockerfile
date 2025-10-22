# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-alpine AS deps

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@10.9.0 --activate

# package.json 복사 (monorepo 전체)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/api-hooks/package.json ./packages/api-hooks/
COPY packages/ui/package.json ./packages/ui/
COPY apps/web/package.json ./apps/web/

# 의존성 설치 (프로덕션만)
RUN pnpm install --frozen-lockfile --prod=false

# ============================================
# Stage 2: Build
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@10.9.0 --activate

# dependencies에서 node_modules 복사
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps ./apps

# 소스 코드 복사
COPY . .

# 환경 변수 (빌드 시점)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# packages 빌드 (types, ui는 빌드 없이 사용)
# apps/web 빌드
WORKDIR /app/apps/web
RUN pnpm build

# ============================================
# Stage 3: Production
# ============================================
FROM nginx:1.27-alpine AS production

# Nginx 설정 복사
COPY infra/docker/nginx.conf /etc/nginx/nginx.conf
COPY infra/config/nginx/*.conf /etc/nginx/conf.d/

# 빌드된 정적 파일 복사
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
