package handlers

import (
	"backend/db"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("❌ Error loading .env file:", err)
	}
}

type User struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

func generateOTP() string {
	rand.Seed(time.Now().UnixNano())
	digits := "0123456789"
	otp := make([]byte, 6)
	for i := range otp {
		otp[i] = digits[rand.Intn(len(digits))]
	}
	return string(otp)
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func VerifyOTPHandler(w http.ResponseWriter, r *http.Request) {
	type OTPRequest struct {
		Email string `json:"email"`
		OTP   string `json:"otp"`
	}

	var req OTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println("❌ Invalid request body:", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	log.Println("🔍 Received request:", req)

	var dbOTP string
	var isVerified bool
	err := db.DB.QueryRow("SELECT otp, is_verified FROM users WHERE email=$1", req.Email).Scan(&dbOTP, &isVerified)
	if err != nil {
		log.Println("❌ Error querying database:", err)
		http.Error(w, `{"error": "Invalid email or OTP"}`, http.StatusUnauthorized)
		return
	}

	if dbOTP != req.OTP {
		log.Println("❌ OTP does not match")
		http.Error(w, `{"error": "Invalid OTP"}`, http.StatusUnauthorized)
		return
	}

	_, err = db.DB.Exec("UPDATE users SET is_verified=true WHERE email=$1", req.Email)
	if err != nil {
		log.Println("❌ Database error:", err)
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	response := map[string]string{"message": "OTP verified successfully"}
	jsonResponse, _ := json.Marshal(response)
	log.Println("✅ Sending response:", string(jsonResponse))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}

func sendOTPByEmail(email, otp string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	senderEmail := os.Getenv("SENDER_EMAIL")
	senderPassword := os.Getenv("SENDER_PASSWORD")

	auth := smtp.PlainAuth("", senderEmail, senderPassword, smtpHost)

	msg := []byte("Subject: Your OTP Code\r\n" +
		"\r\n" +
		"Your OTP code is: " + otp + "\r\n")

	to := []string{email}

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, senderEmail, to, msg)
	if err != nil {
		log.Println("❌ Error sending email:", err)
		return err
	}
	log.Println("✅ OTP email sent successfully to", email)
	return nil
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	var exists bool
	if err := db.DB.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE email=$1 OR phone=$2)", user.Email, user.Phone).Scan(&exists); err != nil {
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

	otp := generateOTP()
	expiryTime := time.Now().Add(2 * time.Minute)

	_, err = db.DB.Exec(`
		INSERT INTO users (email, phone, password, otp, otp_expiry, is_verified) 
		VALUES ($1, $2, $3, $4, $5, false)`,
		user.Email, user.Phone, hashedPassword, otp, expiryTime)
	if err != nil {
		log.Println("❌ Error saving user:", err)
		http.Error(w, `{"error": "Error saving user to database"}`, http.StatusInternalServerError)
		return
	}

	if err := sendOTPByEmail(user.Email, otp); err != nil {
		http.Error(w, `{"error": "Failed to send OTP email"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "OTP sent successfully",
	})
}
