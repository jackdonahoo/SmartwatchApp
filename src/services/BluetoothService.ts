import {BleManager, Device, Characteristic} from 'react-native-ble-plx';
import {PermissionsAndroid, Platform} from 'react-native';

export interface HealthData {
  heartRate: number;
  steps: number;
  timestamp: number;
}

class BluetoothService {
  private manager: BleManager;
  private connectedDevice: Device | null = null;
  private isScanning = false;

  // UUIDs for smartwatch services (these would be specific to your smartwatch)
  private readonly HEART_RATE_SERVICE_UUID = '180D';
  private readonly HEART_RATE_MEASUREMENT_UUID = '2A37';
  private readonly STEPS_SERVICE_UUID = '1815'; // Custom service for steps
  private readonly STEPS_MEASUREMENT_UUID = '2A53'; // Custom characteristic for steps

  constructor() {
    this.manager = new BleManager();
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED,
      );
    }
    return true; // iOS permissions are handled in Info.plist
  }

  async startScanning(onDeviceFound: (device: Device) => void): Promise<void> {
    if (this.isScanning) return;

    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      throw new Error('Bluetooth permissions not granted');
    }

    this.isScanning = true;
    
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        this.isScanning = false;
        return;
      }

      if (device && device.name && device.name.toLowerCase().includes('watch')) {
        onDeviceFound(device);
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      this.stopScanning();
    }, 10000);
  }

  stopScanning(): void {
    if (this.isScanning) {
      this.manager.stopDeviceScan();
      this.isScanning = false;
    }
  }

  async connectToDevice(device: Device): Promise<boolean> {
    try {
      this.connectedDevice = await device.connect();
      await this.connectedDevice.discoverAllServicesAndCharacteristics();
      
      console.log('Connected to device:', device.name);
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      await this.connectedDevice.cancelConnection();
      this.connectedDevice = null;
    }
  }

  async subscribeToHealthData(callback: (data: HealthData) => void): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('No device connected');
    }

    try {
      // Subscribe to heart rate measurements
      await this.connectedDevice.monitorCharacteristicForService(
        this.HEART_RATE_SERVICE_UUID,
        this.HEART_RATE_MEASUREMENT_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Heart rate monitoring error:', error);
            return;
          }

          if (characteristic?.value) {
            const heartRate = this.parseHeartRateData(characteristic.value);
            // For now, we'll simulate steps data since it's not standard BLE
            const steps = Math.floor(Math.random() * 10000); // Simulated steps
            
            callback({
              heartRate,
              steps,
              timestamp: Date.now(),
            });
          }
        },
      );

      // In a real implementation, you would also subscribe to steps data
      // if your smartwatch supports it through a custom service
    } catch (error) {
      console.error('Subscription error:', error);
    }
  }

  private parseHeartRateData(base64Data: string): number {
    // Parse BLE heart rate measurement data
    // This follows the Bluetooth Heart Rate Measurement specification
    const buffer = Buffer.from(base64Data, 'base64');
    
    if (buffer.length < 2) return 0;
    
    const flags = buffer[0];
    const is16Bit = (flags & 0x01) !== 0;
    
    if (is16Bit && buffer.length >= 3) {
      return buffer.readUInt16LE(1);
    } else if (buffer.length >= 2) {
      return buffer[1];
    }
    
    return 0;
  }

  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  getConnectedDeviceName(): string | null {
    return this.connectedDevice?.name || null;
  }

  // Simulate health data for testing when no device is connected
  simulateHealthData(): HealthData {
    return {
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
      steps: Math.floor(Math.random() * 10000), // 0-10000 steps
      timestamp: Date.now(),
    };
  }
}

export default new BluetoothService();
