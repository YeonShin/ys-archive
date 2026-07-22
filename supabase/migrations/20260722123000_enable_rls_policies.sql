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

-- guestbook: Anon 공개글(is_public = true)만 조회 허용
CREATE POLICY "Allow anon select public guestbook"
  ON public.guestbook FOR SELECT
  TO anon
  USING (is_public = true);

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
