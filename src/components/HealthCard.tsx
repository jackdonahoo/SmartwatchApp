import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface HealthCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
}

const HealthCard: React.FC<HealthCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
}) => {
  return (
    <View style={[styles.card, {borderLeftColor: color}]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, {color}]}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 0,
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
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingLeft: 4,
  },
  value: {
    fontSize: 42,
    fontWeight: '800',
    marginRight: 8,
    letterSpacing: -1,
  },
  unit: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
  },
});

export default HealthCard;
