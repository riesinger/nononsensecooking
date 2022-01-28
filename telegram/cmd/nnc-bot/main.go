package main

import (
	"context"
	"github.com/riesinger/nononsensecooking/telegram/api"
	v1 "github.com/riesinger/nononsensecooking/telegram/api/v1"
	"github.com/rs/zerolog/log"
	"os"
	"os/signal"
	"syscall"

	"github.com/riesinger/nononsensecooking/telegram/database"
	"github.com/riesinger/nononsensecooking/telegram/telegram"
)

var logger = log.With().Str("component", "main").Logger()

func main() {
	logger.Info().Msg("Service starting up")
	// TODO: Better configuration management
	telegramToken := os.Getenv("NNC_TG_TELEGRAM_TOKEN")
	postgresHost := os.Getenv("NNC_TG_POSTGRES_HOST")
	postgresUser := os.Getenv("NNC_TG_POSTGRES_USER")
	postgresPass := os.Getenv("NNC_TG_POSTGRES_PASS")

	db := database.Connect(postgresUser, postgresPass, postgresHost)
	ctx, cancel := context.WithCancel(context.Background())
	err := db.Initialize(ctx)
	if err != nil {
		logger.Fatal().Err(err).Msg("Could not connect to database, exiting")
		os.Exit(1)
	}

	bot, err := telegram.NewBot(telegramToken, db)
	if err != nil {
		logger.Fatal().Err(err).Msg("Could not connect to Telegram, exiting")
		os.Exit(1)
	}

	handlers := v1.HandlerFunctions{
		CreateBroadcast: func(ctx context.Context, message string) error {
			subscribedUsers, err := db.GetSubscribedUsers(ctx)
			if err != nil {
				return err
			}
			bot.BroadcastTo(subscribedUsers, message)
			return nil
		},
	}

	srv := api.NewHTTPServer(handlers)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	go bot.Start(ctx)
	go srv.Listen(ctx, "127.0.0.1", 50403)

	logger.Info().Msg("Service started")
	<-signals
	logger.Info().Msg("Received signal, shutting down")
	cancel()
	if err := db.Close(); err != nil {
		logger.Error().Err(err).Msg("Error when closing database connection")
	}
	logger.Info().Msg("Service stopped")
}
