// Mock Bluetooth Service for Expo Go compatibility
// Note: Real Bluetooth functionality requires expo-bluetooth or react-native-ble-plx
// which don't work in Expo Go. This is a simulation-only version for demo purposes.

export interface HealthData {
  heartRate: number;
  steps: number;
  timestamp: number;
}

// Mock Device interface for compatibility
export interface MockDevice {
  id: string;
  name: string;
}

class BluetoothService {
  private connectedDevice: MockDevice | null = null;
  private isScanning = false;
  private simulationInterval: NodeJS.Timeout | null = null;

  async requestPermissions(): Promise<boolean> {
    // Mock permission request - always returns true in simulation mode
    console.log('Mock Bluetooth: Permissions granted (simulation mode)');
    return true;
  }

  async startScanning(onDeviceFound: (device: MockDevice) => void): Promise<void> {
    if (this.isScanning) return;

    console.log('Mock Bluetooth: Starting scan (simulation mode)');
    this.isScanning = true;
    
    // Simulate finding devices after 2 seconds
    setTimeout(() => {
      if (this.isScanning) {
        console.log('Mock Bluetooth: Found simulated device');
        onDeviceFound({
          id: 'mock-device-1',
          name: 'Mock Smartwatch',
        });
      }
    }, 2000);

    // Stop scanning after 10 seconds
    setTimeout(() => {
      this.stopScanning();
    }, 10000);
  }

  stopScanning(): void {
    if (this.isScanning) {
      console.log('Mock Bluetooth: Stopped scanning');
      this.isScanning = false;
    }
  }

  async connectToDevice(device: MockDevice): Promise<boolean> {
    try {
      console.log('Mock Bluetooth: Connecting to device:', device.name);
      this.connectedDevice = device;
      return true;
    } catch (error) {
      console.error('Mock connection error:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    console.log('Mock Bluetooth: Disconnecting');
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.connectedDevice = null;
  }

  async subscribeToHealthData(callback: (data: HealthData) => void): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('No device connected');
    }

    console.log('Mock Bluetooth: Subscribing to health data');
    
    // Simulate health data updates every 3 seconds
    this.simulationInterval = setInterval(() => {
      callback(this.simulateHealthData());
    }, 3000);
    
    // Send initial data
    callback(this.simulateHealthData());
  }

  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  getConnectedDeviceName(): string | null {
    return this.connectedDevice?.name || null;
  }

  // Simulate health data for testing
  simulateHealthData(): HealthData {
    return {
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
      steps: Math.floor(Math.random() * 10000), // 0-10000 steps
      timestamp: Date.now(),
    };
  }
}

export default new BluetoothService();
