package telegram

import "context"

var messages map[string]map[string]string = map[string]map[string]string{
	"start.success": {
		"de": `Hallo du 👋
Ich bin der Bot für NoNonsense.cooking. Ich kann dich darüber informieren, wenn wir neue leckere Rezepte veröffentlichen 😋

Wenn du Benachrichtigungen erhalten möchtest, schicke mir einfach den Befehl /subscribe 🧑‍🍳
Du möchtest keine Benachrichtigungen mehr? Dann schicke den Befehl /unsubscribe 🙁

Falls du weitere Befehle kennenlernen möchtest, kannst du das mit /help machen 🤓`,
		"en": `Hey you 👋
I'm the bot for NoNonsense.cooking. I can inform you when we publish new yummy recipes over there 😋

If you want to get notified, just send me the command /subscribe 🧑‍🍳
You don't want to get notifications anymore? Just send me /unsubscribe 🙁

In case you want to learn what other commands I know, you can use /help 🤓`,
	},
	"start.error": {
		"de": `Hallo du 👋
Leider habe ich im Moment technische Probleme. Ich habe meinen Entwickler schon darüber informiert 🤖 Bitte starte doch später unseren Chat noch einmal, indem du den Befehl /start schickst 🤞`,
		"en": `Hey you 👋
Unfortunately, I'm currently having some technical problems. I informed my developer already 🤖 Please start our chat again later by sending the command /start 🤞`,
	},
	"subscribe.success": {
		"de": "Ich werde dich ab sofort informieren, wenn ein neues Rezept auf NoNonsense.cooking veröffentlicht wird 🧑‍🍳",
		"en": "I will tell you when a new recipe is published on NoNonsense.cooking 🧑‍🍳",
	},
	"subscribe.error": {
		"de": "Entschuldigung 😅 Leider habe ich im Moment technische Probleme. Ich habe meinen Entwickler schon darüber informiert. Du kannst es gerne später noch einmal versuchen, indem du noch einmal den Befehl /subscribe schickst 🙈",
		"en": "I'm sorry 😅 Unfortunately I currently have technical problems. My developer is already informed and will handle this ASAP. You can try again later by sending the command /subscribe again 🙈",
	},
	"unsubscribe.sucesss": {
		"de": "Ich werde dich nicht mehr darüber informieren, wenn ein neues Rezept veröffentlicht wird 🙊",
		"en": "I won't inform you about new recipes being published 🙊",
	},
	"unsubscribe.error": {
		"de": "Entschuldigung 😅 Leider habe ich im Moment technische Probleme. Ich habe meinen Entwickler schon darüber informiert. Du kannst es gerne später noch einmal versuchen, indem du noch einmal den Befehl /unsubscribe schickst 🙈",
		"en": "I won't inform you about new recipes being published 🙊",
	},
	"help.success": {
		"de": `🤖 Hier findest du eine Liste aller Befehle, die ich kenne:

/subscribe - Ich soll dich über neue Rezepte informieren? Alles klar!
/unsubscribe - Du willst keine Benachrichtigungen mehr? Na gut 🤷
/help - Das ließt du gerade 🤓
/stop - Ich lösche alle Daten, die ich über dich gespeichert habe. Du musst unseren Chat dann mit /start neu starten

Übrigens - Ich versuche so wenig Daten wie möglich zu speichern. Aktuell speichere ich von jedem Nutzer, der einen Chat mit mir gestartet hat die folgenden Daten:

Die Chat-ID - Damit kann ich diesen Chat eindeutig identifizieren. Das brauche ich, um dir Benachrichtigungen und Antworten schicken zu können
Deine Sprache - Damit ich dir die Rezepte in der richtigen Sprache schicken kann
Ob du abonniert bist - Ich schicke dir nur Benachrichtigungen, wenn du das möchtest`,
		"en": ` 🤖 Here you'll find the list of all commands I know:

/subscribe - I should notify you when we publish a new recipe? Got you!
/unsubscribe - Don't want notifications? Well okay 🤷
/help - That's what you're reading right now 🤓
/stop - I'll delete all data I've collected about you. You'll need to restart our chat with the /start command

By the way - I try to collect as little information about you as is sensible. Currently I save the following data from each user:

The chat ID - This is used to uniquely identify a chat. I need that to send you notifications and responses
Your language - This is used to send you recipes in your own language
Whether you're subscribed - I only send you notifications if you want me to `,
	},
	"unknownCommand": {
		"de": `Entschuldige, aber ich habe diesen Befehl leider nicht verstanden.
Um zu erfahren, welche Befehle ich verstehe, nutze den Befehl /help.`,
		"en": `Sorry, but I didn't understand this command.
To learn which commands I know, use the /help command.`,
	},
}

func successMessage(ctx context.Context, workflowName string) string {
	locale := localeFromContext(ctx)
	translations, messageExists := messages[workflowName+".success"]
	if !messageExists {
		logger.Error().Str("workflow", workflowName).Msg("No success message exists for this workflow")
		return ""
	}
	return translations[locale]
}

func errorMessage(ctx context.Context, workflowName string) string {
	locale := localeFromContext(ctx)
	translations, messageExists := messages[workflowName+".error"]
	if !messageExists {
		logger.Error().Str("workflow", workflowName).Msg("No error message exists for this workflow")
		return ""
	}
	return translations[locale]
}

func getMessage(locale string, id string) string {
	translations, idExists := messages[id]
	if !idExists {
		return ""
	}
	message, translationExists := translations[locale]
	if !translationExists {
		return ""
	}
	return message
}
