# 📻 listen! – Стриминговый сервис для прослушивания радио

**listen! – это удобный стриминговый сервис, позволяющий слушать радиостанции, находить информацию о треках и сохранять любимые станции в избранное.**

<img width="1235" alt="image" src="https://github.com/user-attachments/assets/d878777a-40fe-425f-8014-7ffa09840ea3" />

---

## 🔧 Основные функции:

🎧 **Прослушивание радио** – доступ к множеству радиостанций в реальном времени.  

⭐ **Избранное** – добавление любимых станций для быстрого доступа.  

🎶 **Анализ треков** – определение названия композиции и исполнителя.  

🔄 **Парсинг радио** – автоматическое обновление списка станций и сохранение в БД.  

🧪 **Полное тестирование** – юнит- и интеграционные тесты (бекенд + фронтенд).

---

## 🛠 Технологии:

⚙️ **Backend**:
Python 3.12, FastAPI, FastAPI-Users, Pydantic 2.10, SQLAlchemy, Uvicorn, Alembic, SQLite

📱 **Frontend**:
JavaScript, TypeScript, React, SCSS

🧪 **Тестирование**:
Pytest, Jest, React Testing Library

---

## 🧪 Проверка работоспособности приложения:

1. При активированном `venv` установить зависимости:
   
   ```
   pip install -r requirements.txt
   ```

2. Запустите команду для тестирования `backend`:

   ```
   pytest
   ```

   **Результат работы**

   <img width="1040" alt="image" src="https://github.com/user-attachments/assets/4d659480-bce1-464e-9497-6bdf6d60862f" />

3. Запустите команду для тестирования `frontend` (работать в папке `frontend`):

   ```
   npm test
   ```

  **Результат работы**
  
   ![telegram-cloud-photo-size-2-5436064034542726722-x](https://github.com/user-attachments/assets/31daefd4-1648-4b0f-9fbf-f3de50cd69c2)

---

## 🚀 Установка и использование `Backend`:

**🛠️ Инструкция по запуску**

1. Создайте файл .env в директории

   ```
   DATABASE_URL - адрес подключения БД
   SECRET - секрет для генерации токенов
   ALLOWS_HOSTS = http://localhost:3000 - адрес фронтенда
   EMAIL_FIRST_ADMIN - почта первого суперпользователя, который создается при старте приложения
   PASSWORD_FIRST_ADMIN - пароль первого суперпользователя
   CLIENT_KEY_FINGERPRINT - API-key сервиса AcoustID для доступа к fingerprint'ам треков
   ```

2. При активированном `venv` установить зависимости:
   
   ```
   pip install -r requirements.txt
   ```

3. Применить `Alembic` миграции:

   ```
   alembic upgrade head
   ```

4. Запустить `Scrapy` парсер сбора радио.

   ```
   scrapy crawl radio
   ```

5. Запустить Веб-сервер

   ```
   uvicorn app.main:app
   ```
---

## 🚀 Установка и использование `Frontend`:

**🛠️ Инструкция по запуску (работать в папке frontend)**

1. Установите зависимости:
   
   ```
   npm install package.json
   ```

2. Запустите приложение

   ```
   npm start
   ```
