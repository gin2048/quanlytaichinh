import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '../src/constants/Colors';
import { getTransactions, calculateBalance } from '../src/utils/storage';

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const router = useRouter();

  const loadData = async () => {
    const transactions = await getTransactions();
    setBalance(calculateBalance(transactions));
    setRecentTransactions(transactions.slice(0, 5));
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionNote}>{item.note}</Text>
        <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString('vi-VN')}</Text>
      </View>
      <Text style={[
        styles.transactionAmount, 
        { color: item.type === 'income' ? Colors.primary : Colors.danger }
      ]}>
        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Tổng số dư hiện tại</Text>
        <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          onPress={() => router.push({ pathname: '/add', params: { type: 'income' } })}
        >
          <Text style={styles.actionButtonText}>Thêm Thu Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.danger }]}
          onPress={() => router.push({ pathname: '/add', params: { type: 'expense' } })}
        >
          <Text style={styles.actionButtonText}>Thêm Chi Tiêu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Giao dịch gần nhất</Text>
          <Link href="/history" asChild>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <FlatList
          data={recentTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có giao dịch nào.</Text>}
          scrollEnabled={false} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  balanceContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentContainer: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAllText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  transactionItem: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  transactionNote: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray,
    marginTop: 20,
  }
});
