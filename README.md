# Hospital Management System

A comprehensive hospital management application built with Node.js, Express, MongoDB, and React.js.

## Features

### User Roles
- **Doctors**: View patient profiles, medical history, reports, and prescriptions
- **Patients**: View their own medical reports and prescriptions
- **Admins**: Manage doctor profiles and system administration

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React.js
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
hospital-management/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database and server configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware (auth, validation)
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API route definitions
│   └── server.js          # Main server file
├── frontend/               # React.js application
│   ├── public/            # Static files
│   ├── src/              # React components and logic
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service functions
│   │   └── utils/        # Utility functions
│   └── package.json
└── package.json           # Root package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both backend and frontend
3. Set up environment variables
4. Start the development servers

### Environment Variables

Create `.env` files in both backend and frontend directories with the necessary configuration variables.