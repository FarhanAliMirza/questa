# Questa

Questa is a modern quiz application built with Next.js, TypeScript, and Prisma, featuring a robust backend API and an intuitive frontend interface.

The application will be available at:

- Frontend: https://questa-blue.vercel.app

## 🔐 Demo Access

Demo credentials will be provided here:

```
Email: jhon@me.com
Password: hello1234
```

## 📝 Quiz Link

Access the demo quiz here: https://questa-blue.vercel.app/quiz/51L7lZ

## 🚀 Features

- Interactive quiz interface
- Real-time scoring and feedback
- User authentication and profile management
- Responsive design for all devices
- Modern UI with smooth animations
- Secure API endpoints

## 🛠️ Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Query

### Backend

- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- GraphQL

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/questa.git
cd questa
```

2. Install dependencies:

```bash
# Install backend dependencies
cd questa-backend
npm install

# Install frontend dependencies
cd ../web
npm install
```

3. Set up environment variables:

   - Create `.env` files in both `questa-backend` and `web` directories
   - Copy the respective `.env.example` files and fill in the required values

4. Set up the database:

```bash
cd questa-backend
npx prisma migrate dev
```

5. Start the development servers:

```bash
# Start backend server (from questa-backend directory)
npm run dev

# Start frontend server (from web directory)
npm run dev
```

## 👥 Authors

- Farhan

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries
