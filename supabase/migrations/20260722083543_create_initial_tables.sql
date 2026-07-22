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