CREATE TABLE IF NOT EXISTS movies (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    duration_min INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);