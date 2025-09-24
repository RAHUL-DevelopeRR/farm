# AgroIntel - Multi-Agent Smart Farming Companion
## Complete Development Guide & Code Structure

### 🏗️ Project Architecture Overview

```
AgroIntel-Project/
├── mobile-app/ (React Native)
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── utils/
│   │   └── store/
│   ├── assets/
│   └── package.json
├── web-dashboard/ (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── backend-api/ (Node.js/Python)
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── middleware/
└── database/ (MongoDB/PostgreSQL)
```

---

## 📱 Mobile App - React Native Implementation

### Core File Structure

```
mobile-app/src/
├── components/
│   ├── common/
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Loading.js
│   │   └── OfflineBanner.js
│   ├── weather/
│   │   ├── WeatherWidget.js
│   │   └── ForecastCard.js
│   ├── soil/
│   │   └── SoilHealthCard.js
│   └── pest/
│       └── PestDetectionResult.js
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.js
│   │   └── OTPVerification.js
│   ├── Dashboard/
│   │   └── DashboardScreen.js
│   ├── CropAdvisory/
│   │   └── CropAdvisoryScreen.js
│   ├── PestDetection/
│   │   └── PestDetectionScreen.js
│   ├── MarketPrices/
│   │   └── MarketPricesScreen.js
│   └── Chat/
│       └── ChatScreen.js
├── services/
│   ├── api.js
│   ├── offline.js
│   ├── location.js
│   └── camera.js
├── store/
│   ├── index.js
│   ├── authSlice.js
│   ├── weatherSlice.js
│   └── offlineSlice.js
└── utils/
    ├── constants.js
    ├── helpers.js
    └── languages.js
```

### Key Components Implementation

#### 1. LoginScreen.js (React Native)
```javascript
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const dispatch = useDispatch();

  const sendOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter valid phone number');
      return;
    }
    
    // API call to send OTP
    try {
      await apiService.sendOtp(phoneNumber);
      setShowOtp(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await apiService.verifyOtp(phoneNumber, otp);
      dispatch(login(response.user));
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>AgroIntel</Text>
        <Text style={styles.subtitle}>Smart Farming Companion</Text>
      </View>
      
      <View style={styles.form}>
        {!showOtp ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={sendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={verifyOtp}>
              <Text style={styles.buttonText}>Verify & Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d5a41',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    marginTop: 40,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;
```

#### 2. DashboardScreen.js (React Native)
```javascript
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  StyleSheet, SafeAreaView, TouchableOpacity
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import WeatherWidget from '../components/weather/WeatherWidget';
import SoilHealthCard from '../components/soil/SoilHealthCard';
import OfflineBanner from '../components/common/OfflineBanner';

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { isOffline } = useSelector(state => state.offline);
  const dispatch = useDispatch();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchWeatherData()),
        dispatch(fetchSoilData()),
        dispatch(fetchAdvisoryData())
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setRefreshing(false);
  };

  const quickActions = [
    { 
      title: 'Crop Advisory', 
      icon: '🌾', 
      screen: 'CropAdvisory',
      color: '#059669'
    },
    { 
      title: 'Pest Detection', 
      icon: '🔍', 
      screen: 'PestDetection',
      color: '#dc2626'
    },
    { 
      title: 'Market Prices', 
      icon: '💰', 
      screen: 'MarketPrices',
      color: '#7c2d12'
    },
    { 
      title: 'Chat Assistant', 
      icon: '💬', 
      screen: 'Chat',
      color: '#1d4ed8'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {isOffline && <OfflineBanner />}
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome, {user?.name || 'Farmer'}
          </Text>
          <Text style={styles.location}>📍 {user?.location}</Text>
        </View>

        <WeatherWidget />
        <SoilHealthCard />
        
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { borderColor: action.color }]}
                onPress={() => navigation.navigate(action.screen)}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#6b7280',
  },
  quickActions: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});

export default DashboardScreen;
```

### 3. Offline Storage Service
```javascript
// services/offline.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class OfflineService {
  constructor() {
    this.isConnected = true;
    this.setupNetworkListener();
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isConnected = state.isConnected;
      if (this.isConnected) {
        this.syncOfflineData();
      }
    });
  }

  async storeOfflineQuery(query) {
    const queries = await this.getOfflineQueries();
    queries.push({
      ...query,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });
    await AsyncStorage.setItem('offline_queries', JSON.stringify(queries));
  }

  async getOfflineQueries() {
    const queries = await AsyncStorage.getItem('offline_queries');
    return queries ? JSON.parse(queries) : [];
  }

  async syncOfflineData() {
    const queries = await this.getOfflineQueries();
    
    for (const query of queries) {
      try {
        await apiService.submitQuery(query);
        await this.removeOfflineQuery(query.id);
      } catch (error) {
        console.error('Failed to sync query:', error);
      }
    }
  }

  async removeOfflineQuery(queryId) {
    const queries = await this.getOfflineQueries();
    const filteredQueries = queries.filter(q => q.id !== queryId);
    await AsyncStorage.setItem('offline_queries', JSON.stringify(filteredQueries));
  }
}

export default new OfflineService();
```

---

## 🌐 Web Dashboard - React Implementation

### Core File Structure

```
web-dashboard/src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.js
│   │   ├── Header.js
│   │   └── Layout.js
│   ├── Charts/
│   │   ├── LineChart.js
│   │   ├── BarChart.js
│   │   └── PieChart.js
│   ├── Tables/
│   │   └── DataTable.js
│   └── Cards/
│       └── MetricCard.js
├── pages/
│   ├── Dashboard.js
│   ├── FarmerManagement.js
│   ├── CropAnalytics.js
│   ├── WeatherMonitoring.js
│   ├── PestDetection.js
│   └── MarketAnalytics.js
├── services/
│   ├── api.js
│   └── charts.js
└── utils/
    ├── constants.js
    └── formatters.js
```

### Key Components Implementation

#### 1. Dashboard.js (React)
```javascript
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import MetricCard from '../components/Cards/MetricCard';
import LineChart from '../components/Charts/LineChart';
import DataTable from '../components/Tables/DataTable';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [realtimeActivity, setRealtimeActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Setup real-time updates
    const interval = setInterval(fetchRealtimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.getDashboardMetrics();
      setMetrics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await apiService.getRealtimeActivity();
      setRealtimeActivity(response.data);
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        AgroIntel Dashboard
      </Typography>
      
      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Farmers"
            value={metrics.total_farmers?.toLocaleString()}
            icon="👥"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Queries"
            value={metrics.active_queries}
            icon="❓"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pest Alerts"
            value={metrics.pest_alerts}
            icon="🐛"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Weather Alerts"
            value={metrics.weather_alerts}
            icon="⛈️"
            color="error"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Farmer Activity Trends
              </Typography>
              <LineChart data={realtimeActivity} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <DataTable 
                data={realtimeActivity} 
                columns={['farmer', 'activity', 'timestamp']}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
```

#### 2. MetricCard.js (React)
```javascript
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({ title, value, icon, color = 'primary', trend }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
            {trend && (
              <Typography 
                variant="body2" 
                color={trend > 0 ? 'success.main' : 'error.main'}
              >
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="h2">{icon}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
```

---

## 🔌 API Structure & Integration

### Backend API Endpoints

```javascript
// Node.js/Express API Structure

// Auth Routes
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/refresh-token

// Weather Routes
GET /api/weather/current/:location
GET /api/weather/forecast/:location
GET /api/weather/alerts/:region

// Crop Routes
POST /api/crop/advisory
GET /api/crop/predictions/:crop/:season
GET /api/crop/analytics

// Pest Detection Routes
POST /api/pest/detect (with image upload)
GET /api/pest/history/:farmer_id
GET /api/pest/outbreaks/:region

// Market Routes
GET /api/market/prices/:location
GET /api/market/trends/:crop
GET /api/market/mandis/:location

// Chat/Advisory Routes
POST /api/chat/query
GET /api/chat/history/:farmer_id
POST /api/chat/voice-to-text

// Farmer Management Routes
GET /api/farmers
GET /api/farmers/:id
PUT /api/farmers/:id
GET /api/farmers/analytics

// Dashboard Routes
GET /api/dashboard/metrics
GET /api/dashboard/realtime
GET /api/dashboard/export/:type
```

### API Service Implementation

```javascript
// services/api.js (React Native & Web)

class ApiService {
  constructor() {
    this.baseURL = 'https://api.agrointel.com/v1';
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async sendOtp(phoneNumber) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyOtp(phoneNumber, otp) {
    const response = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    });
    this.token = response.token;
    return response;
  }

  // Weather methods
  async getWeather(location) {
    return this.request(`/weather/current/${encodeURIComponent(location)}`);
  }

  async getWeatherForecast(location) {
    return this.request(`/weather/forecast/${encodeURIComponent(location)}`);
  }

  // Crop advisory methods
  async getCropAdvisory(soilType, crop, irrigation) {
    return this.request('/crop/advisory', {
      method: 'POST',
      body: JSON.stringify({ soilType, crop, irrigation }),
    });
  }

  // Pest detection methods
  async detectPest(imageUri) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'pest-image.jpg',
    });

    return this.request('/pest/detect', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Market data methods
  async getMarketPrices(location) {
    return this.request(`/market/prices/${encodeURIComponent(location)}`);
  }

  // Chat methods
  async sendChatQuery(query, language = 'en') {
    return this.request('/chat/query', {
      method: 'POST',
      body: JSON.stringify({ query, language }),
    });
  }
}

export default new ApiService();
```

---

## 🛠️ Third-Party API Integrations

### 1. Weather APIs
```javascript
// Weather API Integration Options

// OpenWeatherMap API
const WEATHER_API_KEY = 'your-openweather-api-key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function getWeatherData(lat, lon) {
  const response = await fetch(
    `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
  );
  return response.json();
}

// Alternative: AccuWeather API
const ACCUWEATHER_API_KEY = 'your-accuweather-api-key';
async function getAccuWeatherData(locationKey) {
  const response = await fetch(
    `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}`
  );
  return response.json();
}
```

### 2. AI/ML Integration for Pest Detection
```javascript
// TensorFlow.js Integration for Pest Detection

import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

class PestDetectionService {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    try {
      // Load pre-trained model
      const modelUrl = bundleResourceIO(modelJson, modelWeights);
      this.model = await tf.loadLayersModel(modelUrl);
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  }

  async detectPest(imageUri) {
    if (!this.model) {
      await this.loadModel();
    }

    try {
      // Preprocess image
      const response = await fetch(imageUri, {}, { isBinary: true });
      const imageData = await response.arrayBuffer();
      const tensor = this.preprocessImage(imageData);
      
      // Make prediction
      const predictions = this.model.predict(tensor);
      const results = await predictions.data();
      
      // Process results
      return this.processPredictions(results);
    } catch (error) {
      console.error('Pest detection failed:', error);
      throw error;
    }
  }

  preprocessImage(imageData) {
    // Convert image to tensor and resize to model input size
    return tf.browser.fromPixels(imageData)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims();
  }

  processPredictions(predictions) {
    const pestClasses = [
      'Aphids', 'Leaf Blight', 'Stem Borer', 'Thrips', 'Whitefly'
    ];
    
    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const confidence = predictions[maxIndex];
    
    return {
      pest: pestClasses[maxIndex],
      confidence: Math.round(confidence * 100),
      recommendations: this.getRecommendations(pestClasses[maxIndex])
    };
  }
}
```

### 3. Multi-language Support
```javascript
// i18n Configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'welcome': 'Welcome',
      'dashboard': 'Dashboard',
      'crop_advisory': 'Crop Advisory',
      'pest_detection': 'Pest Detection',
      'market_prices': 'Market Prices',
      'chat_assistant': 'Chat Assistant'
    }
  },
  hi: {
    translation: {
      'welcome': 'स्वागत',
      'dashboard': 'डैशबोर्ड',
      'crop_advisory': 'फसल सलाह',
      'pest_detection': 'कीट पहचान',
      'market_prices': 'बाज़ार भाव',
      'chat_assistant': 'चैट सहायक'
    }
  },
  ta: {
    translation: {
      'welcome': 'வரவேற்பு',
      'dashboard': 'கட்டுப்பாட்டு பலகை',
      'crop_advisory': 'பயிர் ஆலோசனை',
      'pest_detection': 'பூச்சி கண்டறிதல்',
      'market_prices': 'சந்தை விலைகள்',
      'chat_assistant': 'அரட்டை உதவியாளர்'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

---

## 🗄️ Database Schema Design

### MongoDB/PostgreSQL Schema

```sql
-- Farmers Table
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    location VARCHAR(200),
    state VARCHAR(50),
    district VARCHAR(50),
    crops TEXT[], -- Array of crops grown
    farm_size DECIMAL(10,2), -- in acres
    soil_type VARCHAR(50),
    irrigation_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Weather Data Table
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location VARCHAR(200),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    temperature DECIMAL(5,2),
    humidity INTEGER,
    rainfall DECIMAL(8,2),
    wind_speed DECIMAL(5,2),
    pressure DECIMAL(7,2),
    recorded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop Advisory Table
CREATE TABLE crop_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id),
    crop_name VARCHAR(50),
    soil_type VARCHAR(50),
    irrigation_type VARCHAR(50),
    season VARCHAR(20),
    advisory_text TEXT,
    yield_prediction DECIMAL(10,2),
    confidence_score DECIMAL(5,2),
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pest Detection Table
CREATE TABLE pest_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id),
    image_url VARCHAR(500),
    detected_pest VARCHAR(100),
    confidence_score DECIMAL(5,2),
    crop_affected VARCHAR(50),
    severity VARCHAR(20),
    treatment_recommendation TEXT,
    location VARCHAR(200),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Prices Table
CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name VARCHAR(50),
    variety VARCHAR(50),
    market_name VARCHAR(100),
    state VARCHAR(50),
    district VARCHAR(50),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    modal_price DECIMAL(10,2),
    unit VARCHAR(20), -- per quintal, per kg, etc.
    price_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id),
    message_text TEXT,
    response_text TEXT,
    language VARCHAR(5) DEFAULT 'en',
    message_type VARCHAR(20), -- query, advisory, alert
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Analytics Table
CREATE TABLE system_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100),
    metric_value DECIMAL(15,2),
    metric_unit VARCHAR(20),
    category VARCHAR(50), -- farmers, queries, detections, etc.
    recorded_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Development Setup Instructions

### 1. Mobile App Setup (React Native)
```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new React Native project
npx react-native init AgroIntelApp

# Install required dependencies
cd AgroIntelApp
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux
npm install react-native-async-storage
npm install @react-native-community/netinfo
npm install react-native-image-picker
npm install react-native-camera
npm install react-native-vector-icons
npm install react-i18next

# iOS specific
cd ios && pod install && cd ..

# Run the app
npx react-native run-android
npx react-native run-ios
```

### 2. Web Dashboard Setup (React)
```bash
# Create React app
npx create-react-app agrointel-dashboard

# Install dependencies
cd agrointel-dashboard
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install chart.js react-chartjs-2
npm install axios
npm install react-router-dom
npm install @reduxjs/toolkit react-redux

# Start development server
npm start
```

### 3. Backend API Setup (Node.js)
```bash
# Initialize Node.js project
mkdir agrointel-api
cd agrointel-api
npm init -y

# Install dependencies
npm install express cors helmet morgan
npm install mongoose # for MongoDB
npm install jsonwebtoken bcryptjs
npm install multer # for file uploads
npm install nodemailer # for SMS/email
npm install socket.io # for real-time features
npm install dotenv
npm install express-rate-limit
npm install express-validator

# Development dependencies
npm install -D nodemon concurrently

# Start development server
npm run dev
```

---

## 📱 Platform-Specific Considerations

### Flutter Alternative Implementation
If choosing Flutter over React Native:

```dart
// main.dart - Flutter App Structure
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'services/api_service.dart';
import 'providers/auth_provider.dart';

void main() {
  runApp(AgroIntelApp());
}

class AgroIntelApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        Provider(create: (_) => ApiService()),
      ],
      child: MaterialApp(
        title: 'AgroIntel',
        theme: ThemeData(
          primarySwatch: Colors.green,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: LoginScreen(),
        routes: {
          '/dashboard': (context) => DashboardScreen(),
          '/crop-advisory': (context) => CropAdvisoryScreen(),
          '/pest-detection': (context) => PestDetectionScreen(),
        },
      ),
    );
  }
}

// login_screen.dart - Flutter Login Implementation
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  bool _showOtpField = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF8F9FA),
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo Section
              Container(
                child: Column(
                  children: [
                    Text('🌱', style: TextStyle(fontSize: 60)),
                    SizedBox(height: 16),
                    Text(
                      'AgroIntel',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2D5A41),
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Smart Farming Companion',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 40),
              
              // Phone Input
              if (!_showOtpField)
                Column(
                  children: [
                    TextField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Phone Number',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                    ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _sendOtp,
                      child: Text('Send OTP'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF059669),
                        minimumSize: Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ],
                ),
              
              // OTP Input
              if (_showOtpField)
                Column(
                  children: [
                    TextField(
                      controller: _otpController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Enter OTP',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                    ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _verifyOtp,
                      child: Text('Verify & Login'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF059669),
                        minimumSize: Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _sendOtp() async {
    // Implement OTP sending logic
    setState(() {
      _showOtpField = true;
    });
  }

  void _verifyOtp() async {
    // Implement OTP verification logic
    Navigator.pushReplacementNamed(context, '/dashboard');
  }
}
```

---

## 🚀 Deployment & Production Considerations

### 1. Mobile App Deployment
```bash
# Android Release Build
cd android
./gradlew assembleRelease

# iOS Release Build
cd ios
xcodebuild -workspace AgroIntelApp.xcworkspace \
  -scheme AgroIntelApp \
  -configuration Release \
  -archivePath AgroIntelApp.xcarchive \
  archive

# App Store/Play Store Preparation
# - Update app versions
# - Generate signed APK/IPA
# - Prepare store listings
# - Submit for review
```

### 2. Web Dashboard Deployment
```bash
# Build for production
npm run build

# Deploy to AWS S3 + CloudFront
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# Or deploy to Netlify/Vercel
netlify deploy --prod --dir=build
vercel --prod
```

### 3. Backend API Deployment
```bash
# Docker containerization
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]

# Build and deploy
docker build -t agrointel-api .
docker run -p 3000:3000 agrointel-api

# Deploy to AWS ECS/EKS or Google Cloud Run
```

### 4. Environment Configuration
```javascript
// .env files for different environments

// .env.development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WEATHER_API_KEY=dev_weather_key
REACT_APP_MAPS_API_KEY=dev_maps_key

// .env.production
REACT_APP_API_URL=https://api.agrointel.com/v1
REACT_APP_WEATHER_API_KEY=prod_weather_key
REACT_APP_MAPS_API_KEY=prod_maps_key

// .env.staging
REACT_APP_API_URL=https://staging-api.agrointel.com/v1
REACT_APP_WEATHER_API_KEY=staging_weather_key
REACT_APP_MAPS_API_KEY=staging_maps_key
```

---

## 🔐 Security Best Practices

### 1. API Security
```javascript
// JWT Token Management
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Rate Limiting
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

### 2. Data Validation
```javascript
// Input validation using express-validator
const { body, validationResult } = require('express-validator');

const validateCropAdvisory = [
  body('soilType').isIn(['Clay', 'Sandy', 'Loamy', 'Silt']),
  body('crop').isLength({ min: 2, max: 50 }),
  body('irrigation').isIn(['Drip', 'Sprinkler', 'Flood']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

app.post('/api/crop/advisory', validateCropAdvisory, (req, res) => {
  // Handle validated request
});
```

### 3. Secure File Upload
```javascript
// Multer configuration for image uploads
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pest-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG and JPG files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});
```

---

## 🧪 Testing Strategy

### 1. Mobile App Testing
```javascript
// Jest + React Native Testing Library
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

describe('LoginScreen', () => {
  test('should render login form', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    expect(getByText('Send OTP')).toBeTruthy();
  });

  test('should show OTP field after phone number submission', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const phoneInput = getByPlaceholderText('Phone Number');
    const sendButton = getByText('Send OTP');
    
    fireEvent.changeText(phoneInput, '9876543210');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(getByPlaceholderText('Enter OTP')).toBeTruthy();
    });
  });
});
```

### 2. API Testing
```javascript
// Supertest + Jest for API testing
const request = require('supertest');
const app = require('../src/app');

describe('Crop Advisory API', () => {
  test('POST /api/crop/advisory should return prediction', async () => {
    const response = await request(app)
      .post('/api/crop/advisory')
      .send({
        soilType: 'Loamy',
        crop: 'Rice',
        irrigation: 'Drip'
      })
      .expect(200);
    
    expect(response.body).toHaveProperty('prediction');
    expect(response.body).toHaveProperty('confidence');
  });

  test('POST /api/crop/advisory should validate input', async () => {
    const response = await request(app)
      .post('/api/crop/advisory')
      .send({
        soilType: 'Invalid',
        crop: '',
        irrigation: 'Unknown'
      })
      .expect(400);
    
    expect(response.body).toHaveProperty('errors');
  });
});
```

---

## 📊 Analytics & Monitoring

### 1. Application Performance Monitoring
```javascript
// Sentry integration
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});

// Custom error tracking
const trackError = (error, context) => {
  Sentry.withScope((scope) => {
    scope.setContext('custom', context);
    Sentry.captureException(error);
  });
};

// Performance monitoring
const trackPerformance = (operationName, duration) => {
  Sentry.addBreadcrumb({
    message: `${operationName} completed`,
    level: 'info',
    data: { duration: `${duration}ms` }
  });
};
```

### 2. Usage Analytics
```javascript
// Google Analytics integration
import analytics from '@react-native-firebase/analytics';

const trackScreenView = (screenName) => {
  analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName
  });
};

const trackEvent = (eventName, parameters) => {
  analytics().logEvent(eventName, parameters);
};

// Usage examples
trackScreenView('crop_advisory_screen');
trackEvent('pest_detection_completed', {
  pest_type: 'aphids',
  confidence: 85,
  crop: 'rice'
});
```

---

## 🎯 Performance Optimization

### 1. Mobile App Optimization
```javascript
// Image optimization
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ source, ...props }) => (
  <FastImage
    source={{
      uri: source,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable
    }}
    {...props}
  />
);

// List optimization with FlatList
import { FlatList } from 'react-native';

const FarmersList = ({ farmers }) => {
  const renderFarmer = useCallback(({ item }) => (
    <FarmerCard farmer={item} />
  ), []);

  return (
    <FlatList
      data={farmers}
      renderItem={renderFarmer}
      keyExtractor={item => item.id}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
};
```

### 2. Web Dashboard Optimization
```javascript
// Code splitting with React.lazy
import { lazy, Suspense } from 'react';

const CropAnalytics = lazy(() => import('./pages/CropAnalytics'));
const PestDetection = lazy(() => import('./pages/PestDetection'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/crop-analytics" element={<CropAnalytics />} />
        <Route path="/pest-detection" element={<PestDetection />} />
      </Routes>
    </Suspense>
  );
}

// Memoization for expensive calculations
import { useMemo } from 'react';

const ExpensiveChart = ({ data }) => {
  const chartData = useMemo(() => {
    return processChartData(data);
  }, [data]);

  return <Chart data={chartData} />;
};
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/mobile-ci.yml
name: Mobile App CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Run linting
      run: npm run lint

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'adopt'
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleRelease
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-release.apk
        path: android/app/build/outputs/apk/release/
```

This comprehensive guide provides everything needed to build AgroIntel from scratch. The applications I've created demonstrate the core functionality, and this documentation provides the complete development roadmap for scaling to production.