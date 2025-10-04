# My Web Development Portfolio

Коллекция веб-проектов, демонстрирующих различные технологии и подходы к разработке.

## 🌟 Проекты

### 1. [WeatherVista](./weather) - Приложение прогноза погоды
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js&logoColor=white)

Современное веб-приложение для отображения погодной информации с интерактивными картами и графиками.

**Особенности:**
- 📊 Почасовой прогноз с графиками
- 🗺️ Интерактивная карта с Leaflet.js
- 🌪️ Данные о качестве воздуха (AQI)
- 🌍 Поддержка многих языков (RU/EN/ES)
- 🎨 Темная/светлая тема
- ⭐ Система избранных городов

**Демо:** [Открыть проект](./weather/index.html)

---

### 2. [Cat Quiz](./cat-quiz-nestjs) - Игра-викторина о породах кошек
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)

Полнофункциональная веб-игра на NestJS с серверным рендерингом, базой данных и API.

**Особенности:**
- 🎮 Викторина с различными уровнями сложности
- 🏆 Система лидерборда с базой данных
- 🎯 Умный алгоритм подбора похожих пород
- 🌐 Интернационализация (RU/EN)
- ⏱️ Таймер и система очков
- 🔒 Административная панель

**Технический стек:**
- Backend: NestJS + TypeScript
- Database: Prisma ORM + SQLite
- Frontend: EJS + Bootstrap 5
- API: The Cat API

---

## 🚀 Запуск проектов

### WeatherVista
```bash
cd weather
# Откройте index.html в браузере
```

### Cat Quiz
```bash
cd cat-quiz-nestjs
npm install
cp .env.example .env  # Добавьте ваш CAT_API_KEY
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
# Откройте http://localhost:3000
```

## 🛠️ Технологии

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: NestJS, TypeScript
- **Database**: Prisma ORM, SQLite
- **Maps**: Leaflet.js
- **Charts**: Chart.js
- **APIs**: Open-Meteo API, The Cat API
- **Tools**: Docker, GitHub Actions

## 📧 Контакты

Если у вас есть вопросы или предложения, свяжитесь со мной!

---

*Каждый проект содержит подробную документацию в своей папке.*