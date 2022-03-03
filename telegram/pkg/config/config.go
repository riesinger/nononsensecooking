package config

import (
	"os"

	"github.com/joho/godotenv"
)

const EnvPrefix = "NNC_TG"

type Cfg struct {
	// Telegram
	TelegramAPIToken string

	// Postgres
	PostgresHost string
	PostgresUser string
	PostgresPass string

	// Server config
	APIToken string
}

// Load reads the environment stores all found variables into a Cfg struct which is returned
func Load() Cfg {
	// Since we'll only load .env files for development, we don't care if that fails
	_ = godotenv.Load()

	return Cfg{
		TelegramAPIToken: getEnv("TELEGRAM_TOKEN"),

		PostgresHost: getEnv("POSTGRES_HOST"),
		PostgresUser: getEnv("POSTGRES_USER"),
		PostgresPass: getEnv("POSTGRES_PASS"),

		APIToken: getEnv("API_TOKEN"),
	}
}

func getEnv(key string) string {
	return os.Getenv(EnvPrefix + "_" + key)
}
