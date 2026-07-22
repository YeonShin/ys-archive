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

### Step 3. 원격 데이터베이스에 적용

마이그레이션 sql 파일을 원격 Supabase에 적용하여 테이블을 생성합니다.

```bash
npx supabase db push
```
