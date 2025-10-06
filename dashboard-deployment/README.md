# 🌐 Dashboard Deployment Guide

**Remote веб-дашборд для мониторинга Slavic 2048 система ошибок**

Этот пакет содержит готовые к развертыванию файлы для создания remote monitoring dashboard.

---

## 📁 Содержимое пакета

```
dashboard-deployment/
├── api.js          # Vercel Serverless Function (backend)
├── index.html      # Dashboard интерфейс (frontend)
└── README.md       # Эта инструкция
```

---

## 🚀 МЕТОД 1: GitHub Pages (БЕСПЛАТНЫЙ, ПРОСТОЙ, 5 МИНУТ)

### Шаг 1: Создать новый репозиторий на GitHub
```
1. Откройте https://github.com/new
2. Репозиторий: `slavic2048-dashboard`
3. Description: "Remote monitoring dashboard for Slavic 2048"
4. Нажмите "Create repository"
```

### Шаг 2: Загрузить файлы
```bash
# Скачайте эту папку dashboard-deployment/
# Или скопируйте файлы из вашего проекта:
# - api.js → api.js
# - dashboard.html → index.html

# Загрузите все файлы в GitHub через браузер или git:
git init
git remote add origin https://github.com/YOUR_USERNAME/slavic2048-dashboard.git
git add .
git commit -m "Initial dashboard deployment"
git push -u origin main
```

### Шаг 3: Включить GitHub Pages
```
1. В репозитории → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: main, Folder: /(root)
4. Save
5. Ждем 1-2 минуты, получаем URL: https://your-username.github.io/slavic2048-dashboard/
```

### Шаг 4: Протестировать
```
1. Откройте https://your-username.github.io/slavic2048-dashboard/
2. Покажет "не удается загрузить данные" - нормально, API еще не настроен
```

---

## ⚡ МЕТОД 2: Vercel (БЕСПЛАТНЫЙ, ПРОСТОЙ, 3 МИНУТЫ)

### Шаг 1: Создать новый проект на Vercel
```
1. Откройте https://vercel.com/new
2. → Import Git Repository
3. Выберите репозиторий с dashboard файлами
4. Project Name: `slavic2048-monitor`
5. Framework Preset: Other
6. Deploy
```

### Шаг 2: Получить API URL
После деплоя Vercel даст URL типа: `https://slavic2048-monitor.vercel.app`

### Шаг 3: Обновить API URL в дашборде
```bash
# Правьте строку в dashboard.html:
const API_URL = 'https://slavic2048-monitor.vercel.app/api/metrics';
```

### Шаг 4: Залить изменения и redeploy
```bash
git add .
git commit -m "Set API URL"
git push
# Vercel автоматически redeploy'ит
```

---

## 🔧 НАСТРОЙКА СЕРВЕРА В ИГРЕ

После того как API развернут, нужно активировать отправку метрик из игры:

### Шаг 1: Обновить конфигурацию в игре
```typescript
// В файле ErrorMonitorService.ts:
const METRICS_CONFIG = {
  enabled: true, // Изменить на true
  endpoint: 'https://YOUR-PROJECT-URL/api/metrics', // Ваш URL
  sendInterval: 30000, // Отправлять каждые 30 сек
  retryAttempts: 3,
  retryDelay: 5000
};
```

### Шаг 2: Задеплоить обновленную игру
```bash
npm run build
npm run deploy
```

### Шаг 3: Протестировать
```bash
# Теперь игра будет автоматически отправлять метрики каждые 30 секунд
# Откройте dashboard - должны появиться данные!
```

---

## 🎯 ПОЛУЧЕННЫЕ URL'Ы:

### После GitHub Pages:
- **Dashboard**: `https://your-username.github.io/slavic2048-dashboard/`
- **API**: `https://your-username.github.io/slavic2048-dashboard/api.js`

### После Vercel:
- **Dashboard**: `https://slavic2048-monitor.vercel.app/` (если index.html в root)
- **API**: `https://slavic2048-monitor.vercel.app/api/metrics`

---

## ✨ КОТОРЫЙ МЕТОД ЛУЧШЕ?

### 🟢 GitHub Pages: (РЕКОМЕНДУЮ)
- ✅ Бесплатно навсегда
- ✅ Простая настройка
- ✅ Статические файлы sibling'а с проектом игры
- ✅ Git integration

### 🟡 Vercel:
- ✅ Бесплатно навсегда (до определенных лимитов)
- ✅ Автоматические deployments
- ✅ Лучше для API роутинга

---

## 🔍 РЕШЕНИЕ ПРОБЛЕМ

### Dashboard показывает "не удается загрузить данные":
- Проверьте API URL в dashboard.html
- Проверьте что игра запущена и отправляет метрики
- Проверьте консоль браузера на CORS ошибки

### API возвращает ошибки:
- Для GitHub Pages: API не будет работать, нужно использовать Vercel
- Для Vercel: Проверьте логи в Vercel dashboard

### Metrics не приходят:
- Проверьте console игры - должны быть сообщения "🌐 Отправка метрик на сервер"
- Проверьте METRICS_CONFIG.endpoint в ErrorMonitorService.ts
- Проверьте FIREWALL/CORS политики

---

## 🚀 ГОТОВО!

После настройки вы получите полнофункциональный remote monitoring dashboard:

- 📊 **Real-time метрики здоровья системы**
- 🚨 **Live алерты по ошибкам**
- ⚡ **Performance monitoring**
- 📱 **Responsive дизайн для любого устройства**
- 🎯 **Тренды и аналитика**

**Ваш enterprise-grade monitoring system готов! 🎉**

---

## ❓ ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ?

Если что-то не работает:
1. Проверьте консоль браузера на ошибки
2. Проверьте network tab на failed requests
3. Сравните URL'ы с примерами выше
4. Напишите issue с подробностями
