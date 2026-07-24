# 📁 YS-Archive

> **프론트엔드 개발자 김연신의 포트폴리오 & 개인 아카이빙 플랫폼**

`YS-Archive`는 개인 프로젝트, 기술 스택, 경력 사항을 한눈에 확인할 수 있도록 제작된 반응형 포트폴리오 웹사이트입니다.

<br/>

## 🛠️ 기술 스택 (Tech Stack)

### Core

- **Framework**: Next.js 16.2 (App Router)
- **Library**: React 19
- **Language**: TypeScript

### Styling & UI

- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI, Radix UI
- **Icons**: React Icons, Lucide React
- **Animation**: Motion (Framer Motion v12)

### Database & Package Manager

- **Backend / DB**: Supabase
- **Package Manager**: pnpm

<br/>

## 🚀 시작하기 (Getting Started)

### 1. 레포지토리 클론

```bash
git clone https://github.com/YeonShin/ys-archive.git
cd ys-archive
```

2. 패키지 설치

```bash
pnpm install
```

3. 개발 서버 실행

```bash
pnpm dev
브라우저에서 http://localhost:3000 접속
```

📁 프로젝트 구조 (Directory Structure)

```bash
src/
├── app/                  # Next.js App Router (페이지 레이아웃 및 진입점)
├── components/           # 공통 UI 컴포넌트 (Button, Sheet, ThemeToggle, Footer 등)
├── features/             # 도메인별 피처 모듈 (Feature-driven Architecture)
│   └── portfolio/        # 포트폴리오 관련 컴포넌트 및 상수
├── hooks/                # 공통 커스텀 훅 (useActiveSection 등)
├── lib/                  # 유틸리티 함수 (cn, supabase client 등)
└── providers/            # Context Provider (ThemeProvider 등)
```
