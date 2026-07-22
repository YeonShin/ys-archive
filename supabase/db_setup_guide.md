# 🗄️ Supabase 데이터베이스 및 스토리지 구축 가이드

포트폴리오 서비스에 필요한 Supabase PostgreSQL 데이터베이스 스키마, Row Level Security(RLS) 보안 정책, 및 Storage 버킷 등 설정을 Supabase CLI 마이그레이션을 통해 원격 데이터베이스에 적용하는 통합 세팅 가이드입니다.

---

## 🚀 1. 기본 설정 및 적용 방법 (Supabase CLI)

### Step 1. Supabase 로그인

프로젝트 루트에서 다음 명령어를 실행하여 Supabase에 로그인합니다.

```bash
npx supabase login
```

### Step 2. 원격 Supabase 프로젝트 연결 (Link)

Supabase 대시보드 프로젝트 설정에서 Reference ID(Settings -> General -> Project ID)를 확인한 후 원격 프로젝트와 연결합니다. (데이터베이스 비밀번호 입력 필요)

```bash
npx supabase link --project-ref <당신의_프로젝트_REFERENCE_ID>
```

### Step 3. 원격 데이터베이스 및 스토리지 일괄 적용 (Push)

작성된 마이그레이션 SQL 파일들을 원격 Supabase 프로젝트에 적용합니다.

```bash
npx supabase db push
```

---

## 📊 데이터베이스 스키마 및 RLS 접근 제어 정책

마이그레이션 파일(`20260722083543_create_initial_tables.sql`, `20260722123000_enable_rls_policies.sql`)을 통해 데이터베이스 스키마와 RLS 정책이 적용됩니다.

### 6개 핵심 테이블 구조

1. `portfolio_content`: 메인 프로필 및 소개 정보 (단일 레코드)
2. `experiences`: 경력 및 학력 목록
3. `tech_stacks`: 기술 스택 마스터 정보
4. `projects`: 프로젝트 목록 및 상세 정보 (JSONB 하이브리드)
5. `guestbook`: 방문자 방명록
6. `contact`: 연락처 및 소셜 링크

### RLS (Row Level Security) 접근 제어 정책 매트릭스

1. **익명 사용자 (`anon`)**:
   - `portfolio_content`, `experiences`, `tech_stacks`, `projects`, `contact`: `SELECT` (읽기 전용)
   - `guestbook`: 공개글(`is_public = true`) `SELECT` 및 비회원 방명록 `INSERT` (작성 허용)
2. **인증된 관리자 (`authenticated`)**:
   - 6개 전체 테이블: `ALL` (Insert / Update / Delete / Select 전체 관리 권한)

---

## 📦 Supabase Storage (`portfolio-assets`) 설정

마이그레이션 파일(`20260722113500_setup_storage_bucket.sql`)을 통해 미디어 에셋용 Storage 버킷과 폴더 구조가 자동 세팅됩니다.

### 버킷 및 스토리지 RLS 정책 명세

- **버킷명**: `portfolio-assets` (Public 버킷)
- **용량 제한**: 10MB (`10485760` bytes)
- **허용 MIME 타입**: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `application/pdf`
- **권한 제어**:
  - 누구나 퍼블릭 URL을 통해 미디어 파일 조회 가능 (Public Bucket)
  - 인증된 관리자(`authenticated`)만 파일 업로드/수정/삭제 가능
- **기본 디렉토리 구조**:
  - `profile/`: 프로필 이미지
  - `resumes/`: 이력서 PDF 파일
  - `projects/`: 프로젝트 썸네일 및 갤러리 이미지

### 퍼블릭 접근 URL 형식 예시

```text
https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio-assets/profile/avatar.webp
https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio-assets/resumes/resume.pdf
https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio-assets/projects/thumbnail.png
```
