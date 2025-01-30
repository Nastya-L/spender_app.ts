# Spender

Try [Demo](https://spender-c414.onrender.com/)

This project is an expense tracking application.<br />
Users can create jars to record their expenses. Each jar can be edited, deleted, or shared with another user. Within a jar, users can add expenses by specifying the amount, category, and date. Expenses can also be edited or deleted as needed.

Layout in [Figma](https://www.figma.com/design/TMbu0WXN0fNCrtnwvQYM8G/Spender-(Community)?node-id=575-1771&node-type=frame&t=vLRaPXxjoLvsloVE-0)

## Features:
* **User Registration:** Allows users to register an account.

* **User Authentication:** Secure login and authentication for users.

* **Create, Edit, and Delete Jars:** Manage jars for tracking expenses.

* **Create, Edit, and Delete Expenses:** Add or update individual expenses with detailed information.

* **Add or Remove Users from Jars:** Share jars with other users or revoke access.

* **Light/Dark Theme:** Toggle between light and dark modes for better user experience.

* **Pagination:** Efficiently browse through large datasets of jars or expenses.

* **Statistics:** View detailed expense statistics for better financial analysis.

* **Loading Indicator:** Displays a loader for seamless interaction during data processing.

## 🛠 Installation and Setup

**Spender** is a fullstack application built with TypeScript. To run it, you need to start the **Backend** (with the database) and the **Frontend**.

### Running the Backend with the Database

#### 1. Navigate to the `backend` folder::
```
$ cd backend
```
#### 2. Install all dependencies:
```
$ npm install
```

#### 3. Build the server and the database:
```
$ docker-compose build
```
#### 4. Start the server and the database:
```
$ docker-compose up
```
Once the server is successfully running, it will be ready to use.

### Running the Frontend

#### 1. Navigate to the `frontend` folder:
```
$ cd frontend
```
#### 2. Install all dependencies:
```
$ npm install
```
#### 3. Start the application in development mode:

```
$ npm start
```

#### 4. Open [http://localhost:8000](http://localhost:8000) in your browser to view the application.

### Notes
* Make sure you have **Docker** and **Node.js** (compatible versions) installed on your machine.
* If port `8000` is already in use, update the configuration in the appropriate files.

## This project was built using these technologies:
### Frontend:
* **TypeScript**
* **HTML**
* **SCSS**
* **React/Redux**
* **Webpack**
* **Visual Studio Code, Chrome Developer Tools**

### Backend:
* **TypeScript**
* **Node.js:** Server-side runtime for JavaScript.
* **MongoDB:** NoSQL database for storing application data.
* **Express:** Framework for building the backend API.
  
### Linters and Code Formatting Tools
* **ESLint:** To enforce consistent coding standards in JavaScript/TypeScript.
* **Stylelint (SCSS):** For maintaining style consistency in SCSS files.
* **Prettier:** For automatic code formatting.