package v1

import (
	"net/http"
	"time"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		subLogger := logger.With().Str("path", r.URL.Path).Logger()
		subLogger.Info().Msg("Handling request")

		r = r.WithContext(contextWithLogger(ctx, subLogger))

		start := time.Now()
		next.ServeHTTP(w, r)
		end := time.Now()

		subLogger.Info().Dur("duration", end.Sub(start)).Msg("Request handled")
	})
}
