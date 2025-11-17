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
        <Text style={styles.temperatureUnit}>C</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{weatherData.windSpeed} km/h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  condition: {
    fontSize: 14,
    color: '#E6F3FF',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  temperatureUnit: {
    fontSize: 24,
    color: '#E6F3FF',
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#E6F3FF',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FFB3B3',
    textAlign: 'center',
  },
});

export default WeatherCard;
