# BookShelf Manager

A responsive MERN book library app built with React + Vite, Express, and MongoDB Atlas.

## Features
- Add, edit, delete books
- Mark books as read
- Search by title/author and filter by reading status
- Responsive Bookworm-inspired dashboard
- MongoDB persistence and API validation

## Local setup

### Backend
```bash
cd backend
npm install
copy .env.example .env
```
Set `MONGODB_URI` in `backend/.env`, then run `npm run dev`. The API defaults to `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
```
Create `frontend/.env` with `VITE_API_URL=http://localhost:5000`, then run `npm run dev`.

## Production
- Run backend with `npm start` and provide `MONGODB_URI` and `PORT` as environment variables.
- Build frontend using `npm run build`; serve the generated `frontend/dist` directory using your web server.
- Set `VITE_API_URL` to the backend origin before building the frontend (no trailing `/books`).
- Configure your production CORS policy to allow only your frontend domain before exposing the API publicly.
- Never commit `.env` files or secrets.
