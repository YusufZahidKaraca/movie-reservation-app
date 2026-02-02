CREATE TABLE IF NOT EXISTS showtimes (
    id BIGSERIAL PRIMARY KEY,
    -- movie_id: Hangi filme ait?
    -- ON DELETE CASCADE: Film silinirse seansları da otomatik sil!
    movie_id BIGINT REFERENCES movies(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- 10 basamak, 2'si virgülden sonra (Örn: 150.50)
    created_at TIMESTAMP DEFAULT NOW()
);