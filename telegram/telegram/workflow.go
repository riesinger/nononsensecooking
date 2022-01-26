package telegram

import (
	"context"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type WorkflowFunc func(ctx context.Context, logger zerolog.Logger, chatID int64, chatLocale string) string

type Workflow struct {
	Name    string
	Handler WorkflowFunc
	logger  zerolog.Logger
}

func createWorkflow(name string, handler WorkflowFunc) Workflow {
	return Workflow{
		Name:    name,
		Handler: handler,
		logger:  log.With().Str("component", "telegram").Str("workflow", name).Logger(),
	}
}

func (wf Workflow) Exec(ctx context.Context, chatID int64, chatLocale string) string {
	ctx = context.WithValue(ctx, contextKeyChatLocale, chatLocale)
	logger := wf.logger.With().Int64("chatID", chatID).Str("locale", chatLocale).Logger()
	return wf.Handler(ctx, logger, chatID, chatLocale)
}
