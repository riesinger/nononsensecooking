package models

import "github.com/uptrace/bun"

type User struct {
	bun.BaseModel `bun:"table:users"`

	ChatID       int64  `bun:"chat_id,pk"`
	RecipeLocale string `bun:"recipe_locale"`
	IsSubscribed bool   `bun:"is_subscribed"`
}
