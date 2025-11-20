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

interface StepData {
  time: string;
  steps: number;
}

interface StepHistoryProps {
  onBack: () => void;
}

const StepHistory: React.FC<StepHistoryProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');

  const getDayData = (): StepData[] => {
    return [
      { time: '12 AM', steps: 120 },
      { time: '3 AM', steps: 50 },
      { time: '6 AM', steps: 380 },
      { time: '9 AM', steps: 1250 },
      { time: '12 PM', steps: 1850 },
      { time: '3 PM', steps: 2100 },
      { time: '6 PM', steps: 1680 },
      { time: '9 PM', steps: 920 },
    ];
  };

  const getWeekData = (): StepData[] => {
    return [
      { time: 'Mon', steps: 8420 },
      { time: 'Tue', steps: 9150 },
      { time: 'Wed', steps: 7890 },
      { time: 'Thu', steps: 10250 },
      { time: 'Fri', steps: 8640 },
      { time: 'Sat', steps: 6230 },
      { time: 'Sun', steps: 5780 },
    ];
  };

  const getMonthData = (): StepData[] => {
    return [
      { time: 'Week 1', steps: 52300 },
      { time: 'Week 2', steps: 58700 },
      { time: 'Week 3', steps: 51200 },
      { time: 'Week 4', steps: 56800 },
    ];
  };

  const getData = (): StepData[] => {
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
  const maxSteps = Math.max(...data.map(d => d.steps));
  const minSteps = Math.min(...data.map(d => d.steps));
  const totalSteps = data.reduce((sum, d) => sum + d.steps, 0);
  const avgSteps = Math.round(totalSteps / data.length);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderChart = () => {
    const chartHeight = 200;
    const barWidth = (Dimensions.get('window').width - 80) / data.length;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const barHeight = (item.steps / maxSteps) * chartHeight;
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
                <Text style={styles.stepLabel}>{formatNumber(item.steps)}</Text>
                <Text style={styles.timeLabel}>{item.time}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const getDailyGoalProgress = () => {
    const goal = 10000;
    const progress = (totalSteps / goal) * 100;
    return Math.min(progress, 100);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Step Tracker</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={[styles.statValue, { color: '#667eea' }]}>{formatNumber(avgSteps)}</Text>
          <Text style={styles.statUnit}>steps</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={[styles.statValue, { color: '#48bb78' }]}>{formatNumber(minSteps)}</Text>
          <Text style={styles.statUnit}>steps</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={[styles.statValue, { color: '#f56565' }]}>{formatNumber(maxSteps)}</Text>
          <Text style={styles.statUnit}>steps</Text>
        </View>
      </View>

      {selectedPeriod === 'day' && (
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Daily Goal</Text>
            <Text style={styles.goalValue}>{totalSteps.toLocaleString()} / 10,000</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${getDailyGoalProgress()}%` }]} />
          </View>
          <Text style={styles.goalPercentage}>{getDailyGoalProgress().toFixed(0)}% Complete</Text>
        </View>
      )}

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
        <Text style={styles.legendTitle}>Activity Insights</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#48bb78' }]} />
          <Text style={styles.legendText}>Light Activity (&lt; 5,000 steps)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#667eea' }]} />
          <Text style={styles.legendText}>Moderate Activity (5,000-10,000 steps)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f56565' }]} />
          <Text style={styles.legendText}>High Activity (10,000+ steps)</Text>
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
    paddingBottom: 100, // Extra padding for bottom nav
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
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 6,
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
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
    backgroundColor: '#3498DB',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  stepLabel: {
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

export default StepHistory;

