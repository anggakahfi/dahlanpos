FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && apt-get install -y ca-certificates tzdata && rm -rf /var/lib/apt/lists/*

# Set timezone to Asia/Jakarta so all time operations use WIB
ENV TZ=Asia/Jakarta
RUN ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && echo "Asia/Jakarta" > /etc/timezone

WORKDIR /app

# Copy the pre-built Linux binary (built on host)
COPY server_linux ./server

# Copy migrations and other assets
COPY db/migrations ./db/migrations

# Ensure the server is executable
RUN chmod +x ./server

EXPOSE 8080

CMD ["./server"]
