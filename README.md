# CarInventorySystem By Kaustubh

A comprehensive full-stack car dealership inventory management system built with TypeScript, Node.js, React, and Vite.

##  Table of Contents

- [🚀 Quick Start for Users](#-quick-start-for-users)
- [📋 Overview](#-overview)
- [👨‍💻 Developer Setup](#-developer-setup)
  - [Project Structure](#project-structure)
  - [Tech Stack](#tech-stack)
  - [Installation for Development](#installation-for-development)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [My AI Usage](#my-ai-usage)
- [Configuration Files](#configuration-files)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Quick Start for Users

### How to Run the Application

#### Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

#### Step 1: Install Dependencies
```bash
npm install
```

This command installs all required packages for both the frontend and backend.

#### Step 2: Start the Application
```bash
npm run dev
```

The application will automatically start:
- **Frontend** (User Interface): `http://localhost:5173`
- **Backend** (API Server): `http://localhost:3000`

#### Step 3: Open in Browser
Open your web browser and navigate to `http://localhost:5173` to access the Car Inventory System.

#### Features Available
- ✅ **Login/Register**: Create an account or login with existing credentials
- ✅ **View Vehicles**: Browse all vehicles in the inventory
- ✅ **Manage Inventory**: Add, edit, or remove vehicles from inventory
- ✅ **Dashboard**: View inventory metrics and statistics
- ✅ **User Management**: Manage user accounts (for administrators)

#### Stopping the Application
Press `Ctrl + C` in the terminal to stop the server.

---

## 📋 Overview

This is a web-based inventory management system designed for car dealerships. It provides tools for managing vehicle inventory, user authentication, and inventory tracking with a modern, responsive user interface.

### Features

- **User Authentication**: Secure registration system
<img width="1907" height="915" alt="Register" src="https://github.com/user-attachments/assets/87f43b64-09a8-43bb-9b44-27a8a5c4cc25" />

- **Secure Login System:**
<img width="1907" height="920" alt="Login" src="https://github.com/user-attachments/assets/89dcf4b0-fc17-430c-bb58-aaf80e7b4e00" />

- **Username and Password Validation:**
<img width="468" height="501" alt="image" src="https://github.com/user-attachments/assets/0e55cfb1-d1f0-439f-84c2-eaee0ac03c0b" />

- **Duplicate Registration:** Showing error if user is already registered
<img width="468" height="578" alt="image" src="https://github.com/user-attachments/assets/aab215e0-5998-4c44-aa6b-1bd640e6942d" />

- **Vehicle Inventory Management**: Admin can add, update, delete, and view vehicles
<img width="1510" height="900" alt="Admin Dashboard 1" src="https://github.com/user-attachments/assets/0f2385da-460e-4c11-8557-457a679eecdb" />

<img width="1312" height="852" alt="Admin dashboard car details " src="https://github.com/user-attachments/assets/ead8cadb-6948-471c-9fce-58d303f223aa" />

- **User Dashboard**:  
  1.User can see all vehicles lists and purchase option as well
  2. Cars Stocks(Out of stocks will also be shown)
<img width="1153" height="870" alt="User Dashboard" src="https://github.com/user-attachments/assets/6bf51074-21d8-47d8-9c0a-e471f870885a" />

- **Filter Option**: User can search car by make, model name, and Prices.
<img width="1290" height="631" alt="image" src="https://github.com/user-attachments/assets/40f145af-06b3-415a-a201-05717a347f22" />

- **User Management**: Admin can make new users as admin to add, update and delete new car details.
<img width="1298" height="190" alt="Admin management" src="https://github.com/user-attachments/assets/fd2b2944-9391-4691-bbc3-dbda7f167213" />

---

## 👨‍💻 Developer Setup

### Project Structure

```
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access layer
│   │   ├── routes/       # API endpoints
│   │   ├── config/       # Configuration
│   │   ├── types/        # TypeScript type definitions
│   │   └── __tests__/    # Unit tests
│   └── package.json
│
├── frontend/             # React/TypeScript frontend
│   ├── src/
│   │   ├── pages/        # React components
│   │   ├── services/     # API client services
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   └── main.tsx      # Entry point
│   └── package.json
│
└── package.json          # Root workspace configuration
```

### Tech Stack

#### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQL-based (configured in `config/database.ts`)
- **Testing**: Vitest

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Package Manager**: npm

### Installation for Development

#### Root Level Setup
```bash
npm install        # Install dependencies for both frontend and backend
npm run dev        # Start both servers in development mode
```

#### Backend Development Setup
```bash
cd backend
npm install
npm run dev        # Start development server
npm test           # Run tests
npm run build      # Build for production
```

#### Frontend Development Setup
```bash
cd frontend
npm install
npm run dev        # Start development server
npm run build      # Build for production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health
- `GET /api/health` - Server health check

## Testing

### Backend Tests
```bash
cd backend
npm run test              # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

## My AI Usage

### Tools Used
I utilized **GitHub Copilot** throughout the development of this Car Dealership Inventory System to accelerate development and improve code quality.

### How I Used GitHub Copilot

#### 1. **API Endpoint Structure & Route Generation**
I leveraged Copilot to brainstorm and generate RESTful API endpoint structures. When defining vehicle and user routes, Copilot suggested logical endpoint patterns (`/api/vehicles`, `/api/users`), appropriate HTTP methods, and parameter naming conventions, significantly speeding up the API design process.

#### 2. **Service Layer Implementation**
Copilot assisted in generating business logic for services like `vehicleService.ts`, `userService.ts`, and `authService.ts`. I used it to outline complex operations such as vehicle filtering, user authentication flows, and data validation patterns. This helped me maintain consistent code structure across multiple service files.

#### 3. **Unit Test Generation**
I asked Copilot to generate comprehensive unit tests for my service and controller layers. It produced test suites covering:
- User authentication scenarios
- Vehicle CRUD operations
- Input validation edge cases
- Error handling scenarios

This enabled me to implement test-driven development practices efficiently and ensure adequate test coverage from the start.

#### 4. **Type Definition Creation**
Copilot helped me define TypeScript interfaces and types for Vehicle and User entities. It suggested appropriate properties, data types, and optional fields based on domain context, reducing time spent on type modeling.

#### 5. **Repository Pattern Implementation**
When building the data access layer, Copilot assisted in implementing repository patterns for database operations, providing consistent methods for CRUD operations while maintaining separation of concerns.

#### 6. **React Component Development**
For the frontend, I used Copilot to generate React component scaffolding for pages like `AuthPage.tsx` and `DashboardPage.tsx`, including:
- Component state management hooks
- Form handling patterns
- API integration patterns
- Event handler logic

#### 7. **Configuration Files**
Copilot helped generate and validate configuration files including:
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build tool configuration
- `tailwind.config.js` - CSS framework configuration
- `vitest.config.ts` - Test runner configuration

### Impact on Workflow

**Positive Impacts:**
- **Increased Development Speed**: Copilot's code suggestions reduced boilerplate coding, allowing me to focus on business logic and architecture decisions rather than repetitive patterns.
- **Consistency**: By suggesting standardized patterns, Copilot helped maintain consistent code style and structure across the entire codebase, particularly across multiple service and controller files.
- **Better Test Coverage**: With Copilot's assistance in generating test cases, I achieved comprehensive test coverage earlier in development, catching bugs sooner.
- **Learning & Best Practices**: Copilot's suggestions introduced me to better TypeScript patterns, React hooks practices, and Express.js middleware patterns that I might not have considered.
- **Reduced Cognitive Load**: By handling routine code generation, Copilot freed up mental energy for architectural decisions and complex business logic implementation.
- **Rapid Prototyping**: The ability to quickly scaffold components and services enabled faster iteration and refinement of features.

**Workflow Efficiency:**
- **Time Savings**: Estimated 25-30% reduction in development time, particularly in boilerplate and test code generation.
- **Fewer Context Switches**: I could stay focused on high-level design while Copilot handled implementation details.
- **Quality Assurance**: Built-in suggestions for error handling and validation patterns improved code robustness.

**Limitations & Considerations:**
- Some suggestions required refinement to match specific project needs and architecture patterns.
- Had to carefully review generated code, especially for security-sensitive areas like authentication.
- Copilot works best when given clear context through meaningful variable/function names.

**Conclusion:**
GitHub Copilot significantly enhanced my development workflow by automating routine coding tasks, improving consistency, and enabling faster feature implementation. The key to maximizing its benefits was using it as a collaborative tool—reviewing suggestions critically and combining its output with my architectural vision rather than blindly accepting all suggestions.

## Configuration Files

- **ARCHITECTURE.md** - Detailed architecture documentation
- **QUICK_START.md** - Quick start guide
- **CODE_REVIEW.md** - Code review guidelines
- **tsconfig.json** - TypeScript configuration
- **vitest.config.ts** - Test configuration
- **vite.config.ts** - Build configuration
- **tailwind.config.js** - Tailwind CSS configuration

## Development Workflow

1. Start the development servers:
   ```bash
   npm run dev
   ```

2. Backend runs on `http://localhost:3000` (or configured port)
3. Frontend runs on `http://localhost:5173` (Vite default)

4. Make code changes - both servers support hot module replacement

5. Run tests during development:
   ```bash
   npm test
   ```

## Contributing

Follow the guidelines in [CODE_REVIEW.md](CODE_REVIEW.md) for code submissions.

## License

This project is created as part of the Car Inventory System development.

---

**Created by**: Kaustubh  
**Last Updated**: 2026-08-16
