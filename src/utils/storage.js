import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'TRANSACTIONS_DATA';

// Data structure: { id, amount, note, type: 'income' | 'expense', date }

export const saveTransaction = async (transaction) => {
  try {
    const existingData = await getTransactions();
    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...transaction
    };
    const newData = [newTransaction, ...existingData];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newTransaction;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const deleteTransaction = async (id) => {
  try {
    const existingData = await getTransactions();
    const newData = existingData.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const calculateBalance = (transactions) => {
  return transactions.reduce((acc, curr) => {
    const amount = parseFloat(curr.amount);
    if (curr.type === 'income') {
      return acc + amount;
    } else {
      return acc - amount;
    }
  }, 0);
};
