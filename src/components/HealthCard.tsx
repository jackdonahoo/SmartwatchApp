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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 4,
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
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 4,
  },
  unit: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default HealthCard;
