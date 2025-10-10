
// import { Drawer } from 'expo-router/drawer';
import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';


import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

interface GoldPriceContextType {
  goldPrice: number;
  fetchGoldPrice: () => Promise<void>;
}

const GoldPriceContext = createContext<GoldPriceContextType | undefined>(
  undefined
);

const GoldPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goldPrice, setGoldPrice] = useState<number>(0);

  const fetchGoldPrice = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://api.example.com/gold-price'
      );
      setGoldPrice(response.data.price);
    } catch (error) {
      console.error('Error fetching gold price:', error);
    }
  }, []);

  useEffect(() => {
    fetchGoldPrice();
  }, [fetchGoldPrice]);

  return (
    <GoldPriceContext.Provider value={{ goldPrice, fetchGoldPrice }}>
      {children}
    </GoldPriceContext.Provider>
  );
};

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <GoldPriceProvider>
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          </Stack>
    </GoldPriceProvider>
  );
}
