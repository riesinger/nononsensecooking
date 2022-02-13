sources := $(wildcard **/*.go)
binary := nnc-bot

$(binary): $(sources)
	go build -o $(binary) ./cmd/nnc-bot

run: $(binary)
	./$(binary)

clean:
	rm -rf $(binary)
