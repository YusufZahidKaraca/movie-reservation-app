-- 1. Ödemeler Tablosu (Payments)
-- Bilet alınmadan önce ödeme kaydı oluşur.
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL, -- Çekilen Tutar
    payment_status TEXT DEFAULT 'SUCCESS', -- SUCCESS, FAILED
    transaction_id TEXT, -- Banka referans no (Simülasyon)
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Biletler Tablosu (Tickets)
CREATE TABLE IF NOT EXISTS tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    showtime_id BIGINT REFERENCES showtimes(id),
    payment_id BIGINT REFERENCES payments(id), -- Hangi ödeme ile alındı?
    seat_number INT NOT NULL,
    purchase_time TIMESTAMP DEFAULT NOW(),
    
    -- 🛑 KRİTİK KISITLAMA (Constraint)
    -- Bir seansta, bir koltuk numarası sadece 1 kere var olabilir.
    -- Bu sayede aynı anda tıklayan 2 kişiden biri hata alır.
    UNIQUE(showtime_id, seat_number)
);