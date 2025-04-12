# Askaway

## This platform is only for SECEians and this is Open Source

Welcome to **Askaway**! This platform is designed to help students connect with their college seniors to ask questions and gain insights about placement interviews, preparation strategies, and career guidance. Seniors can share their experiences, and students can comment and ask follow-up questions.

---

## Features

1. **User Authentication**:
    - Students and seniors can sign up and log in securely.
    - Role-based access (students and seniors).
2. **Ask Questions**:
    - Students can post questions related to placements, interviews, and career advice.
    - Questions can be tagged with relevant topics (e.g., "Interview Tips," "Resume Building," "Company-specific Questions").
3. **Answer Questions**:
    - Seniors can provide detailed answers to questions based on their experiences.
    - Answers can include tips, resources, and personal stories.
4. **Comment and Discuss**:
    - Students and seniors can engage in discussions by commenting on questions and answers.
5. **Search and Filter**:
    - Users can search for questions by tags, keywords, or categories.
    - Filter questions by most recent, most answered, or most viewed.
6. **Upvote/Downvote**:
    - Users can upvote or downvote questions and answers to highlight the most helpful content.
7. **Profile Management**:
    - Users can update their profiles, add their placement details (for seniors), and showcase their achievements.

---

## Tech Stack

- **Frontend**:
    - React.js (with TypeScript)
    - Tailwind CSS for styling
- **Backend**:
    - Go (Golang) for API development
- **Database**:
    - PostgreSQL for data storage

---

## Installation

### Frontend

> The frontend is located directly in the root of this repository.
> 
1. Navigate to the project root (if not already):
`cd Askaway`
2. Install dependencies:
`npm install`
3. Start the development server:
`npm run dev`

### Backend

1. Navigate to the backend directory:
`cd backend`
2. Install Go dependencies:
`go mod tidy`
3. Create your `.env` file:
    - Copy the example file:
    `cp .env.example .env`
    - Fill in the required environment variables in `.env`:
        
        ```
        DB_HOST=localhost
        DB_PORT=5432
        DB_USER=your_username
        DB_PASSWORD=your_password
        DB_NAME=Askaway
        
        SMTP_EMAIL=your_email
        SMTP_PASSWORD=your_smtp_app_password
        SMTP_HOST=smtp.gmail.com
        SMTP_PORT=587
        SENDER_EMAIL=your_sender_email
        SENDER_PASSWORD=your_sender_password
        
        ```
        
4. Run the server:
`go run main.go`

---

## Contributing

We welcome contributions from the community! Feel free to open issues, create pull requests, or suggest new features.

**Note:** Do not commit your `.env` file. Make sure it is listed in `.gitignore`.

---

## License

This project is open source and available under the MIT License.

---

Made with ❤️ by SECEians for SECEians!

---