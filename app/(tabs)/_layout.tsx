import axios from 'axios';
import {
  router,
  Tabs
} from 'expo-router';
import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

type GoldPriceContextType = {
  goldPrice: number;
  loading: boolean;
};

export const GoldPriceContext = createContext<GoldPriceContextType>({
  goldPrice: 10000,
  loading: true,
});

const GoldPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [usd, setUsd] = useState<number>(84);
  const [x, setX] = useState<number>(1);

  // Fetch USD price and rate only once during initialization
  const initializeRates = useCallback(async () => {
    try {
      const [usdResponse, rateResponse] = await Promise.all([
        axios.get('https://open.er-api.com/v6/latest/USD'),
        axios.get('https://admin-pearl-kappa-34.vercel.app/api/rate')
      ]);

      const usdRate = usdResponse.data.rates.INR;
      const rateX = rateResponse.data[0].x;

      console.log('USD Rate:', usdRate);
      console.log('X Rate:', rateX);

      if (!usdRate || isNaN(usdRate)) {
        console.error('Invalid USD rate received:', usdRate);
        return usd;
      }

      if (!rateX || isNaN(rateX)) {
        console.error('Invalid X rate received:', rateX);
        setX(1); // Fallback to default
      } else {
        setX(rateX);
      }

      setUsd(usdRate);
      return usdRate;
    } catch (error) {
      console.error('Error fetching initial rates:', error);
      return usd;
    }
  }, [usd]);

  const fetchGoldPrice = useCallback(async (currentUsd: number) => {
    try {
      console.log('Fetching gold price...');
      const response = await axios.get('https://api.gold-api.com/price/XAU');
      const goldApiPrice = response.data.price;

      const calculatedPrice = (goldApiPrice * currentUsd * 0.337) + x;

      setGoldPrice(calculatedPrice);
      setLoading(false);
      console.log('Gold Price Updated:', calculatedPrice);
    } catch (error) {
      console.error('Error fetching gold price:', error);
      setLoading(false);
    }
  }, [x]);

  // Function to refresh all data when app becomes active
  const refreshData = useCallback(async () => {
    console.log('Refreshing data due to app state change...');
    setLoading(true);
    const currentUsd = await initializeRates();
    if (currentUsd && !isNaN(currentUsd)) {
      await fetchGoldPrice(currentUsd);
    }
  }, [initializeRates, fetchGoldPrice]);

  useEffect(() => {
    let mounted = true;
    let intervalId: number | null = null;

    const initialize = async () => {
      if (mounted) {
        setLoading(true);
        const currentUsd = await initializeRates();
        console.log('Initialization complete. Current USD:', currentUsd);
        if (currentUsd && !isNaN(currentUsd)) {
          await fetchGoldPrice(currentUsd);
        }
      }
    };

    const updateGoldPrice = async () => {
      if (mounted && !isNaN(usd)) {
        await fetchGoldPrice(usd);
      }
    };

    const startInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(updateGoldPrice, 10000);
      console.log('Gold price update interval started');
    };

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Gold price update interval stopped');
      }
    };

    // Handle app state changes
    const handleAppStateChange = async (nextAppState: string) => {
      console.log('App state changed to:', nextAppState);

      if (nextAppState === 'active') {
        // App came to foreground - refresh data and restart interval
        await refreshData();
        startInterval();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App went to background - stop interval to save resources
        stopInterval();
      }
    };

    // Initialize the app
    initialize().then(() => {
      startInterval();
    });

    // Listen to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      mounted = false;
      stopInterval();
      subscription?.remove();
    };
  }, [initializeRates, fetchGoldPrice, usd, refreshData]);

  return (
    <GoldPriceContext.Provider value={{ goldPrice, loading }}>
      {children}
    </GoldPriceContext.Provider>
  );
};

function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#7C0000",
        },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        tabBarActiveTintColor: "#7C0000",
        headerTitle: () => (
          
          <View style={styles.logo}>
            <Image
              style={styles.logoimage}
              source={{
                uri: "https://res.cloudinary.com/dzpsk7xch/image/upload/v1755331867/icon_2_rrrdio.png",
              }}
            />
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                textAlign: "center",
                marginVertical: 10,
                color: "#E7B858",
              }}
            >
              Fancy Jewellers
            </Text>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          tabBarLabel: 'Calculator',
          title: 'Calculator',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calculator" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="coin"
        options={{
          tabBarLabel: 'Coins',
          title: 'Gold Coins',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="gold" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          title: 'Your Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="bankDetails"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="jewellery"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <GoldPriceProvider>
      <TabLayout />
    </GoldPriceProvider>
  );
}

function TabLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>

      <View style={styles.mainContent}>
        <DrawerLayout />
      </View>
      <SafeAreaView edges={['bottom']} style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>

          <TouchableOpacity
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => router.push('/')}
          >
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#E7B858" />
              <Text style={styles.footerText}>Live Rate</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => router.push('/calculator')}
          >
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="calculator" size={24} color="#E7B858" />
              <Text style={styles.footerText}>Calculator</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => router.push('/jewellery')}
          >
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="necklace" size={24} color="#E7B858" />
              <Text style={styles.footerText}>Jewelleries</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => router.push('/profile')}
          >
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="account" size={24} color="#E7B858" />
              <Text style={styles.footerText}>Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  logoimage: {
    width: 45,
    height: 45,
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'black',
  },
  bottomNavContainer: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
    backgroundColor: Colors.background,
  },
  tabButton: {
    padding: 3,
    borderRadius: 8,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    color: Colors.fontColors,
    fontSize: 12,
    marginTop: 5,
  },
});