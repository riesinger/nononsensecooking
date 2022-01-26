package v1

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
	"net/http"
)

type HandlerFunctions struct {
	CreateBroadcast func(ctx context.Context, message string) error
}

var logger = log.With().Str("component", "api").Int("version", 1).Logger()

func BindRoutes(r *mux.Router, handlers HandlerFunctions) {
	s := r.PathPrefix("/v1").Subrouter()
	s.Use(loggingMiddleware)
	s.Path("/broadcasts").Methods("POST").HandlerFunc(postBroadcastsHandler(handlers.CreateBroadcast))
}

func postBroadcastsHandler(handler func(ctx context.Context, message string) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type payload struct {
			Message string `json:"message"`
		}
		logger := loggerFromContext(r.Context())

		p := new(payload)
		if err := json.NewDecoder(r.Body).Decode(p); err != nil {
			logger.Error().Err(err).Msg("Failed to deserialize payload")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := handler(r.Context(), p.Message); err != nil {
			logger.Error().Err(err).Msg("Handler returned error")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}
