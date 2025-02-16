package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
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
	DB, errDB = sql.Open("postgres", connStr)
	if errDB != nil {
		log.Fatal("❌ Failed to connect to database:", errDB)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("❌ Database connection error:", err)
	}

	fmt.Println("✅ Connected to database")
}
