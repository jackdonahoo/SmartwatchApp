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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ConnectionStatus;
