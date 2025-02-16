package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"backend/db"
)

type User struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	var exists bool
	err = db.DB.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE email=$1 OR phone=$2)", 
		user.Email, user.Phone).Scan(&exists)
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

	_, err = db.DB.Exec("INSERT INTO users (email, phone, password) VALUES ($1, $2, $3)", 
		user.Email, user.Phone, hashedPassword)
	if err != nil {
		log.Println("❌ Error saving user:", err)
		http.Error(w, `{"error": "Error saving user to database"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}
