FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server ./cmd/server/main.go

FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && apt-get install -y ca-certificates tzdata && rm -rf /var/lib/apt/lists/*

# Set timezone to Asia/Jakarta so all time operations use WIB
ENV TZ=Asia/Jakarta
RUN ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && echo "Asia/Jakarta" > /etc/timezone

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/server ./server

# Copy migrations and other assets
COPY db/migrations ./db/migrations

EXPOSE 8080

CMD ["./server"]
