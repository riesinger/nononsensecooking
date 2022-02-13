package v1

import (
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/mux"
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

func authenticationMiddleware(apiToken string) mux.MiddlewareFunc {
  return func(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      ctx := r.Context()
      subLogger := loggerFromContext(ctx)

      authHeader := r.Header.Get("Authorization")
      if authHeader == "" {
        subLogger.Warn().Msg("Missing Authorization header")
        w.WriteHeader(http.StatusUnauthorized)
        return
      }

      token := strings.TrimPrefix(authHeader, "Bearer ")
      if token == "" {
        subLogger.Warn().Msg("Empty auth token")
        w.WriteHeader(http.StatusUnauthorized)
        return
      }

      if token != "TEST" {
        subLogger.Warn().Msg("Token is forbidden")
        w.WriteHeader(http.StatusForbidden)
        return
      }

      next.ServeHTTP(w, r)
    })
  }
}
