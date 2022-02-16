FROM golang:alpine as builder

WORKDIR /code
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o nnc-bot ./cmd/nnc-bot

EXPOSE 50403

FROM scratch as runner
COPY --from=builder /code/nnc-bot /bin/nnc-bot
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
CMD [ "/bin/nnc-bot" ]
