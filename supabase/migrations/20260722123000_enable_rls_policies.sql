-- ========================================================
-- 0. 테이블 기본 접근 권한 (GRANT)
-- ========================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- anon(익명 사용자): SELECT(조회) 및 guestbook INSERT(방명록 작성) 권한 부여
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON public.guestbook TO anon;

-- authenticated(관리자): 전체 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ========================================================
-- 1. 전체 6개 테이블 Row Level Security (RLS) 활성화
-- ========================================================
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- 2. 퍼블릭 읽기(Anon Select) 정책 설정
-- ========================================================

-- portfolio_content: Anon 조회 허용
CREATE POLICY "Allow anon select on portfolio_content"
  ON public.portfolio_content FOR SELECT
  TO anon
  USING (true);

-- experiences: Anon 조회 허용
CREATE POLICY "Allow anon select on experiences"
  ON public.experiences FOR SELECT
  TO anon
  USING (true);

-- tech_stacks: Anon 조회 허용
CREATE POLICY "Allow anon select on tech_stacks"
  ON public.tech_stacks FOR SELECT
  TO anon
  USING (true);

-- projects: Anon 조회 허용
CREATE POLICY "Allow anon select on projects"
  ON public.projects FOR SELECT
  TO anon
  USING (true);

-- contact: Anon 조회 허용
CREATE POLICY "Allow anon select on contact"
  ON public.contact FOR SELECT
  TO anon
  USING (true);

-- ========================================================
-- 3. guestbook 전용 정책 (Anon Insert & is_public 조건부 Select)
-- ========================================================

-- anon 사용자가 guestbook 원본 테이블을 직접 조회할 수 없도록 권한 회수
REVOKE SELECT ON public.guestbook FROM anon;

-- 원본 테이블 대신 조회할 수 있는 마스킹 전용 View 생성
CREATE OR REPLACE VIEW public.guestbook_public_view AS
SELECT 
  id,
  nickname,
  -- is_public이 true면 원본 노출, false면 마스킹 텍스트 노출
  CASE 
    WHEN is_public = true THEN content 
    ELSE '비공개로 작성된 글입니다.' 
  END as content,
  is_public,
  created_at,
  updated_at
FROM public.guestbook;

-- 생성된 view에 조회 권한 부여
GRANT SELECT ON public.guestbook_public_view TO anon;

-- guestbook: Anon 방명록 작성(Insert) 허용
CREATE POLICY "Allow anon insert on guestbook"
  ON public.guestbook FOR INSERT
  TO anon
  WITH CHECK (true);

-- ========================================================
-- 4. 관리자(Authenticated) 대상 전체 테이블 ALL 관리 권한 정책
-- ========================================================

CREATE POLICY "Allow authenticated full access on portfolio_content"
  ON public.portfolio_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on experiences"
  ON public.experiences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on tech_stacks"
  ON public.tech_stacks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on guestbook"
  ON public.guestbook FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on contact"
  ON public.contact FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
