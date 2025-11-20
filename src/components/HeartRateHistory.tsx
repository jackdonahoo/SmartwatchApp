import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

type TimePeriod = 'day' | 'week' | 'month';

interface HeartRateData {
  time: string;
  bpm: number;
}

interface HeartRateHistoryProps {
  onBack: () => void;
}

const HeartRateHistory: React.FC<HeartRateHistoryProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');

  const getDayData = (): HeartRateData[] => {
    return [
      { time: '12 AM', bpm: 62 },
      { time: '3 AM', bpm: 58 },
      { time: '6 AM', bpm: 65 },
      { time: '9 AM', bpm: 72 },
      { time: '12 PM', bpm: 78 },
      { time: '3 PM', bpm: 82 },
      { time: '6 PM', bpm: 75 },
      { time: '9 PM', bpm: 68 },
    ];
  };

  const getWeekData = (): HeartRateData[] => {
    return [
      { time: 'Mon', bpm: 72 },
      { time: 'Tue', bpm: 75 },
      { time: 'Wed', bpm: 70 },
      { time: 'Thu', bpm: 78 },
      { time: 'Fri', bpm: 73 },
      { time: 'Sat', bpm: 68 },
      { time: 'Sun', bpm: 65 },
    ];
  };

  const getMonthData = (): HeartRateData[] => {
    return [
      { time: 'Week 1', bpm: 71 },
      { time: 'Week 2', bpm: 73 },
      { time: 'Week 3', bpm: 70 },
      { time: 'Week 4', bpm: 72 },
    ];
  };

  const getData = (): HeartRateData[] => {
    switch (selectedPeriod) {
      case 'day':
        return getDayData();
      case 'week':
        return getWeekData();
      case 'month':
        return getMonthData();
      default:
        return getDayData();
    }
  };

  const data = getData();
  const maxBpm = Math.max(...data.map(d => d.bpm));
  const minBpm = Math.min(...data.map(d => d.bpm));
  const avgBpm = Math.round(data.reduce((sum, d) => sum + d.bpm, 0) / data.length);

  const renderChart = () => {
    const chartHeight = 200;
    const barWidth = (Dimensions.get('window').width - 80) / data.length;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const barHeight = ((item.bpm - 50) / (maxBpm - 50)) * chartHeight;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        width: barWidth - 10,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.bpmLabel}>{item.bpm}</Text>
                <Text style={styles.timeLabel}>{item.time}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Heart Rate History</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={[styles.statValue, { color: '#667eea' }]}>{avgBpm}</Text>
          <Text style={styles.statUnit}>BPM</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={[styles.statValue, { color: '#48bb78' }]}>{minBpm}</Text>
          <Text style={styles.statUnit}>BPM</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={[styles.statValue, { color: '#f56565' }]}>{maxBpm}</Text>
          <Text style={styles.statUnit}>BPM</Text>
        </View>
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'day' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('day')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'day' && styles.periodButtonTextActive]}>
            Day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>

      {renderChart()}

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Heart Rate Zones</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#48bb78' }]} />
          <Text style={styles.legendText}>Resting (50-70 BPM)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#667eea' }]} />
          <Text style={styles.legendText}>Normal (70-85 BPM)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f56565' }]} />
          <Text style={styles.legendText}>Elevated (85+ BPM)</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#667eea',
  },
  periodButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6b7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 250,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    backgroundColor: '#667eea',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bpmLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 8,
  },
  timeLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 4,
  },
  legendContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
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
  legendTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '600',
  },
});

export default HeartRateHistory;

