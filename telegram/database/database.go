package database

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/riesinger/nononsensecooking/telegram/models"
	"github.com/rs/zerolog/log"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var logger = log.With().Str("component", "db").Logger()

type Connection struct {
	db *bun.DB
}

func Connect(user, pass, host string) *Connection {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:5432/nnc?sslmode=disable", user, pass, host)
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	db := bun.NewDB(sqldb, pgdialect.New())
	return &Connection{db}
}

func (c *Connection) Initialize(ctx context.Context) error {
	_, err := c.db.NewCreateTable().Model((*models.User)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		logger.Error().Err(err).Msg("Failed to initialize the users table")
		return err
	}
	return nil
}

func (c *Connection) Close() error {
	return c.db.Close()
}

// Upsert inserts or updates a user
// TODO: Move this to some sort of repository or rename
func (c *Connection) Upsert(ctx context.Context, id int64, locale string) error {
	user := &models.User{ChatID: id, RecipeLocale: locale}
	_, err := c.db.NewInsert().Model(user).On("CONFLICT (chat_id) DO UPDATE").Set("recipe_locale = EXCLUDED.recipe_locale").Exec(ctx)
	if err != nil {
		logger.Error().Err(err).Int64("chatId", id).Msg("Failed to upsert user")
		return err
	}
	logger.Debug().Int64("chatId", id).Msg("User upserted")
	return nil
}

func (c *Connection) Subscribe(ctx context.Context, id int64) error {
	user := &models.User{ChatID: id}
	if _, err := c.db.NewUpdate().Model(user).WherePK().Set("is_subscribed = ?", true).Exec(ctx); err != nil {
		logger.Error().Err(err).Int64("chatId", id).Msg("Failed to subscribe user")
		return err
	}
	logger.Debug().Int64("chatId", id).Msg("User subscribed")
	return nil
}

func (c *Connection) Unsubscribe(ctx context.Context, id int64) error {
	user := &models.User{ChatID: id}
	if _, err := c.db.NewUpdate().Model(user).WherePK().Set("is_subscribed = ?", false).Exec(ctx); err != nil {
		logger.Error().Err(err).Int64("chatId", id).Msg("Failed to subscribe user")
		return err
	}
	logger.Debug().Int64("chatId", id).Msg("User unsubscribed")
	return nil
}

func (c *Connection) GetSubscribedUsers(ctx context.Context) ([]models.User, error) {
	users := []models.User{}
	if err := c.db.NewSelect().Model(&users).Where("is_subscribed = TRUE").Scan(ctx); err != nil {
		logger.Error().Err(err).Msg("Failed to read all subscribed users")
		return nil, err
	}
	return users, nil
}
