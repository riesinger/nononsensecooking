package v1

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/rs/zerolog/log"
	"github.com/stretchr/testify/assert"
)

func testRequestWithLogger() *http.Request {
	r := httptest.NewRequest("GET", "/api/test", nil)
	return r.WithContext(contextWithLogger(context.Background(), log.With().Str("mode", "test").Logger()))
}

func TestAuthenticationMiddleware_CorrectHeader(t *testing.T) {
	token := "someRandomAPIToken123_1"

	handler := authenticationMiddleware(token)

	mockHandlerCalled := false
	mockHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mockHandlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	w := httptest.NewRecorder()
	r := testRequestWithLogger()
	r.Header.Add("Authorization", "Bearer "+token)

	handler(mockHandler).ServeHTTP(w, r)

	assert.Equal(t, http.StatusOK, w.Result().StatusCode)
	assert.True(t, mockHandlerCalled)
}

func TestAuthenticationMiddleware_WrongToken(t *testing.T) {
	handler := authenticationMiddleware("ThisIsTheRealToken")

	mockHandlerCalled := false
	mockHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mockHandlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	w := httptest.NewRecorder()
	r := testRequestWithLogger()
	r.Header.Add("Authorization", "Bearer NotTheRealToken")

	handler(mockHandler).ServeHTTP(w, r)

	assert.Equal(t, http.StatusForbidden, w.Result().StatusCode)
	assert.False(t, mockHandlerCalled)
}

func TestAuthenticationMiddleware_EmptyToken(t *testing.T) {
	handler := authenticationMiddleware("ThisIsTheRealToken")

	mockHandlerCalled := false
	mockHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mockHandlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	w := httptest.NewRecorder()
	r := testRequestWithLogger()
	r.Header.Add("Authorization", "Bearer ")

	handler(mockHandler).ServeHTTP(w, r)

	assert.Equal(t, http.StatusUnauthorized, w.Result().StatusCode)
	assert.False(t, mockHandlerCalled)
}

func TestAuthenticationMiddleware_NoToken(t *testing.T) {
	handler := authenticationMiddleware("ThisIsTheRealToken")

	mockHandlerCalled := false
	mockHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mockHandlerCalled = true
		w.WriteHeader(http.StatusOK)
	})

	w := httptest.NewRecorder()
	r := testRequestWithLogger()

	handler(mockHandler).ServeHTTP(w, r)

	assert.Equal(t, http.StatusUnauthorized, w.Result().StatusCode)
	assert.False(t, mockHandlerCalled)
}
