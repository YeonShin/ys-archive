# 📦 Supabase Storage (`portfolio-assets`) 세팅 가이드

포트폴리오 웹사이트에 사용되는 미디어 에셋(프로필 사진, 이력서 PDF, 프로젝트 이미지 등)을 위한 마이그레이션 SQL 파일을 통해 버킷 생성, RLS 정책, 하위 폴더 생성을 한 번에 진행하는 방법에 대해 설명합니다.

### 1. 마이그레이션 파일 내용 설명

```sql
-- ========================================================
-- 1. portfolio-assets Public 버킷 생성
-- ========================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  TRUE,
  10485760, -- 10MB 용량 제한
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- 2. Public Read (모든 외부 방문자 읽기 전용) RLS 정책 설정
-- ========================================================
CREATE POLICY "Public Read Access for portfolio-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

-- 서비스 롤 또는 인증된 관리자만 CUD(업로드/수정/삭제) 가능하도록 설정
CREATE POLICY "Admin Insert Access for portfolio-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Update Access for portfolio-assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Access for portfolio-assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

-- ========================================================
-- 3. 하위 계층 디렉토리 구조 자동 생성 (.keep 더미 생성)
-- ========================================================
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES
  ('portfolio-assets', 'profile/.keep', NULL, '{"mimetype": "text/plain"}'),
  ('portfolio-assets', 'resumes/.keep', NULL, '{"mimetype": "text/plain"}'),
  ('portfolio-assets', 'projects/.keep', NULL, '{"mimetype": "text/plain"}')
ON CONFLICT (bucket_id, name) DO NOTHING;
```

---

### 2. Supabase 원격 DB에 스토리지 설정 적용 (DB Push)

마이그레이션 파일(`*_setup_storage_bucket.sql`)을 원격 Supabase 프로젝트에 푸시하여 버킷과 RLS 정책, 디렉토리를 즉시 적용합니다.

```bash
# 1. Supabase 로그인 상태 확인 (필요 시 실행)
npx supabase login

# 2. 원격 프로젝트 연결 확인 (필요 시 실행)
npx supabase link --project-ref <YOUR_PROJECT_REFERENCE_ID>

# 3. 원격 데이터베이스 및 스토리지에 마이그레이션 적용 (Push)
npx supabase db push
```

### 3. 에셋 퍼블릭 접근 URL 예시

푸시 완료 후 업로드된 미디어 에셋은 아래 URL 형식으로 외부 누구나 무료로 접근 및 웹 렌더링이 가능합니다:

```text
https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio-assets/profile/avatar.webp
https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio-assets/resumes/resume.pdf
https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio-assets/projects/thumbnail.png
```
