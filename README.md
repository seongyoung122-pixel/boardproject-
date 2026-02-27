# 캡처 기반 게시판 프로젝트

이미지(캡처) 첨부 기능이 있는 게시판 웹 애플리케이션입니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| Front-End | React 18 |
| Backend | Spring Boot 2.5.6, OpenJDK 17 |
| DB | PostgreSQL |
| App Server | Docker 기반 |
| 아키텍처 | 3-Tier (Web-WAS-DB) |

## 프로젝트 구조

```
boardproject/
├── backend/          # Spring Boot API 서버
├── frontend/         # React SPA
├── docker-compose.yml
└── README.md
```

## 실행 방법

### Docker Compose (권장)

```bash
docker-compose up -d
```

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080/api

### 로컬 개발

**1. PostgreSQL 실행** (Docker 또는 로컬 설치)

```bash
docker run -d --name board-db -e POSTGRES_DB=boarddb -e POSTGRES_USER=board -e POSTGRES_PASSWORD=board123 -p 5432:5432 postgres:15-alpine
```

**2. 백엔드 실행**

```bash
cd backend
mvn spring-boot:run
```

**3. 프론트엔드 실행**

```bash
cd frontend
npm install
npm start
```

프론트엔드는 http://localhost:3000 에서 실행되며, API 요청은 proxy를 통해 http://localhost:8080 으로 전달됩니다.

## 주요 기능

- 게시글 CRUD (생성, 조회, 수정, 삭제)
- 캡처/이미지 첨부 (다중 업로드)
- 검색 (제목, 내용, 작성자)
- 페이징

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/posts | 게시글 목록 (검색, 페이징) |
| GET | /api/posts/{id} | 게시글 상세 |
| POST | /api/posts | 게시글 작성 (multipart/form-data) |
| PUT | /api/posts/{id} | 게시글 수정 |
| DELETE | /api/posts/{id} | 게시글 삭제 |
| GET | /api/posts/captures/{fileName} | 첨부 이미지 조회 |
