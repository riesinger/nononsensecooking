package telegram

import "context"

type UserStore interface {
	Upsert(ctx context.Context, id int64, locale string) error
	Subscribe(ctx context.Context, id int64) error
	Unsubscribe(ctx context.Context, id int64) error
}
