# Assignment API Programmer Nutech Integrasi (PPOB REST API)

Repository REST API untuk modul Registrasi, Login, Cek Saldo, Top Up, dan Transaksi (Pulsa, Game).  
Dibuat sesuai Kontrak API Swagger dengan database design yang optimal, penanganan saldo yang akurat, error handling dan validasi input yang ketat, serta menggunakan raw query dengan implementasi prepared statement untuk keamanan.

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- pg (PostgreSQL Driver)
- dotenv

---

# Features

- Register User
- Login User
- JWT Authentication
- Get Banner
- Get Services
- Get Balance
- Top Up Balance
- Transaction Payment
- Transaction History

- Input Validation
- Error Handling
- Prepared Statement Query
- Database Transaction (BEGIN / COMMIT / ROLLBACK)

---

# Project Structure

```bash
src/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── moduleinformation.controller.js
│   └── transaction.controller.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
│
├── routes/
│   ├── auth.route.js
│   ├── moduleinformation.route.js
│   └── transaction.route.js
│
├── services/
│   ├── auth.service.js
│   ├── moduleinformation.service.js
│   └── transaction.service.js
│
├── utils/
│   ├── response.js
│   └── validator.js
│
├── app.js
└── index.js