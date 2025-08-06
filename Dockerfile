# Dockerfile
# Многоступенчатая сборка для оптимизации размера образа

# Этап 1: Сборка приложения
FROM golang:1.23-alpine AS builder

# Установка необходимых пакетов
RUN apk add --no-cache git ca-certificates tzdata

# Создание пользователя для безопасности
RUN adduser -D -g '' appuser

# Установка рабочей директории
WORKDIR /build

# Копирование go.mod и go.sum для кэширования зависимостей
COPY go.mod go.sum ./

# Загрузка зависимостей
RUN go mod download
RUN go mod verify

# Копирование исходного кода
COPY main.go ./

# Сборка приложения
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o portfolio-website main.go

# Этап 2: Финальный образ
FROM scratch

# Импорт пользователя и группы из builder
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Копирование сертификатов CA
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Копирование временных зон
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Создание рабочей директории
WORKDIR /app

# Копирование скомпилированного приложения
COPY --from=builder /build/portfolio-website .

# Копирование статических файлов и шаблонов
COPY templates/ ./templates/
COPY static/ ./static/

# Создание директории для контента с правильными правами
COPY --chown=appuser:appuser content/ ./content/

# Использование непривилегированного пользователя
USER appuser

# Открытие порта
EXPOSE 8080

# Healthcheck для проверки состояния контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["/app/portfolio-website", "--health-check"] || exit 1

# Запуск приложения
CMD ["./portfolio-website"]