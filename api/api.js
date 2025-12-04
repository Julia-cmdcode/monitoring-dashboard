/**
 * 🌐 REMOTE METRICS API
 *
 * Волна 4: Remote веб-дашборд для мониторинга системы
 * Serverless функция для хранения и отдачи метрик с игры
 */

// Глобальная переменная для хранения метрик в памяти
let latestMetrics = {
  // Начальные данные
  criticalErrorsPerHour: 0,
  uiErrorsPerHour: 0,
  warningsPerHour: 0,
  systemHealthScore: 100,
  systemHealth: {
    score: 100,
    status: 'HEALTHY',
    trend: 'STABLE'
  },
  businessLevels: {
    criticalErrorsPerHour: 0,
    uiErrorsPerHour: 0,
    utilityWarningsPerHour: 0
  },
  topProblematicComponents: [],
  alerts: {
    critical: 0,
    error: 0,
    warning: 0,
    info: 0
  },
  performance: {
    averageResponseTime: 0,
    slowRequests: 0,
    memoryUsage: 0
  },

  // 🎬 RV MANAGER SIEGE HEALTH - КРИТИЧНЫЕ МЕТРИКИ МОНЕТИЗАЦИИ
  rvManagerSiegeHealth: {
    isHealthy: true,
    totalAttempts: 0,
    successfulShows: 0,
    failedShows: 0,
    rewardsDelivered: 0,
    pendingRewards: 0,
    sdkFailures: 0,
    fallbackActivations: 0,
    pendingRewardsProcessed: 0
  },

  // 💰 МОНЕТИЗАЦИЯ И РЕКЛАМА
  monetizationMetrics: {
    adShows: 0,
    adSuccessRate: 100,
    revenueImpact: 0,
    totalEarnings: 0,
    averageRewardValue: 0
  },

  // 🛡️ НАДЕЖНОСТЬ СИСТЕМЫ
  errorMetrics: {
    averageResponseTime: 0,
    recoveryRate: 100,
    criticalErrorsPerHour: 0,
    systemStability: 100
  },

  lastUpdate: new Date().toISOString(),
  lastUpdateRelative: 'Никогда',
  serverUptime: Date.now()
};

// История метрик для трендов (последние 24 часа)
let metricsHistory = [];
const MAX_HISTORY_SIZE = 288; // 24 часа * 12 измерений в час

// Helper functions
function updateHistory(metrics) {
  const historyEntry = {
    timestamp: Date.now(),
    ...metrics
  };

  metricsHistory.push(historyEntry);

  // Ограничиваем размер истории
  if (metricsHistory.length > MAX_HISTORY_SIZE) {
    metricsHistory = metricsHistory.slice(-MAX_HISTORY_SIZE);
  }
}

function calculateTrends() {
  if (metricsHistory.length < 12) { // Нужно минимум час истории
    return {
      healthTrend: 'INSUFFICIENT_DATA',
      criticalTrend: 'INSUFFICIENT_DATA',
      uiErrorsTrend: 'INSUFFICIENT_DATA'
    };
  }

  const recent = metricsHistory.slice(-12); // Последний час
  const previous = metricsHistory.slice(-24, -12); // Предыдущий час

  const recentHealth = recent.reduce((sum, m) => sum + m.systemHealthScore, 0) / recent.length;
  const previousHealth = previous.reduce((sum, m) => sum + m.systemHealthScore, 0) / previous.length;

  const recentCritical = recent.reduce((sum, m) => sum + m.businessLevels?.criticalErrorsPerHour || 0, 0) / recent.length;
  const previousCritical = previous.reduce((sum, m) => sum + m.businessLevels?.criticalErrorsPerHour || 0, 0) / previous.length;

  return {
    healthTrend: recentHealth > previousHealth ? 'IMPROVING' : recentHealth < previousHealth ? 'WORSENING' : 'STABLE',
    criticalTrend: recentCritical > previousCritical ? 'INCREASING' : recentCritical < previousCritical ? 'DECREASING' : 'STABLE',
    uiErrorsTrend: recentCritical > previousCritical ? 'INCREASING' : recentCritical < previousCritical ? 'DECREASING' : 'STABLE'
  };
}

function getRelativeTimeString(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 1) return 'только что';
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
    return `${diffHours} ч. назад`;
  } catch (error) {
    return 'неизвестно';
  }
}

export default function handler(request, response) {
  // Разрешаем CORS для конкретного домена дашборда
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004','https://monitoring-dashboard-git-main-julia-cmdcodes-projects.vercel.app'];
const origin = request.headers.origin;
if (allowedOrigins.includes(origin)) {
  response.setHeader('Access-Control-Allow-Origin', origin);
}
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Max-Age', '86400'); // 24 часа

  const { method } = request;

  if (method === 'OPTIONS') {
    // Handle preflight request
    response.status(200).end();
    return;
  }

  if (method === 'POST') {
    // 🎮 ИГРА ОТПРАВЛЯЕТ МЕТРИКИ
    try {
      const newMetrics = request.body;

      if (!newMetrics || typeof newMetrics !== 'object') {
        return response.status(400).json({
          error: 'Invalid metrics data',
          message: 'Request body must be a valid JSON object'
        });
      }

      // Обновляем метрики с валидацией
      latestMetrics = {
        ...newMetrics,
        lastUpdate: new Date().toISOString(),
        lastUpdateRelative: 'только что',
        serverUptime: latestMetrics.serverUptime
      };

      // Добавляем в историю для трендов
      updateHistory(newMetrics);

      console.log('📊 Metrics updated:', new Date().toISOString());

      response.status(200).json({
        message: 'Metrics updated successfully',
        timestamp: new Date().toISOString(),
        trends: calculateTrends()
      });

    } catch (error) {
      console.error('❌ Error updating metrics:', error);
      response.status(500).json({
        error: 'Server error',
        message: 'Failed to update metrics'
      });
    }

  } else if (method === 'GET') {
    // 📱 ДАШБОРД ЗАПРАШИВАЕТ ДАННЫЕ
    const trends = calculateTrends();

    // Обновляем относительное время
    latestMetrics.lastUpdateRelative = getRelativeTimeString(latestMetrics.lastUpdate);

    const responseData = {
      ...latestMetrics,
      trends,
      history: {
        size: metricsHistory.length,
        available_datapoints: metricsHistory.length,
        retention_hours: Math.round((MAX_HISTORY_SIZE * 5) / 60) // 5 минут между измерениями
      }
    };

    response.status(200).json(responseData);

  } else if (method === 'DELETE') {
    // 🧹 ОЧИСТКА ИСТОРИИ (для разработки)
    metricsHistory = [];
    latestMetrics = {
      criticalErrorsPerHour: 0,
      uiErrorsPerHour: 0,
      warningsPerHour: 0,
      systemHealthScore: 100,
      systemHealth: {
        score: 100,
        status: 'HEALTHY',
        trend: 'STABLE'
      },
      businessLevels: {
        criticalErrorsPerHour: 0,
        uiErrorsPerHour: 0,
        utilityWarningsPerHour: 0
      },
      topProblematicComponents: [],
      alerts: { critical: 0, error: 0, warning: 0, info: 0 },
      performance: { averageResponseTime: 0, slowRequests: 0, memoryUsage: 0 },
      lastUpdate: new Date().toISOString(),
      lastUpdateRelative: 'данные очищены',
      serverUptime: Date.now()
    };

    response.status(200).json({ message: 'Metrics history cleared' });

  } else {
    // ℹ️ ПОКАЗАТЬ СТАТУС СЕРВЕРА
    response.status(200).json({
      status: 'Slavic 2048 Remote Monitoring API is running',
      uptime: Math.round((Date.now() - latestMetrics.serverUptime) / 1000),
      uptime_formatted: `${Math.floor((Date.now() - latestMetrics.serverUptime) / (1000 * 60 * 60))}h ${Math.floor(((Date.now() - latestMetrics.serverUptime) / (1000 * 60)) % 60)}m`,
      metrics_heap: JSON.stringify(latestMetrics).length,
      history_size: metricsHistory.length,
      last_update: latestMetrics.lastUpdateRelative,
      endpoints: {
        get: 'GET /api/metrics - получить метрики',
        post: 'POST /api/metrics - отправить метрики',
        delete: 'DELETE /api/metrics - очистить историю',
        info: 'Любой другой метод - этот статус'
      }
    });
  }
}
