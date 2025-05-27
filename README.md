# BOOM Entertainment Full-Stack Project

This repository contains the full-stack application for BOOM Entertainment, a social streaming platform with user authentication, video upload, wallet system, and more.

## Project Structure

- `/backend` — Express.js REST API server
- `/frontend` — Next.js React frontend app

## Features

- User authentication (register, login, logout)
- Video upload and management (short and long-form)
- Wallet with transaction history and adding funds
- User profile page with uploaded and purchased videos
- Protected routes with JWT authentication
- Commenting and gifting system (optional)

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- MongoDB (local or cloud)

### Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your environment variables
npm run dev
