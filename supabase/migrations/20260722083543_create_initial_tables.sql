-- 0. ENUM 타입 생성 (tech_stacks, projects용)
CREATE TYPE public.tech_type_enum AS ENUM ('FRONTEND', 'BACKEND', 'INFRA', 'DATABASE', 'MOBILE', 'DEVOPS', 'AI_ML', 'TESTING');
CREATE TYPE public.tech_level_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE public.project_status_enum AS ENUM ('IN_PROGRESS', 'LIVE', 'COMPLETED');

-- 1. portfolio_content 테이블 (Intro, About Me 관리 - 단일 레코드)
CREATE TABLE public.portfolio_content (
  id INT PRIMARY KEY CHECK (id = 1),
  developer_role VARCHAR NOT NULL,
  hero_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  profile_image_url TEXT,
  about_text TEXT NOT NULL,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  ended_at DATE DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. tech_stacks 테이블 (기술스택 마스터)
CREATE TABLE public.tech_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  icon VARCHAR NOT NULL,
  color VARCHAR,
  type public.tech_type_enum NOT NULL,
  level public.tech_level_enum,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. projects 테이블 (프로젝트 및 상세 정보 - JSONB 하이브리드)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  status public.project_status_enum NOT NULL,
  started_at DATE NOT NULL,
  ended_at DATE DEFAULT NULL,
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
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

--  추가 설정 --

-- 1. moddatetime 확장 및 updated_at 트리거
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE TRIGGER handle_updated_at_portfolio_content
  BEFORE UPDATE ON public.portfolio_content
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_experiences
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_tech_stacks
  BEFORE UPDATE ON public.tech_stacks
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_guestbook
  BEFORE UPDATE ON public.guestbook
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_contact
  BEFORE UPDATE ON public.contact
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);

-- 2. 정렬 성능 최적화를 위한 인덱스(Index) 생성
CREATE INDEX idx_projects_priority ON public.projects (priority DESC);
CREATE INDEX idx_experiences_started_at ON public.experiences (started_at DESC);