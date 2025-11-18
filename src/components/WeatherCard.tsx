import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {WeatherData} from '../services/WeatherService';

interface WeatherCardProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({weatherData, isLoading}) => {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>Weather data unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{weatherData.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.location}>{weatherData.location}</Text>
          <Text style={styles.condition}>{weatherData.condition}</Text>
        </View>
      </View>
      
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>{weatherData.temperature}°</Text>
        <Text style={styles.temperatureUnit}>F</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{weatherData.windSpeed} mph</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  location: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  condition: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '600',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 56,
    fontWeight: '800',
    color: '#667eea',
    letterSpacing: -2,
  },
  temperatureUnit: {
    fontSize: 28,
    color: '#9ca3af',
    marginLeft: 4,
    fontWeight: '600',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default WeatherCard;
