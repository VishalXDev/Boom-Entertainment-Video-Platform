# BOOM Entertainment Frontend

This is the frontend application for BOOM Entertainment built with Next.js and React.

## Features

- User Authentication (Register, Login, Logout) with JWT
- User Profile displaying username, email, wallet balance
- Display uploaded videos and purchased videos
- Wallet page to add funds and view transaction history
- Uses Axios with token interceptor for API requests

## Requirements

- Node.js v16 or higher
- Backend API running and accessible

## Setup Instructions

1. Clone the repository and navigate to the frontend folder:

```bash
cd frontend
Install dependencies:

bash
Copy code
npm install
Create a .env.local file in the frontend folder with the backend URL:

ini
Copy code
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
Run the development server:

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser.

Environment Variables
NEXT_PUBLIC_BACKEND_URL — URL of the backend API server

Scripts
npm run dev — Start development server

npm run build — Build production app

npm start — Start production server

Notes
The app uses an Axios instance configured to automatically include JWT token stored in localStorage.

Make sure your backend API server is running and accessible.

License
MIT

yaml
Copy code

---

If you want, I can help you create the **root README.md** or the backend README.md too!