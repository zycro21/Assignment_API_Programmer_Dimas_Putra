CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    banner_name VARCHAR(255) NOT NULL,
    banner_image TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO banners (
    banner_name,
    banner_image,
    description
)
VALUES
(
    'Banner 1',
    'https://nutech-integrasi.app/dummy.jpg',
    'Lerem Ipsum Dolor sit amet'
),
(
    'Banner 2',
    'https://nutech-integrasi.app/dummy.jpg',
    'Lerem Ipsum Dolor sit amet'
),
(
    'Banner 3',
    'https://nutech-integrasi.app/dummy.jpg',
    'Lerem Ipsum Dolor sit amet'
),
(
    'Banner 4',
    'https://nutech-integrasi.app/dummy.jpg',
    'Lerem Ipsum Dolor sit amet'
),
(
    'Banner 5',
    'https://nutech-integrasi.app/dummy.jpg',
    'Lerem Ipsum Dolor sit amet'
),
(
    'Banner 6',
    'https://nutech-integrasi.app/dummy.jpg',
    'Lerem Ipsum Dolor sit amet'
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(100) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon TEXT,
    service_tariff BIGINT NOT NULL CHECK (service_tariff >= 0),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (
    service_code,
    service_name,
    service_icon,
    service_tariff
)
VALUES
(
    'PAJAK',
    'Pajak PBB',
    'https://nutech-integrasi.app/dummy.jpg',
    40000
),
(
    'PLN',
    'Listrik',
    'https://nutech-integrasi.app/dummy.jpg',
    10000
),
(
    'PDAM',
    'PDAM Berlangganan',
    'https://nutech-integrasi.app/dummy.jpg',
    40000
),
(
    'PULSA',
    'Pulsa',
    'https://nutech-integrasi.app/dummy.jpg',
    40000
),
(
    'PGN',
    'PGN Berlangganan',
    'https://nutech-integrasi.app/dummy.jpg',
    50000
),
(
    'MUSIK',
    'Musik Berlangganan',
    'https://nutech-integrasi.app/dummy.jpg',
    50000
),
(
    'TV',
    'TV Berlangganan',
    'https://nutech-integrasi.app/dummy.jpg',
    50000
),
(
    'PAKET_DATA',
    'Paket Data',
    'https://nutech-integrasi.app/dummy.jpg',
    50000
),
(
    'VOUCHER_GAME',
    'Voucher Game',
    'https://nutech-integrasi.app/dummy.jpg',
    100000
),
(
    'VOUCHER_MAKANAN',
    'Voucher Makanan',
    'https://nutech-integrasi.app/dummy.jpg',
    100000
),
(
    'QURBAN',
    'Qurban',
    'https://nutech-integrasi.app/dummy.jpg',
    200000
),
(
    'ZAKAT',
    'Zakat',
    'https://nutech-integrasi.app/dummy.jpg',
    300000
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_code VARCHAR(100)
    REFERENCES services(service_code),
    transaction_type VARCHAR(20) NOT NULL
    CHECK (transaction_type IN ('PAYMENT', 'TOPUP')),
    total_amount BIGINT NOT NULL
    CHECK (total_amount >= 0),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);