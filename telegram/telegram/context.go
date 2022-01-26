package telegram

import "context"

const (
	contextKeyChatLocale = "tgChatLocale"
)

func localeFromContext(ctx context.Context) string {
	locale, ok := ctx.Value(contextKeyChatLocale).(string)
	if !ok {
		return "en"
	}
	if locale != "en" && locale != "de" {
		return "en"
	}
	return locale
}
