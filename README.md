# 🧠 Task Manager Backend

A robust and scalable backend API for a task management platform with real-time AI chatbot support. Built with Node.js, TypeScript, Express, MongoDB, Prisma ORM, and powered by JWT & Google OAuth authentication.

---

## 🚀 Features

- 🔐 User registration, login, and authentication (JWT + Google OAuth2)
- 🧠 Real-time AI chatbot integration (Google Gemini via WebSockets)
- 📊 Project & task management with CRUD functionality
- 📈 Dashboard insights
- 📬 Password reset & change flow
- 🔒 Input validation, secure headers, CORS, and error handling
- 🧪 Unit & integration tests with Jest + Supertest

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** JWT + Google OAuth2 (Passport)
- **WebSockets:** Socket.io
- **Testing:** Jest, Supertest
- **Logging:** Pino
- **Code Quality:** ESLint, Prettier

---

## 📁 Project Structure

Main folders:
```
├── tests/ # Unit and integration tests
│ ├── controllers/ # Tests for controllers
│ ├── mocks/ # Test mocks and stubs
│ ├── services/ # Tests for services
│ ├── utils/ # Utility tests
│ └── index.spec.ts # Entry test file
│
├── src/ # Main source code
│ ├── configs/ # App configuration
│ ├── controllers/ # Express route controllers
│ ├── middlewares/ # Custom middleware functions
│ ├── prisma/ # Prisma schema and client
│ ├── routes/ # API route definitions
│ ├── services/ # Core business logic
│ ├── types/ # TypeScript type definitions
│ ├── utils/ # Utility functions
│ ├── validators/ # Request validation logic
│ ├── index.ts # Main application entry point
│ ├── seed.ts # Database seeder script
│ └── socket.ts # Socket.io configuration
```

---

## 🔑 API Endpoints

### 🧍‍♂️ User & Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register`     | Register new user |
| POST   | `/api/auth/login`        | User login |
| DELETE | `/api/auth/logout`       | User logout |
| POST   | `/api/auth/forgetpassword` | Request password reset |
| PUT    | `/api/user/resetpassword/:token` | Reset password |
| PUT    | `/api/user/changepassword` | Change password |
| GET    | `/api/auth/google`       | Google OAuth login |
| GET    | `/api/user`              | Get user profile |

### ✅ Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tasks`       | List all tasks |
| POST   | `/api/tasks`       | Create task |
| GET    | `/api/tasks/:id`   | Get task |
| PUT    | `/api/tasks/:id`   | Update task |
| DELETE | `/api/tasks/:id`   | Delete task |

### 📁 Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects`       | List all projects |
| POST   | `/api/projects`       | Create project |
| GET    | `/api/projects/:id`   | Get project |
| PUT    | `/api/projects/:id`   | Update project |
| DELETE | `/api/projects/:id`   | Delete project |

### 📊 Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/insights/dashboard` | Get dashboard insights |

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS protection via middleware
- Helmet for secure headers

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
  NOD_ENV= NOD_ENV,
  PORT= PORT,
  MONGO_URL= MONGO_URL,

  JWT_SECRET= JWT_SECRET,
  JWT_SIGNED_TOKEN= JWT_SIGNED_TOKEN, // testing purposes

  EMAIL_SENDER_USERNAME= EMAIL_SENDER_USERNAME,
  EMAIL_SENDER_PASSWORD= EMAIL_SENDER_PASSWORD,
  EMAIL_SENDER= EMAIL_SENDER,

  GOOGLE_CLIENT_ID= GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET= GOOGLE_CLIENT_SECRET,
  GOOGLE_CB_URL= GOOGLE_CB_URL,
  FRONTEND_URL= FRONTEND_URL,

  GEMINI_API_KEY= GEMINI_API_KEY,
  GEMINI_MODEL= GEMINI_MODEL,
```

---

## 🧪 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run server in development (TSX + watch) |
| `npm run build` | Build project to `dist/` using TypeScript |
| `npm start` | Run compiled JS in `dist/index.js` |
| `npm test` | Run tests using Jest |
| `npm run seed` | Seed the database |
| `npm run lint` | Fix lint issues |
| `npm run format` | Format code using Prettier |

---

## 🗃️ Prisma Commands

- Generate Prisma Client  
  ```bash
  npx prisma generate
  ```
- Run Migrations  
  ```bash
  npx prisma migrate dev
  ```
- Seed the Database  
  ```bash
  npm run seed
  ```

---

## 🧑‍💻 Author

**Mostafa Hasan**  
[LinkedIn](https://www.linkedin.com/in/mostafa-final) | [GitHub](https://github.com/mostafafinal)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 🤝 Contributions

Contributions, issues, and feature requests are welcome!  
Feel free to open a PR or issue to get involved.