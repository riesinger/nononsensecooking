package api

import (
	"context"
	"fmt"
	"github.com/gorilla/mux"
	v1 "github.com/riesinger/nononsensecooking/telegram/api/v1"
	"github.com/rs/zerolog/log"
	"net/http"
)

type HTTPServer struct {
	r *mux.Router
}

var logger = log.With().Str("component", "api").Logger()

func NewHTTPServer(v1handlers v1.HandlerFunctions, apiToken string) *HTTPServer {
	r := mux.NewRouter()
	v1.BindRoutes(r, v1handlers, apiToken)

	return &HTTPServer{r: r}
}

func (srv *HTTPServer) Listen(ctx context.Context, host string, port int) {
	httpSrv := &http.Server{
		Addr:    fmt.Sprintf("%s:%d", host, port),
		Handler: srv.r,
	}
	go func() {
		logger.Info().Msg("Starting API server")
		if err := httpSrv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error().Err(err).Msg("Starting API server failed")
		}
	}()

	<-ctx.Done()

	logger.Info().Msg("Shutting down API server")
	if err := httpSrv.Shutdown(ctx); err != nil {
		logger.Error().Err(err).Msg("Graceful shutdown of API server failed")
	}
}
