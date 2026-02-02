# 🎬 CineTicket - Full Stack Cinema Booking System

**CineTicket** is a modern, responsive web application for browsing movies, checking showtimes, and booking tickets with an interactive real-time seat selection system.

Built with **Go (Golang)** on the backend and **React (TypeScript)** on the frontend, utilizing a Clean Architecture approach.

![CineTicket Banner](https://via.placeholder.com/1000x400?text=CineTicket+Project+Preview)
*(Replace this link with your actual screenshot)*

## 🚀 Features

- **🔐 User Authentication:** Secure Login and Register system using **JWT**.
- **🎥 Movie Listing:** Browse current movies with details (poster, duration, description).
- **📅 Showtimes & Booking:** View available showtimes for specific movies.
- **💺 Interactive Seat Selection:**
    - Visual seating grid (50 seats).
    - Real-time status updates (Available/Booked/Selected).
    - Prevents double booking.
- **🎟️ User Profile:** "My Tickets" section to view purchased tickets with QR code simulation.
- **💳 Transaction Management:** Database transactions ensure data integrity during ticket purchase.
- **💅 Modern UI/UX:** Fully responsive design with **Tailwind CSS**, Toast notifications, and Loading states.

## 🛠️ Tech Stack

### Backend (Go)
- **Language:** Go (Golang)
- **Framework:** Gin Gonic (High-performance HTTP web framework)
- **Database:** PostgreSQL
- **ORM/Query Builder:** `sqlx` (Raw SQL power with struct mapping)
- **Auth:** JWT (JSON Web Tokens)
- **Architecture:** Layered (Handler -> Service -> Repository)

### Frontend (React)
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Context API (Auth), React Hooks
- **Routing:** React Router DOM v6
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📂 Project Structure

```bash
cineticket/
├── cineticket-api/         # 🔙 BACKEND (Go & SQL)
│   ├── cmd/api/            # Entry point (main.go)
│   ├── internal/
│   │   ├── handlers/       # HTTP Controllers (Login, Ticket, etc.)
│   │   ├── service/        # Business Logic Layer
│   │   ├── repository/     # Database Interactions (SQLx)
│   │   ├── middleware/     # Auth & CORS middlewares
│   │   └── models/         # Struct definitions
│   ├── go.mod              # Go dependencies
│   └── ...
│
├── cineticket-ui/          # 🎨 FRONTEND (React & Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Modal, MovieCard)
│   │   ├── pages/          # Pages (Home, Login, MovieDetail, MyTickets)
│   │   ├── services/       # API Fetch Functions
│   │   ├── context/        # Auth Context Provider
│   │   └── types/          # TypeScript Interfaces
│   ├── package.json        # NPM dependencies
│   └── ...
│
└── README.md               # Documentation