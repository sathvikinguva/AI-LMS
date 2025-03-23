# AI-LMS

This project is an AI-powered Learning Management System (LMS) that provides personalized learning experiences, progress tracking, and AI study assistance for rural areas. The backend is built using Flask and integrates with the Aixplain API for AI functionalities. The frontend is developed using React and Tailwind CSS, providing a responsive and interactive user interface.

## Features

- **AI Study Assistant**: Get instant help with your studies using our advanced AI assistant. Ask questions, get explanations, and deepen your understanding.
- **Learning Dashboard**: Track your progress, review past quizzes, and analyze your learning journey with detailed insights and statistics.

## Project Structure

```
backend/
    .env
    app.py
    requirements.txt
    .aixplain_cache/
        functions.json
        languages.json
        licenses.json
frontend/
    .gitignore
    eslint.config.js
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    src/
        App.tsx
        index.css
        main.tsx
        vite-env.d.ts
        components/
            Navbar.tsx
        pages/
            Dashboard.tsx
            Home.tsx
            Study.tsx
```

## Backend

The backend is a Flask application that handles API requests and interacts with the AI service.

### Setup

1. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

2. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

3. Create a `.env` file in the `backend` directory with the following content:
    ```
    AIXPLAIN_API_URL=https://platform-api.aixplain.com/assets/pipeline/execution/run/PIPELINE_KEY
    AIXPLAIN_ACCESS_KEY=your_access_key_here
    PORT=5000
    ```

4. Run the Flask application:
    ```sh
    python app.py
    ```

### Endpoints

- `POST /api/chat`: Processes a chat query using the AI service.
- `GET /api/ping`: Checks if the service is running and if the pipeline is initialized.

## Frontend

The frontend is a React application built with Vite and TypeScript.

### Setup

1. Install the required packages:
    ```sh
    npm install
    ```

2. Run the development server:
    ```sh
    npm run dev
    ```

### Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Previews the production build.
