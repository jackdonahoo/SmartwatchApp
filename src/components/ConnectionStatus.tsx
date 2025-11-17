import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface ConnectionStatusProps {
  isConnected: boolean;
  deviceName: string | null;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  deviceName,
  isScanning,
  onConnect,
  onDisconnect,
}) => {
  const getStatusText = () => {
    if (isScanning) return 'Scanning for devices...';
    if (isConnected && deviceName) return `Connected to ${deviceName}`;
    return 'Not connected';
  };

  const getStatusColor = () => {
    if (isScanning) return '#FFA500';
    if (isConnected) return '#4CAF50';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, {backgroundColor: getStatusColor()}]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isConnected ? '#F44336' : '#4CAF50'},
        ]}
        onPress={isConnected ? onDisconnect : onConnect}
        disabled={isScanning}>
        <Text style={styles.buttonText}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    flex: 1,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default ConnectionStatus;
