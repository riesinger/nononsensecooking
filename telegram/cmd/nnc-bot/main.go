package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/riesinger/nononsensecooking/telegram/api"
	v1 "github.com/riesinger/nononsensecooking/telegram/api/v1"
	"github.com/riesinger/nononsensecooking/telegram/models"
	"github.com/riesinger/nononsensecooking/telegram/pkg/config"
	"github.com/rs/zerolog/log"

	"github.com/riesinger/nononsensecooking/telegram/database"
	"github.com/riesinger/nononsensecooking/telegram/telegram"
)

var logger = log.With().Str("component", "main").Logger()

func main() {
	logger.Info().Msg("Service starting up")
	cfg := config.Load()

	db := database.Connect(cfg.PostgresUser, cfg.PostgresPass, cfg.PostgresHost)
	ctx, cancel := context.WithCancel(context.Background())
	err := db.Initialize(ctx)
	if err != nil {
		logger.Fatal().Err(err).Msg("Could not connect to database, exiting")
		os.Exit(1)
	}

	bot, err := telegram.NewBot(cfg.TelegramAPIToken, db)
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
		SendRecipesMessage: func(ctx context.Context, recipeUpdate models.RecipeUpdate) error {
			subscribedUsers, err := db.GetSubscribedUsers(ctx)
			if err != nil {
				return err
			}
			// TODO: Make locale handling more flexible here
			for idx, user := range subscribedUsers {
				update, hasLocale := recipeUpdate[user.RecipeLocale]
				if !hasLocale {
					logger.Warn().Str("chatLocale", user.RecipeLocale).Msg("The recipe update doesnt contain the user's language")
					continue
				}
				success := true
				if err := bot.SendMessageTo(user, update.Message); err != nil {
					success = false
				}
				logger.Debug().Int("totalUsers", len(subscribedUsers)).Int("currentUser", idx).Bool("success", success).Msg("Processed update for user")

			}
			return nil
		},
	}

	srv := api.NewHTTPServer(handlers, cfg.APIToken)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	go bot.Start(ctx)
	go srv.Listen(ctx, "0.0.0.0", 50403)

	logger.Info().Msg("Service started")
	<-signals
	logger.Info().Msg("Received signal, shutting down")
	cancel()
	if err := db.Close(); err != nil {
		logger.Error().Err(err).Msg("Error when closing database connection")
	}
	logger.Info().Msg("Service stopped")
}
