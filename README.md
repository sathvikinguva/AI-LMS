# AI-Powered Learning Management System (LMS)

This project is an AI-powered Learning Management System (LMS) that provides personalized learning experiences, progress tracking, and AI study assistance. The backend is built using Flask and integrates with the Aixplain API for AI functionalities. The frontend is developed using React and Tailwind CSS, providing a responsive and interactive user interface.

## Features

- **AI Study Assistant**: Get instant help with your studies using our advanced AI assistant. Ask questions, get explanations, and deepen your understanding.
- **Learning Dashboard**: Track your progress, review past quizzes, and analyze your learning journey with detailed insights and statistics.

## Installation

### Backend

1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```

2. Create a virtual environment:
    ```sh
    python -m venv venv
    ```

3. Activate the virtual environment:
    - On Windows:
        ```sh
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```sh
        source venv/bin/activate
        ```

4. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

5. Create a `.env` file in the directory and add your Aixplain API key:
    ```
    AIXPLAIN_ACCESS_KEY=your_access_key_here
    ```

6. Run the Flask application:
    ```sh
    flask run
    ```

### Frontend

1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```

2. Install the required packages:
    ```sh
    npm install
    ```

3. Start the React application:
    ```sh
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:5000`.
2. Use the AI Study Assistant to ask questions and get explanations.
3. Track your learning progress on the Dashboard.

## API Endpoints

### `/api/chat` (POST)

- **Description**: Processes user queries and returns AI-generated responses.
- **Request Body**:
    ```json
    {
        "text": "Your query here"
    }
    ```
- **Response**:
    ```json
    {
        "response": "AI-generated response"
    }
    ```

### `/api/ping` (GET)

- **Description**: Simple endpoint to check if the service is running.
- **Response**:
    ```json
    {
        "status": "ok",
        "pipeline_initialized": true,
        "pipeline_name": "Pipeline Name",
        "methods": ["method1", "method2"]
    }
    ```
    
## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
