# Node.js API with JWT Authentication

This project is a RESTful API built with Node.js that implements JWT-based authentication. It allows users to register and log in.

## Features

- User Registration
- User Login with JWT authentication
- Secure password hashing using `bcryptjs`
- Environment variable support with `.env`

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **Sequelize**: ORM for database interactions
- **JWT**: Authentication with JSON Web Tokens
- **bcryptjs**: Password hashing

---

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A relational database (e.g., MySQL, PostgreSQL, or SQLite)

---

## Getting Started

### 1. Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
### 2. NPM Install
npm install
### 3. Set Config.json
### 4. Run db migration
npx sequelize-cli db:migrate
### 5. Start Server
npm run dev
