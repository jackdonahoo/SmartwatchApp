import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import BluetoothService, {HealthData} from '../services/BluetoothService';
import WeatherService, {WeatherData} from '../services/WeatherService';
import HealthCard from './HealthCard';
import WeatherCard from './WeatherCard';
import ConnectionStatus from './ConnectionStatus';
import {Device} from 'react-native-ble-plx';

const Dashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWeatherData();
    // Start with simulated data if no device is connected
    if (!isConnected) {
      startSimulatedData();
    }
  }, []);

  const loadWeatherData = async () => {
    setIsWeatherLoading(true);
    try {
      const weather = await WeatherService.getWeatherData();
      setWeatherData(weather);
    } catch (error) {
      console.error('Failed to load weather data:', error);
      Alert.alert('Error', 'Failed to load weather data');
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const startSimulatedData = () => {
    // Simulate health data updates every 5 seconds
    const interval = setInterval(() => {
      if (!BluetoothService.isConnected()) {
        const simulatedData = BluetoothService.simulateHealthData();
        setHealthData(simulatedData);
      }
    }, 5000);

    // Initial simulated data
    const initialData = BluetoothService.simulateHealthData();
    setHealthData(initialData);

    return () => clearInterval(interval);
  };

  const handleConnect = async () => {
    try {
      setIsScanning(true);
      
      await BluetoothService.startScanning((device: Device) => {
        Alert.alert(
          'Device Found',
          `Found device: ${device.name}. Connect to it?`,
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Connect',
              onPress: () => connectToDevice(device),
            },
          ],
        );
      });
    } catch (error) {
      console.error('Scanning error:', error);
      Alert.alert('Error', 'Failed to start scanning for devices');
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      BluetoothService.stopScanning();
      setIsScanning(false);
      
      const connected = await BluetoothService.connectToDevice(device);
      
      if (connected) {
        setIsConnected(true);
        setDeviceName(device.name);
        
        // Subscribe to health data from the device
        await BluetoothService.subscribeToHealthData((data: HealthData) => {
          setHealthData(data);
        });
        
        Alert.alert('Success', `Connected to ${device.name}`);
      } else {
        Alert.alert('Error', 'Failed to connect to device');
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'Failed to connect to device');
      setIsScanning(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await BluetoothService.disconnect();
      setIsConnected(false);
      setDeviceName(null);
      
      // Resume simulated data
      startSimulatedData();
      
      Alert.alert('Disconnected', 'Device disconnected successfully');
    } catch (error) {
      console.error('Disconnection error:', error);
      Alert.alert('Error', 'Failed to disconnect device');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    
    if (!isConnected) {
      const simulatedData = BluetoothService.simulateHealthData();
      setHealthData(simulatedData);
    }
    
    setRefreshing(false);
  };

  const formatLastUpdate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.title}>Smartwatch Dashboard</Text>
      
      <ConnectionStatus
        isConnected={isConnected}
        deviceName={deviceName}
        isScanning={isScanning}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <WeatherCard weatherData={weatherData} isLoading={isWeatherLoading} />

      {healthData && (
        <>
          <HealthCard
            title="Heart Rate"
            value={healthData.heartRate}
            unit="BPM"
            icon="❤️"
            color="#E74C3C"
          />
          
          <HealthCard
            title="Steps"
            value={healthData.steps.toLocaleString()}
            unit="steps"
            icon="👟"
            color="#3498DB"
          />
          
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>
              Last updated: {formatLastUpdate(healthData.timestamp)}
            </Text>
          </View>
        </>
      )}

      {!healthData && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {isConnected ? 'Waiting for health data...' : 'Loading health data...'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  lastUpdateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noDataContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Dashboard;
