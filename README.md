# ADA Hub

직접 만든 앱과 외부 앱의 링크 및 등록 정보를 관리하는 앱 허브입니다.

- 앱 이름, 제작자, 주소, 소스 저장소 링크, 설명, 출처, 분류 등록
- 등록 정보의 개별·일괄 수정, 검색, 즐겨찾기, 보관 및 복원
- Google 계정 또는 휴대전화 SMS 인증, 가입 신청 및 최종관리자 승인
- 앱 주소의 아이콘 자동 표시, 대표 이미지 주소 직접 지정 및 미리보기

개별 수정은 ADA의 등록 정보만 변경합니다. 연결된 앱의 소스를 수정하거나 프로그램을 실행하지 않습니다. 로컬 소스 연결, 코덱 실행, 수정 작업 API, 자동 빌드 기능은 제거했습니다. 소스 저장소 주소는 링크로만 사용합니다.

## 실행

운영 주소: https://ada.crucify87.workers.dev/

Windows에서는 상위 폴더의 Start-ADA.ps1을 실행하고 http://127.0.0.1:3002 로 접속합니다. 아래 Firebase 연결 설정이 필요합니다. 로컬 서버는 정적 화면 제공용이며 파일 쓰기나 명령 실행 API를 제공하지 않습니다. 과거 .ada 폴더의 연결·작업 이력은 읽거나 실행하지 않습니다.

개발: 의존성 설치 후 npm run dev 또는 pnpm dev (기본 포트 3000).

검증: 타입 검사(tsc --noEmit), node --test tests/server.test.mjs, npm run build.

빌드는 dist/와 로컬 실행용 ada-entry.html을 갱신합니다. Cloudflare는 GitHub crucify87/ADA의 main 브랜치에서 빌드 후 wrangler.jsonc의 정적 자산 설정으로 배포합니다.

## 로그인 및 최종관리자 설정

1. Firebase 프로젝트에서 웹 앱과 Cloud Firestore를 생성합니다. Authentication에서 Google 및 전화번호 로그인을 활성화합니다. 운영 도메인을 승인된 도메인에 추가하고 문자 인증을 사용할 국가의 SMS 정책과 결제 요건을 확인합니다. 개발 중 SMS 흐름은 Firebase 테스트 전화번호 또는 Authentication 에뮬레이터로 검증할 수 있습니다.
2. 웹 앱 설정을 .env.example에 표시된 네 가지 VITE_FIREBASE 변수에 입력합니다. 로컬은 .env.local, 운영은 Cloudflare Workers Builds 환경 변수를 사용합니다. Firebase 웹 앱 설정값만 사용합니다.
3. Firebase CLI에서 대상 프로젝트를 지정해 firestore.rules를 배포합니다. 공유 프로젝트에서는 적용 전에 기존 규칙과 병합하세요.

       firebase deploy --only firestore:rules --project <Firebase 프로젝트 ID>

4. 최종관리자가 Google 계정으로 로그인합니다. Firebase Console의 Authentication 사용자 목록에서 해당 UID를 확인하고, Firestore Console에서 admins 컬렉션에 문서 ID가 그 UID인 문서를 만듭니다. 문서에는 enabled 필드를 true로 넣을 수 있으며 권한은 문서의 존재 여부로 판단합니다. 관리자 권한을 회수하려면 해당 문서를 삭제합니다.
5. 최종관리자는 다시 접속해 **회원 관리**에서 가입 신청을 승인하거나 반려하고, 승인 회원의 이용을 정지하거나 재개할 수 있습니다. 운영 배포 전 별도 테스트 계정으로 Google 로그인, SMS 로그인, 가입 승인 및 정지 흐름을 확인합니다.

앱은 승인된 계정별로 저장됩니다. Google 로그인과 SMS 로그인은 각각 별도 계정입니다. 이전에 저장한 앱은 같은 브라우저와 주소에서 로그인한 후 **기존 앱 가져오기**로 현재 계정에 복사할 수 있습니다.
