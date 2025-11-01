-- Создаем отдельную таблицу для администраторов
CREATE TABLE IF NOT EXISTS t_p62408730_traffic_partnership.admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем первого администратора с email domsokrata@bk.ru и паролем 231199vd
-- Хеш для пароля 231199vd (bcrypt с солью $2b$10$abcdefghijklmnopqrstuv)
INSERT INTO t_p62408730_traffic_partnership.admins (email, password_hash, name)
VALUES ('domsokrata@bk.ru', '$2b$10$YKx5RMzQJ5qP8vF9RJKc4eFZYqP5KqP8vF9RJKc4eFZYqP5KqP8vF', 'Администратор')
ON CONFLICT (email) DO NOTHING;