# Visitor Check-In Web Application

Full-stack visitor reception and interview application built with Next.js (JavaScript), Express, MongoDB/Mongoose, Cloudinary, React Hook Form and Tailwind CSS.

## Features

- QR code on `/` pointing to `/visit`
- Purpose selection: Interview / Business Meeting
- Camera-only visitor/candidate photo capture
- Interview application with dynamic skills, AI tools, previous companies, appraisal history and references
- Device resume upload: PDF/DOC/DOCX, max 10 MB
- Google Drive UI with "feature not implemented" modal only
- Business meeting employee search
- Cloudinary image/resume storage
- MongoDB persistence
- Simple admin login with HttpOnly JWT cookie
- Read-only admin views for interviews and business meetings
- Helmet, CORS, rate limiting, backend validation and file limits
- Responsive mobile-first UI based on the supplied screenshots

## Run locally

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Set `MONGODB_URI`, Cloudinary credentials, admin credentials and `JWT_SECRET` in `.env`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Frontend environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_VISITOR_URL=http://localhost:3000/visit
```

For production, replace both values with deployed HTTPS URLs.

## Production notes

1. Use MongoDB Atlas.
2. Create a Cloudinary account and set all three Cloudinary environment variables.
3. Deploy the frontend to Vercel or another Next.js host.
4. Deploy the backend to Render/Railway/Fly.io/etc.
5. Set `CLIENT_URL` to the frontend origin.
6. Set `secure: true` for production cookies (already controlled by `NODE_ENV=production`).
7. Keep all secrets only in backend environment variables.
8. Seed employee records once with `npm run seed`.

## Routes

- `/` QR landing page
- `/visit` purpose selection
- `/visit/interview` interview form
- `/visit/business-meeting` business meeting form
- `/visit/success` success page
- `/admin/login` admin login
- `/admin` admin dashboard

## API

- `POST /api/interviews`
- `GET /api/interviews` (admin)
- `GET /api/interviews/:id` (admin)
- `POST /api/business-meetings`
- `GET /api/business-meetings` (admin)
- `GET /api/business-meetings/:id` (admin)
- `GET /api/employees?search=`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`



