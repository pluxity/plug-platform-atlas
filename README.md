# Plug Platform Atlas

실외 지도 기반 관제 시스템

## 🚀 Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React 19
- **Build Tool**: Vite (latest)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Backend**: Spring Boot API (external)

## 📦 Project Structure

```
plug-platform-atlas/
├── apps/
│   └── web/              # Main web application
├── packages/
│   ├── ui/              # Shared UI components
│   ├── types/           # Shared TypeScript types
│   └── config/          # Shared configuration
└── pnpm-workspace.yaml   # Workspace configuration
```

## 🛠️ Installation

Make sure you have pnpm installed:
```bash
npm install -g pnpm
```

Install dependencies:
```bash
pnpm install
```

## 🎮 Development

Start the development server:
```bash
pnpm dev
```

The app will be available at http://localhost:3000

## 📝 Available Scripts

- `pnpm dev` - Start development server for web app
- `pnpm build` - Build all packages
- `pnpm preview` - Preview production build
- `pnpm lint` - Run linting across all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean all build artifacts and node_modules

## 🏗️ Building for Production

```bash
pnpm build
```

## 🔧 Adding shadcn/ui Components

The project is configured with shadcn/ui. To add new components:

```bash
cd apps/web
npx shadcn@latest add [component-name]
```

## 📄 License

MIT