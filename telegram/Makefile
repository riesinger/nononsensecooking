sources := $(wildcard **/*.go)

nnc-bot: $(sources)
	go build ./cmd/nnc-bot

run: nnc-bot
  source .env
	./nnc-bot
