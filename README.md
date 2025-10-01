# Plug Platform Atlas

IoT 플랫폼 및 3D 지도 기반 통합 관제 시스템

## 🚀 Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Library**: Custom component library (@plug-atlas/ui)
- **3D Mapping**: Cesium.js (with World Terrain & 3D Tiles)
- **Backend**: Spring Boot API (external)

## 📦 Project Structure

```
plug-platform-atlas/
├── apps/
│   ├── a-iot/           # IoT monitoring application with 3D map
│   └── admin/           # Admin dashboard
├── packages/
│   ├── ui/              # Shared UI component library (Storybook)
│   ├── api-hooks/       # API client & React Query hooks
│   ├── types/           # Shared TypeScript types
│   └── web-core/        # Shared web/admin hooks & domain logic
└── pnpm-workspace.yaml
```

## 🛠️ Requirements

- **Node.js**: >=22.0.0
- **pnpm**: >=10.0.0

Install pnpm:
```bash
npm install -g pnpm@latest
```

Install dependencies:
```bash
pnpm install
```

## 🎮 Development

### Start IoT Application (with Cesium 3D Map)
```bash
pnpm dev
# or
pnpm a-iot dev
```

### Start Admin Application
```bash
pnpm admin dev
```

### Start Storybook (UI Library)
```bash
pnpm storybook
# or
pnpm ui storybook
```

## 📝 Available Scripts

### Root Level
- `pnpm dev` - Start a-iot dev server (default)
- `pnpm storybook` - Start Storybook for UI library
- `pnpm build` - Build all packages
- `pnpm lint` - Run linting across all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean all build artifacts and node_modules

### Package Shortcuts
- `pnpm a-iot <command>` - Run command in a-iot app
- `pnpm admin <command>` - Run command in admin app
- `pnpm ui <command>` - Run command in ui package

### Examples
```bash
pnpm a-iot build        # Build IoT app
pnpm admin dev          # Start admin dev server
pnpm ui docs:gen        # Generate UI documentation
```

## 🗺️ Cesium 3D Map Setup

The IoT application uses Cesium for 3D mapping with local 3D tilesets.

### Prerequisites
1. Cesium Ion access token (configured in `CesiumMap.tsx`)
2. Local nginx server serving 3D tileset at `http://localhost/seongnam/sn_3d/`

### Features
- World Terrain integration
- LOD (Level of Detail) optimization
- Camera-based lazy loading (loads tileset only when < 2km altitude)
- Dynamic visibility control based on camera height

## 🏗️ Building for Production

```bash
pnpm build
```

## 📚 UI Component Development

The project has a custom component library (`@plug-atlas/ui`) built with:
- Radix UI primitives
- Tailwind CSS v4
- Storybook 8.6

### Adding New Components
1. Create component in `packages/ui/src/[category]/`
2. Add Storybook stories
3. Add component description in stories meta
4. Generate docs: `pnpm ui docs:gen`

### Component Documentation
All components have auto-generated MDX documentation from Storybook stories.
View docs at: `http://localhost:6006` (when Storybook is running)

## 📄 License

MIT