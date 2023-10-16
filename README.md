# MERN Auth Template

A  MERN (MongoDB, Express.js, React, Node.js) authentication template using ReactJS for the frontend. This template is designed to provide a starting point for MERN stack developers looking to implement authentication in their projects.

## Features

- **Vite-React for Frontend**: The frontend is built using Vite, a fast development server and build tool for modern web development.
- **Tailwind CSS for Stlying**: The UI of this app also implemented TailwindCSS, for easy and easily adjustable styling.
-**Fortawesome icons**: This template also uses icons gotten gfrom the fortawesome library.
- **Express.js for Backend API**: The backend API is powered by Express.js, a minimal and flexible Node.js web application framework.
- **MongoDB for Database**: MongoDB is used as the database to store user authentication information.
- **Authentication Middleware**: The template includes middleware for user authentication, making it easy to secure routes.
- **JWT (JSON Web Tokens) for Authentication**: JSON Web Tokens are used for secure authentication between the frontend and backend.
- **Customizable**: Easily customizable to fit your project's specific requirements.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB installed locally or accessible remotely.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/kariebi/mern-auth-template.git
    ```

2. Navigate to the project directory:

    ```bash
    cd mern-auth-template
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file in the backend folder of the project:

    ```env
    # MongoDB Connection URI
    MONGODB_URI=mongodb://localhost:27017/mern-auth

    # JWT Secret Keys
    ACCESS_TOKEN_SECRET=myaccess'secretkey
    REFRESH_TOKEN_SECRET=myrefresh'secretkey

    # EMAIL details
    SENDER_EMAIL='johndoeshouldbeyourpassword@gmail.com'
    SENDER_PASSWORD='my email password that is probably johndoe'
    ```

    Update the `MONGODB_URI` with your MongoDB connection URI, input your email address for `SENDER_EMAIL` as well as your email password for `SENDER_PASSWORD` and set a secure value for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

### Running the Application

1. Start the backend server (Express API):

    ```bash
    npm run server
    ```

    The backend will be running on `http://localhost:3500`.

2. Start the frontend (React):

    ```bash
    npm run dev
    ```

    The frontend will be running on `http://localhost:5173`.

3. Visit `http://localhost:5173` in your browser to see the application.

## Usage

- The template provides a basic authentication setup with a login and registration system.
- Users can register and verify their emails with a time based OTP.
- Users can login normally but can only use the dashboard page after thier emails have been verified.
-I will add others like Google OAuth so users cna sign up using Google directly in due time

Feel free to customize and build upon this template to suit the needs of your project!

