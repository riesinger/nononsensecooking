package v1

import (
	"context"
	"github.com/rs/zerolog"
)

func contextWithLogger(ctx context.Context, logger zerolog.Logger) context.Context {
	return context.WithValue(ctx, "logger", logger)
}

func loggerFromContext(ctx context.Context) zerolog.Logger {
	l, ok := ctx.Value("logger").(zerolog.Logger)
	if !ok {
		panic("tried to read logger from context but none was present")
	}
	return l
}
