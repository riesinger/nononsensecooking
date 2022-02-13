package telegram

import (
	"context"
	"fmt"
	"github.com/riesinger/nononsensecooking/telegram/models"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

var (
	logger = log.With().Str("component", "telegram").Logger()
)

type Bot struct {
	api       *tgbotapi.BotAPI
	users     UserStore
	workflows map[string]Workflow
}

func NewBot(token string, users UserStore) (*Bot, error) {
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		logger.Fatal().Err(err).Msg("Could not authorize bot")
		return nil, fmt.Errorf("telegram: could not authorize: %w", err)
	}

	logger.Info().Msg("Authorized Telegram bot")

	return &Bot{
		api: bot,
		workflows: map[string]Workflow{
			"start":       createWorkflow("start", startHandler(users)),
			"subscribe":   createWorkflow("subscribe", subscribeHandler(users)),
			"unsubscribe": createWorkflow("unsubscribe", unsubscribeHandler(users)),
			"help":        createWorkflow("unsubscribe", helpHandler),
		},
	}, nil
}

func startHandler(users UserStore) WorkflowFunc {
	return func(ctx context.Context, logger zerolog.Logger, chatID int64, chatLocale string) string {
		if err := users.Upsert(ctx, chatID, chatLocale); err != nil {
			logger.Error().Err(err).Msg("Failed to upsert user")
			return errorMessage(ctx, "start")
		}
		return successMessage(ctx, "start")
	}
}

func subscribeHandler(users UserStore) WorkflowFunc {
	return func(ctx context.Context, logger zerolog.Logger, chatID int64, chatLocale string) string {
		if err := users.Subscribe(ctx, chatID); err != nil {
			logger.Error().Err(err).Msg("Failed to subscribe user")
			return errorMessage(ctx, "subscribe")
		}
		return successMessage(ctx, "subscribe")
	}
}

func unsubscribeHandler(users UserStore) WorkflowFunc {
	return func(ctx context.Context, logger zerolog.Logger, chatID int64, chatLocale string) string {
		if err := users.Unsubscribe(ctx, chatID); err != nil {
			logger.Error().Err(err).Msg("Failed to unsubscribe user")
			return errorMessage(ctx, "unsubscribe")
		}
		return successMessage(ctx, "unsubscribe")
	}
}

func helpHandler(ctx context.Context, logger zerolog.Logger, chatID int64, chatLocale string) string {
	return successMessage(ctx, "help")
}

func (bot *Bot) Start(ctx context.Context) error {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.api.GetUpdatesChan(u)
	for {
		select {
		case update := <-updates:
			bot.handleUpdate(ctx, update)
		case <-ctx.Done():
			logger.Info().Msg("Stopping Telegram client")
			// TODO: Check if more cleanup is necessary
			bot.api.StopReceivingUpdates()
			return nil
		}
	}
}

// BroadcastTo sends a message verbatim to all the given users
// TODO: Implement an API for localized broadcasts
func (bot *Bot) BroadcastTo(users []models.User, message string) {
	for _, user := range users {
		msg := tgbotapi.NewMessage(user.ChatID, message)
		// We explicitly don't want to abort sending the broadcast when sending to a single user failed
		if _, err := bot.api.Send(msg); err != nil {
			logger.Error().Err(err).Int64("chatID", user.ChatID).Msg("Failed to send broadcast to user")
		}
	}
}

func (bot *Bot) SendMessageTo(user models.User, message string) error {
	msg := tgbotapi.NewMessage(user.ChatID, message)
	if _, err := bot.api.Send(msg); err != nil {
		logger.Error().Err(err).Int64("chatID", user.ChatID).Msg("Failed to send message to user")
		return err
	}
	return nil
}

// handleUpdate handles incoming "Updates" (i.e. messages) from the Telegram API
func (bot *Bot) handleUpdate(ctx context.Context, update tgbotapi.Update) {
	// We don't care about non-message updates
	if update.Message == nil {
		return
	}

	// Ignore everything that's not a command
	if !update.Message.IsCommand() {
		return
	}

	chatLocale := update.Message.From.LanguageCode
	chatID := update.Message.Chat.ID
	messageText := update.Message.Text
	sublogger := logger.With().Str("locale", chatLocale).Int64("chatID", chatID).Logger()
	trimmedMessage := messageText
	if len(messageText) > 100 {
		trimmedMessage = messageText[:100]
	}
	sublogger.Info().Str("message", trimmedMessage).Msg("Received new message")

	response := tgbotapi.NewMessage(chatID, "")

	workflow, hasWorkflow := bot.workflows[update.Message.Command()]
	if !hasWorkflow {
		response.Text = getMessage(chatLocale, "unknownCommand")
	} else {
		response.Text = workflow.Exec(ctx, chatID, chatLocale)
	}
	_, err := bot.api.Send(response)
	if err != nil {
		sublogger.Error().Err(err).Msg("Failed to send response")
	}
}
