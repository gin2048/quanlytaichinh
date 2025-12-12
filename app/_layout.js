import { Stack } from 'expo-router';
import { Colors } from '../src/constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Quản Lý Tài Chính',
          }} 
        />
        <Stack.Screen 
          name="add" 
          options={{ 
            title: 'Thêm Giao Dịch',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="history" 
          options={{ 
            title: 'Lịch Sử Giao Dịch',
          }} 
        />
      </Stack>
    </>
  );
}
