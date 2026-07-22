# 🗄️ 데이터베이스 스키마(Schema) 구축 가이드

### Step 1. Supabase 로그인

프로젝트 루트에서 다음 명령어를 실행하여 `supabase`에 로그인합니다.

```bash
npx supabase login
```

### Step 2. 원격 Supabase 프로젝트와 연결 (Link)

Supabase 대시보드 프로젝트 설정에서 Reference ID(Settings -> General -> Project ID)를 확인한 후, 아래 명령어로 연결합니다. (데이터베이스 비밀번호 입력 필요)

```bash
npx supabase link --project-ref <당신의_프로젝트_REFERENCE_ID>
```

### Step 3. 마이그레이션 파일 생성 (생략 가능)

아래 명령어를 실행하면 `supabase/migrations/` 폴더 내에 타임스탬프가 붙은 빈 `.sql` 파일이 생성됩니다.

```bash
npx supabase migration new create_initial_tables
```

### Step 4. DDL 스크립트 작성 (생략 가능)

생성된 `supabase/migrations/..._create_initial_tables.sql` 파일에 아래 내용을 복사해서 붙여넣습니다.

```sql
-- 1. portfolio_content 테이블 (Intro, About Me 관리 - 단일 레코드)
CREATE TABLE public.portfolio_content (
  id INT PRIMARY KEY,
  hero_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  profile_image_url TEXT,
  about_text TEXT NOT NULL,
  resume_url TEXT
);

-- 2. experiences 테이블 (경력/학력 섹션)
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  organization VARCHAR NOT NULL,
  description TEXT,
  tech_stacks TEXT[],
  details TEXT[],
  started_at DATE NOT NULL,
  ended_at DATE DEFAULT NULL
);

-- 3. tech_stacks 테이블 (기술스택 마스터)
CREATE TABLE public.tech_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  icon VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  level VARCHAR
);

-- 4. projects 테이블 (프로젝트 및 상세 정보 - JSONB 하이브리드)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  status VARCHAR NOT NULL,
  period VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  links JSONB,
  thumbnail_url TEXT NOT NULL,
  tech_stacks JSONB,
  images TEXT[],
  description TEXT,
  architecture JSONB,
  key_features JSONB,
  troubleshooting JSONB,
  retrospective TEXT,
  priority INT DEFAULT 0
);

-- 5. guestbook 테이블 (방명록)
CREATE TABLE public.guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR NOT NULL,
  password TEXT NOT NULL,
  content VARCHAR(200) NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. contact 테이블 (연락수단)
CREATE TABLE public.contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  icon VARCHAR NOT NULL,
  url TEXT NOT NULL,
  description TEXT
);
```

### Step 5. 원격 데이터베이스에 적용 (Push)

작성한 마이그레이션 파일을 원격 Supabase에 적용하여 테이블을 생성합니다.

```bash
npx supabase db push
```
