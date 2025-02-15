package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

var db *sql.DB

func initDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Error loading .env file:", err)
	}

	databaseURL := os.Getenv("DATABASE_URL")
	var connStr string

	if databaseURL != "" {
		connStr = databaseURL
	} else {
		connStr = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
		)
	}

	var errDB error
	db, errDB = sql.Open("postgres", connStr)
	if errDB != nil {
		log.Fatal("❌ Failed to connect to database:", errDB)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("❌ Database connection error:", err)
	}

	fmt.Println("✅ Connected to database")
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	var exists bool
	err = db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE email=$1 OR phone=$2)", user.Email, user.Phone).Scan(&exists)
	if err != nil {
		log.Println("❌ Error checking user existence:", err)
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	if exists {
		http.Error(w, `{"error": "Email or phone number already registered"}`, http.StatusConflict)
		return
	}
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		log.Println("❌ Error hashing password:", err)
		http.Error(w, `{"error": "Error processing password"}`, http.StatusInternalServerError)
		return
	}
	_, err = db.Exec("INSERT INTO users (email, phone, password) VALUES ($1, $2, $3)", user.Email, user.Phone, hashedPassword)
	if err != nil {
		log.Println("❌ Error saving user:", err)
		http.Error(w, `{"error": "Error saving user to database"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func main() {
	initDB()
	defer db.Close()

	router := mux.NewRouter()
	router.HandleFunc("/signup", signupHandler).Methods("POST")

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, 
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	fmt.Println("🚀 Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", corsHandler.Handler(router)))
}
