import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../src/constants/Colors';
import { saveTransaction } from '../src/utils/storage';

export default function AddTransaction() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const isIncome = type === 'income';
  const pageTitle = isIncome ? 'Thêm Thu Nhập' : 'Thêm Chi Tiêu';
  const buttonColor = isIncome ? Colors.primary : Colors.danger;

  const handleSave = async () => {
    if (!amount) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền');
      return;
    }

    if (isNaN(amount)) {
        Alert.alert('Lỗi', 'Số tiền không hợp lệ');
        return;
    }

    try {
      await saveTransaction({
        amount: parseFloat(amount),
        note: note || (isIncome ? 'Thu nhập' : 'Chi tiêu'),
        type: type || 'expense', // default to expense if not specified
      });
      router.back();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu giao dịch');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: buttonColor }]}>{pageTitle}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số tiền (VNĐ)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          value={amount}
          onChangeText={setAmount}
          autoFocus
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Tiền ăn sáng"
          value={note}
          onChangeText={setNote}
        />
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: buttonColor }]} 
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  saveButton: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
