const { useState, useEffect, useRef } = React;

// Application Data
const appData = {
  "dashboard_stats": {"total_farms": 15, "active_alerts": 3, "recommendations_today": 12, "soil_tests_pending": 5},
  "soil_health": {"nitrogen": "120 kg/ha", "phosphorus": "55 kg/ha", "potassium": "80 kg/ha", "ph_level": "6.8", "status": "Good", "last_updated": "2025-09-24T14:30:00Z", "moisture": "45%", "organic_matter": "3.2%"},
  "weather": {"current": {"temperature": "28°C", "condition": "Partly Cloudy", "humidity": "65%", "wind_speed": "12 km/h", "location": "Pune, Maharashtra"}, "forecast": [{"day": "Today", "high": "32°C", "low": "22°C", "condition": "Sunny"}, {"day": "Tomorrow", "high": "30°C", "low": "20°C", "condition": "Cloudy"}, {"day": "Thursday", "high": "29°C", "low": "21°C", "condition": "Rain"}]},
  "recent_activity": [{"timestamp": "2025-09-24T11:45:00Z", "type": "soil_test", "message": "Soil test completed for Field A - pH level normal", "status": "success"}, {"timestamp": "2025-09-24T11:30:00Z", "type": "pest_detection", "message": "Aphids detected in cotton crop - treatment recommended", "status": "warning"}, {"timestamp": "2025-09-24T11:15:00Z", "type": "market_update", "message": "Rice prices increased by ₹50/quintal in local market", "status": "info"}, {"timestamp": "2025-09-24T11:00:00Z", "type": "weather_alert", "message": "Rain expected in next 48 hours - postpone pesticide application", "status": "alert"}],
  "market_prices": [{"crop": "Rice", "price": "₹2,150/quintal", "change": "+2.3%", "trend": "up"}, {"crop": "Wheat", "price": "₹2,800/quintal", "change": "-1.1%", "trend": "down"}, {"crop": "Cotton", "price": "₹6,200/quintal", "change": "+5.2%", "trend": "up"}],
  "pest_alerts": [{"pest": "Aphids", "crop": "Cotton", "severity": "Medium", "affected_area": "2.5 acres", "recommendation": "Apply neem oil spray"}, {"pest": "Leaf Blight", "crop": "Rice", "severity": "High", "affected_area": "1.8 acres", "recommendation": "Immediate fungicide treatment required"}]
};

// Sidebar Component
const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
    { id: 'soil', label: 'Soil Analysis', icon: 'fas fa-seedling' },
    { id: 'pest', label: 'Pest Detection', icon: 'fas fa-bug' },
    { id: 'crops', label: 'Crop Advisory', icon: 'fas fa-wheat-awn' },
    { id: 'market', label: 'Market Prices', icon: 'fas fa-chart-line' },
    { id: 'weather', label: 'Weather', icon: 'fas fa-cloud-sun' },
    { id: 'reports', label: 'Reports', icon: 'fas fa-file-alt' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
  ];

  return React.createElement('div', { className: 'sidebar' },
    React.createElement('div', { className: 'logo' },
      React.createElement('i', { className: 'fas fa-leaf logo-icon' }),
      React.createElement('h1', null, 'SmartFarm')
    ),
    React.createElement('ul', { className: 'nav-menu' },
      menuItems.map(item => 
        React.createElement('li', { key: item.id, className: 'nav-item' },
          React.createElement('a', {
            className: `nav-link ${activeSection === item.id ? 'active' : ''}`,
            onClick: () => setActiveSection(item.id)
          },
            React.createElement('i', { className: `${item.icon} nav-icon` }),
            item.label
          )
        )
      )
    )
  );
};

// Header Component
const Header = ({ title }) => {
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return React.createElement('div', { className: 'header' },
    React.createElement('div', null,
      React.createElement('div', { className: 'breadcrumb' },
        React.createElement('span', { className: 'breadcrumb-item' }, 'SmartFarm'),
        React.createElement('i', { className: 'fas fa-chevron-right' }),
        React.createElement('span', { className: 'breadcrumb-item active' }, title)
      ),
      React.createElement('h2', { className: 'page-title' }, title)
    ),
    React.createElement('div', { className: 'header-info' },
      React.createElement('div', { className: 'user-info' },
        React.createElement('div', null,
          React.createElement('div', { style: { fontWeight: 500, color: 'var(--color-text)' } }, 'Farm Manager'),
          React.createElement('div', { style: { fontSize: 'var(--font-size-xs)' } }, formatDate())
        ),
        React.createElement('div', { className: 'user-avatar' }, 'FM')
      )
    )
  );
};

// Soil Health Card Component
const SoilHealthCard = () => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return React.createElement('div', { className: 'soil-health-card' },
    React.createElement('div', { className: 'soil-header' },
      React.createElement('h3', { className: 'soil-title' },
        React.createElement('i', { className: 'fas fa-seedling', style: { color: 'var(--color-primary)' } }),
        'Soil Health Overview'
      ),
      React.createElement('div', { className: 'soil-status' },
        React.createElement('span', { className: 'status status--success' }, appData.soil_health.status),
        React.createElement('div', { style: { fontSize: 'var(--font-size-xs)', marginTop: '4px' } },
          'Last updated: ', formatDate(appData.soil_health.last_updated)
        )
      )
    ),
    React.createElement('div', { className: 'soil-metrics' },
      React.createElement('div', { className: 'soil-metric' },
        React.createElement('div', { className: 'soil-metric-label' }, 'Nitrogen'),
        React.createElement('div', { className: 'soil-metric-value' }, appData.soil_health.nitrogen)
      ),
      React.createElement('div', { className: 'soil-metric' },
        React.createElement('div', { className: 'soil-metric-label' }, 'Phosphorus'),
        React.createElement('div', { className: 'soil-metric-value' }, appData.soil_health.phosphorus)
      ),
      React.createElement('div', { className: 'soil-metric' },
        React.createElement('div', { className: 'soil-metric-label' }, 'Potassium'),
        React.createElement('div', { className: 'soil-metric-value' }, appData.soil_health.potassium)
      ),
      React.createElement('div', { className: 'soil-metric' },
        React.createElement('div', { className: 'soil-metric-label' }, 'pH Level'),
        React.createElement('div', { className: 'soil-metric-value' }, appData.soil_health.ph_level)
      )
    ),
    React.createElement('div', { className: 'soil-additional' },
      React.createElement('div', { className: 'soil-metric' },
        React.createElement('div', { className: 'soil-metric-label' }, 'Moisture'),
        React.createElement('div', { className: 'soil-metric-value' }, appData.soil_health.moisture)
      ),
      React.createElement('div', { className: 'soil-metric' },
        React.createElement('div', { className: 'soil-metric-label' }, 'Organic Matter'),
        React.createElement('div', { className: 'soil-metric-value' }, appData.soil_health.organic_matter)
      )
    )
  );
};

// Quick Stats Component
const QuickStats = () => {
  const stats = [
    {
      title: 'Total Farms Monitored',
      value: appData.dashboard_stats.total_farms,
      icon: 'fas fa-farm',
      iconClass: 'stat-icon--primary'
    },
    {
      title: 'Active Alerts',
      value: appData.dashboard_stats.active_alerts,
      icon: 'fas fa-exclamation-triangle',
      iconClass: 'stat-icon--warning'
    },
    {
      title: 'Today\'s Recommendations',
      value: appData.dashboard_stats.recommendations_today,
      icon: 'fas fa-lightbulb',
      iconClass: 'stat-icon--success'
    },
    {
      title: 'Weather Status',
      value: 'Good',
      icon: 'fas fa-cloud-sun',
      iconClass: 'stat-icon--info'
    }
  ];

  return React.createElement('div', { className: 'stats-grid' },
    stats.map((stat, index) =>
      React.createElement('div', { key: index, className: 'stat-card' },
        React.createElement('div', { className: 'stat-header' },
          React.createElement('h4', { className: 'stat-title' }, stat.title),
          React.createElement('div', { className: `stat-icon ${stat.iconClass}` },
            React.createElement('i', { className: stat.icon })
          )
        ),
        React.createElement('div', { className: 'stat-value' }, stat.value)
      )
    )
  );
};

// Feature Cards Component
const FeatureCards = ({ setActiveSection, setSelectedModal }) => {
  const features = [
    {
      id: 'pest',
      title: 'Pest Detection',
      description: 'AI-powered pest identification and treatment recommendations',
      icon: 'fas fa-bug',
      action: () => setActiveSection('pest')
    },
    {
      id: 'crops',
      title: 'Crop Advisory',
      description: 'Expert guidance for optimal crop management',
      icon: 'fas fa-wheat-awn',
      action: () => setActiveSection('crops')
    },
    {
      id: 'market',
      title: 'Market Prices',
      description: 'Real-time market prices and trends analysis',
      icon: 'fas fa-chart-line',
      action: () => setActiveSection('market')
    },
    {
      id: 'expert',
      title: 'Ask Expert',
      description: 'Connect with agricultural experts for personalized advice',
      icon: 'fas fa-user-md',
      action: () => setSelectedModal('expert')
    }
  ];

  return React.createElement('div', { className: 'feature-grid' },
    features.map(feature =>
      React.createElement('div', { 
        key: feature.id, 
        className: 'feature-card',
        onClick: feature.action
      },
        React.createElement('i', { className: `${feature.icon} feature-icon` }),
        React.createElement('h4', { className: 'feature-title' }, feature.title),
        React.createElement('p', { className: 'feature-description' }, feature.description),
        React.createElement('button', { className: 'btn btn--primary btn--sm' }, 'Access')
      )
    )
  );
};

// Weather Widget Component
const WeatherWidget = () => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Sunny': 'fas fa-sun',
      'Partly Cloudy': 'fas fa-cloud-sun',
      'Cloudy': 'fas fa-cloud',
      'Rain': 'fas fa-cloud-rain'
    };
    return iconMap[condition] || 'fas fa-cloud';
  };

  return React.createElement('div', { className: 'weather-card' },
    React.createElement('h3', { className: 'activity-title' }, 
      React.createElement('i', { className: 'fas fa-map-marker-alt', style: { marginRight: '8px' } }),
      appData.weather.current.location
    ),
    React.createElement('div', { className: 'weather-current' },
      React.createElement('div', null,
        React.createElement('div', { className: 'weather-temp' }, appData.weather.current.temperature),
        React.createElement('div', { className: 'weather-condition' }, appData.weather.current.condition)
      ),
      React.createElement('i', { className: `${getWeatherIcon(appData.weather.current.condition)} weather-icon` })
    ),
    React.createElement('div', { className: 'weather-details' },
      React.createElement('div', { className: 'weather-detail' },
        React.createElement('i', { className: 'fas fa-tint', style: { marginRight: '6px' } }),
        'Humidity: ', appData.weather.current.humidity
      ),
      React.createElement('div', { className: 'weather-detail' },
        React.createElement('i', { className: 'fas fa-wind', style: { marginRight: '6px' } }),
        'Wind: ', appData.weather.current.wind_speed
      )
    ),
    React.createElement('div', { className: 'weather-forecast' },
      React.createElement('h4', { style: { margin: '0 0 12px 0', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' } }, 
        '3-Day Forecast'
      ),
      appData.weather.forecast.map((day, index) =>
        React.createElement('div', { key: index, className: 'forecast-item' },
          React.createElement('span', { className: 'forecast-day' }, day.day),
          React.createElement('span', { className: 'forecast-temps' }, `${day.high} / ${day.low}`)
        )
      )
    )
  );
};

// Activity Feed Component
const ActivityFeed = () => {
  const getActivityIcon = (type) => {
    const iconMap = {
      'soil_test': 'S',
      'pest_detection': 'P',
      'market_update': 'M',
      'weather_alert': 'W'
    };
    return iconMap[type] || 'A';
  };

  const getActivityClass = (status) => {
    const classMap = {
      'success': 'activity-avatar--success',
      'warning': 'activity-avatar--warning',
      'info': 'activity-avatar--info',
      'alert': 'activity-avatar--error'
    };
    return classMap[status] || 'activity-avatar--info';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return React.createElement('div', { className: 'activity-card' },
    React.createElement('div', { className: 'activity-header' },
      React.createElement('h3', { className: 'activity-title' }, 'Recent Activity'),
      React.createElement('button', { className: 'export-btn' },
        React.createElement('i', { className: 'fas fa-download' }),
        'Export'
      )
    ),
    appData.recent_activity.map((activity, index) =>
      React.createElement('div', { key: index, className: 'activity-item' },
        React.createElement('div', { className: `activity-avatar ${getActivityClass(activity.status)}` },
          getActivityIcon(activity.type)
        ),
        React.createElement('div', { className: 'activity-content' },
          React.createElement('p', { className: 'activity-message' }, activity.message),
          React.createElement('div', { className: 'activity-time' }, formatTime(activity.timestamp))
        )
      )
    )
  );
};

// Market Prices Component
const MarketPrices = () => {
  return React.createElement('div', null,
    React.createElement('h3', { 
      className: 'section-title',
      style: { marginBottom: 'var(--space-16)' }
    }, 'Market Prices'),
    React.createElement('div', { className: 'market-grid' },
      appData.market_prices.map((item, index) =>
        React.createElement('div', { key: index, className: 'price-card' },
          React.createElement('h4', { className: 'price-crop' }, item.crop),
          React.createElement('div', { className: 'price-value' }, item.price),
          React.createElement('div', { 
            className: `price-change price-change--${item.trend}`
          }, item.change)
        )
      )
    )
  );
};

// Pest Alerts Component
const PestAlerts = () => {
  return React.createElement('div', { className: 'pest-alerts' },
    React.createElement('h3', { 
      className: 'section-title',
      style: { marginBottom: 'var(--space-16)' }
    }, 'Pest Alerts'),
    appData.pest_alerts.map((alert, index) =>
      React.createElement('div', { key: index, className: 'pest-alert-item' },
        React.createElement('div', { className: 'pest-alert-header' },
          React.createElement('h4', { className: 'pest-name' }, `${alert.pest} - ${alert.crop}`),
          React.createElement('span', { className: 'pest-severity' }, alert.severity)
        ),
        React.createElement('p', { className: 'pest-details' }, 
          `Affected area: ${alert.affected_area}`
        ),
        React.createElement('p', { className: 'pest-recommendation' }, 
          `Recommendation: ${alert.recommendation}`
        )
      )
    )
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  return React.createElement('div', { className: `modal ${!isOpen ? 'hidden' : ''}` },
    React.createElement('div', { className: 'modal-content' },
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h3', { className: 'modal-title' }, title),
        React.createElement('button', { className: 'modal-close', onClick: onClose },
          React.createElement('i', { className: 'fas fa-times' })
        )
      ),
      children
    )
  );
};

// Dashboard Content Component
const Dashboard = ({ setActiveSection, setSelectedModal }) => {
  return React.createElement('div', null,
    React.createElement('div', { className: 'dashboard-grid' },
      React.createElement('div', { className: 'main-panel' },
        React.createElement(SoilHealthCard),
        React.createElement(MarketPrices),
        React.createElement(PestAlerts)
      ),
      React.createElement('div', { className: 'sidebar-panel' },
        React.createElement(QuickStats),
        React.createElement(WeatherWidget),
        React.createElement(ActivityFeed)
      )
    ),
    React.createElement('div', { style: { marginTop: 'var(--space-24)' } },
      React.createElement('h3', { 
        className: 'section-title',
        style: { marginBottom: 'var(--space-16)' }
      }, 'Quick Access'),
      React.createElement(FeatureCards, { setActiveSection, setSelectedModal })
    )
  );
};

// Section Components
const SoilAnalysis = () => {
  return React.createElement('div', null,
    React.createElement(SoilHealthCard),
    React.createElement('div', { style: { marginTop: 'var(--space-24)' } },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card__body' },
          React.createElement('h3', { style: { margin: '0 0 16px 0' } }, 'Soil Analysis History'),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: '0' } },
            'Detailed soil analysis reports show optimal nutrient levels across all monitored fields. Regular testing ensures sustained soil health and productivity.'
          )
        )
      )
    )
  );
};

const PestDetectionSection = () => {
  return React.createElement('div', null,
    React.createElement(PestAlerts),
    React.createElement('div', { style: { marginTop: 'var(--space-24)' } },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card__body' },
          React.createElement('h3', { style: { margin: '0 0 16px 0' } }, 'AI-Powered Pest Detection'),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: '0' } },
            'Our advanced AI system continuously monitors crop health and identifies pest threats early. Upload crop images for instant analysis and receive targeted treatment recommendations.'
          ),
          React.createElement('button', { className: 'btn btn--primary', style: { marginTop: '16px' } }, 
            React.createElement('i', { className: 'fas fa-camera' }),
            ' Upload Image for Analysis'
          )
        )
      )
    )
  );
};

const CropAdvisory = () => {
  return React.createElement('div', null,
    React.createElement('div', { className: 'card' },
      React.createElement('div', { className: 'card__body' },
        React.createElement('h3', { style: { margin: '0 0 16px 0' } }, 'Crop Advisory Services'),
        React.createElement('p', { style: { margin: '0 0 16px 0' } }, 
          'Get expert advice on crop management, fertilization schedules, and best practices for optimal yield.'
        ),
        React.createElement('div', { className: 'stats-grid', style: { marginTop: '20px' } },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('div', { className: 'stat-header' },
              React.createElement('h4', { className: 'stat-title' }, 'Fertilization Schedule'),
              React.createElement('div', { className: 'stat-icon stat-icon--success' },
                React.createElement('i', { className: 'fas fa-calendar' })
              )
            ),
            React.createElement('div', { className: 'stat-value' }, 'Next: 2 Days')
          ),
          React.createElement('div', { className: 'stat-card' },
            React.createElement('div', { className: 'stat-header' },
              React.createElement('h4', { className: 'stat-title' }, 'Irrigation Advice'),
              React.createElement('div', { className: 'stat-icon stat-icon--info' },
                React.createElement('i', { className: 'fas fa-tint' })
              )
            ),
            React.createElement('div', { className: 'stat-value' }, 'Moderate')
          )
        )
      )
    )
  );
};

const MarketSection = () => {
  return React.createElement('div', null,
    React.createElement(MarketPrices),
    React.createElement('div', { style: { marginTop: 'var(--space-24)' } },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card__body' },
          React.createElement('h3', { style: { margin: '0 0 16px 0' } }, 'Market Analytics'),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: '0 0 16px 0' } },
            'Track real-time commodity prices and market trends to make informed selling decisions.'
          ),
          React.createElement('div', { className: 'stats-grid' },
            React.createElement('div', { className: 'stat-card' },
              React.createElement('div', { className: 'stat-header' },
                React.createElement('h4', { className: 'stat-title' }, 'Best Selling Day'),
                React.createElement('div', { className: 'stat-icon stat-icon--success' },
                  React.createElement('i', { className: 'fas fa-calendar-day' })
                )
              ),
              React.createElement('div', { className: 'stat-value' }, 'Friday')
            ),
            React.createElement('div', { className: 'stat-card' },
              React.createElement('div', { className: 'stat-header' },
                React.createElement('h4', { className: 'stat-title' }, 'Price Alert'),
                React.createElement('div', { className: 'stat-icon stat-icon--warning' },
                  React.createElement('i', { className: 'fas fa-bell' })
                )
              ),
              React.createElement('div', { className: 'stat-value' }, 'Active')
            )
          )
        )
      )
    )
  );
};

const WeatherSection = () => {
  return React.createElement('div', null,
    React.createElement(WeatherWidget),
    React.createElement('div', { style: { marginTop: 'var(--space-24)' } },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card__body' },
          React.createElement('h3', { style: { margin: '0 0 16px 0' } }, 'Weather Monitoring'),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: '0 0 16px 0' } },
            'Extended weather forecasts and agricultural weather alerts help plan farming activities effectively.'
          ),
          React.createElement('div', { className: 'stats-grid' },
            React.createElement('div', { className: 'stat-card' },
              React.createElement('div', { className: 'stat-header' },
                React.createElement('h4', { className: 'stat-title' }, 'Rain Probability'),
                React.createElement('div', { className: 'stat-icon stat-icon--info' },
                  React.createElement('i', { className: 'fas fa-cloud-rain' })
                )
              ),
              React.createElement('div', { className: 'stat-value' }, '70%')
            ),
            React.createElement('div', { className: 'stat-card' },
              React.createElement('div', { className: 'stat-header' },
                React.createElement('h4', { className: 'stat-title' }, 'UV Index'),
                React.createElement('div', { className: 'stat-icon stat-icon--warning' },
                  React.createElement('i', { className: 'fas fa-sun' })
                )
              ),
              React.createElement('div', { className: 'stat-value' }, 'High')
            )
          )
        )
      )
    )
  );
};

const Reports = () => {
  return React.createElement('div', null,
    React.createElement('div', { className: 'card' },
      React.createElement('div', { className: 'card__body' },
        React.createElement('h3', { style: { margin: '0 0 20px 0' } }, 'Reports & Analytics'),
        React.createElement('div', { className: 'search-filter' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search reports...',
            className: 'search-input'
          }),
          React.createElement('select', { className: 'form-control', style: { width: 'auto' } },
            React.createElement('option', null, 'All Reports'),
            React.createElement('option', null, 'Soil Reports'),
            React.createElement('option', null, 'Pest Reports'),
            React.createElement('option', null, 'Weather Reports')
          ),
          React.createElement('button', { className: 'btn btn--primary' },
            React.createElement('i', { className: 'fas fa-download' }),
            ' Generate Report'
          )
        ),
        React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: '16px 0 0 0' } },
          'Generate comprehensive reports for soil analysis, pest detection, weather patterns, and crop performance. Export data in PDF, CSV, or Excel formats.'
        )
      )
    )
  );
};

const Settings = () => {
  return React.createElement('div', null,
    React.createElement('div', { className: 'card' },
      React.createElement('div', { className: 'card__body' },
        React.createElement('h3', { style: { margin: '0 0 20px 0' } }, 'System Settings'),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Notification Preferences'),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' } },
            React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-8)' } },
              React.createElement('input', { type: 'checkbox', defaultChecked: true }),
              'Email alerts for pest detection'
            ),
            React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-8)' } },
              React.createElement('input', { type: 'checkbox', defaultChecked: true }),
              'SMS notifications for weather alerts'
            ),
            React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-8)' } },
              React.createElement('input', { type: 'checkbox', defaultChecked: false }),
              'Daily summary reports'
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Data Retention'),
          React.createElement('select', { className: 'form-control' },
            React.createElement('option', null, '6 months'),
            React.createElement('option', null, '1 year'),
            React.createElement('option', null, '2 years')
          )
        ),
        React.createElement('button', { className: 'btn btn--primary' }, 'Save Settings')
      )
    )
  );
};

// Main App Component
const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedModal, setSelectedModal] = useState(null);

  const getSectionTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      soil: 'Soil Analysis',
      pest: 'Pest Detection',
      crops: 'Crop Advisory',
      market: 'Market Prices',
      weather: 'Weather',
      reports: 'Reports',
      settings: 'Settings'
    };
    return titles[activeSection] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return React.createElement(Dashboard, { setActiveSection, setSelectedModal });
      case 'soil':
        return React.createElement(SoilAnalysis);
      case 'pest':
        return React.createElement(PestDetectionSection);
      case 'crops':
        return React.createElement(CropAdvisory);
      case 'market':
        return React.createElement(MarketSection);
      case 'weather':
        return React.createElement(WeatherSection);
      case 'reports':
        return React.createElement(Reports);
      case 'settings':
        return React.createElement(Settings);
      default:
        return React.createElement(Dashboard, { setActiveSection, setSelectedModal });
    }
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  return React.createElement('div', { className: 'dashboard-layout' },
    React.createElement(Sidebar, {
      activeSection,
      setActiveSection
    }),
    React.createElement('div', { className: 'main-content' },
      React.createElement(Header, {
        title: getSectionTitle()
      }),
      renderContent()
    ),
    React.createElement(Modal, {
      isOpen: selectedModal === 'expert',
      onClose: closeModal,
      title: 'Ask Expert'
    },
      React.createElement('div', null,
        React.createElement('p', { style: { marginBottom: '16px' } }, 
          'Connect with our agricultural experts for personalized advice and support.'
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Your Question'),
          React.createElement('textarea', {
            className: 'form-control',
            rows: 4,
            placeholder: 'Describe your farming question or concern...'
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Crop Type'),
          React.createElement('select', { className: 'form-control' },
            React.createElement('option', null, 'Select crop'),
            React.createElement('option', null, 'Rice'),
            React.createElement('option', null, 'Wheat'),
            React.createElement('option', null, 'Cotton')
          )
        ),
        React.createElement('button', { className: 'btn btn--primary btn--full-width' }, 
          'Submit Question'
        )
      )
    )
  );
};

// Render the app
ReactDOM.render(React.createElement(App), document.getElementById('root'));