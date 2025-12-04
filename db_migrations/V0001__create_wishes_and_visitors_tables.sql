-- Создание таблицы для желаний
CREATE TABLE IF NOT EXISTS wishes (
    id BIGSERIAL PRIMARY KEY,
    wish TEXT NOT NULL,
    country VARCHAR(255) NOT NULL,
    telegram VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для посетителей
CREATE TABLE IF NOT EXISTS visitors (
    id VARCHAR(255) PRIMARY KEY,
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_category ON wishes(category);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit);