import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { GoldPriceContext } from './_layout';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  // Hero section data (fetched from remote API)
  const [heroImages, setHeroImages] = useState<Array<{ _id: string; poster_no: number; url: string }>>([]);
  const [heroLoading, setHeroLoading] = useState<boolean>(false);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [qualities, setQualities] = useState<Array<{ karatage: string; ratio: number }>>([]);
  const [qualitiesLoading, setQualitiesLoading] = useState<boolean>(false);
  const [qualitiesError, setQualitiesError] = useState<string | null>(null);
  const { goldPrice: goldPriceFromContext, loading: contextLoading } = useContext(GoldPriceContext);
  const [goldPrice, setGoldPrice] = useState<number>(goldPriceFromContext);
  const [displayGold, setDisplayGold] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [priceChange, setPriceChange] = useState({ value: 0, isPositive: true });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const prevPrice = useRef(goldPrice);

  const [currentTime, setCurrentTime] = useState(new Date());
  // const [batteryLevel, setBatteryLevel] = useState(100);
  const [prevAsks, setPrevAsks] = useState<{[key: string]: number}>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Notifications disabled for Expo Go compatibility
  // async function setupNotifications() {
  //   try {
  //     const notificationService = new PushNotificationService();
  //     await notificationService.initialize();
  //     const token = await notificationService.getPushToken();
  //     
  //     console.log(token)
  //   } catch (error) {
  //     console.error("Error setting up notifications:", error);
  //   }
  // }

  const animatePrice = (isIncrease: boolean) => {
    fadeAnim.setValue(1);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      })
    ]).start();
  };

  useEffect(() => {
    if (goldPriceFromContext !== prevPrice.current) {
      animatePrice(goldPriceFromContext > prevPrice.current);
      setPriceChange({
        value: goldPriceFromContext - prevPrice.current,
        isPositive: goldPriceFromContext > prevPrice.current
      });
      prevPrice.current = goldPriceFromContext;
      setGoldPrice(goldPriceFromContext);
    }
  }, [goldPriceFromContext]);
  

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  

  useEffect(() => {
    const newAsks: {[key: string]: number} = {};
    [0.995, 0.995, 0.999, 0.995 * 1.03, 0.999 * 1.03].forEach((ratio, index) => {
      const currentAsk = goldPrice * ratio;
      newAsks[index] = currentAsk;
    });
    
    setPrevAsks(prev => {
      const result = {...newAsks};
      Object.keys(newAsks).forEach(key => {
        if (!prev[key]) prev[key] = newAsks[key];
      });
      return prev;
    });
  }, [goldPrice]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);
  
  // Fetch hero images
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setHeroLoading(true);
        setHeroError(null);
        const response = await fetch('https://admin-pearl-kappa-34.vercel.app/api/heroposter');
        if (!response.ok) {
          throw new Error(`Failed to load hero posters: ${response.status}`);
        }
        const data: Array<{ _id: string; poster_no: number; url: string }> = await response.json();
        setHeroImages(data);
      } catch (error: any) {
        setHeroError(error?.message ?? 'Failed to load hero posters');
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHeroImages();
  }, []);

  // Fetch qualities (karatage ratios)
  useEffect(() => {
    const fetchQualities = async () => {
      try {
        setQualitiesLoading(true);
        setQualitiesError(null);
        const response = await fetch('https://admin-pearl-kappa-34.vercel.app/api/quality');
        if (!response.ok) {
          throw new Error(`Failed to load qualities: ${response.status}`);
        }
        const apiData: Array<{ _id: string; quality: string; price: number }> = await response.json();
        // Map API fields to UI fields
        const mapped = apiData.map(item => ({
          karatage: item.quality?.toUpperCase() ?? '',
          ratio: item.price ?? 0,
        }));
        setQualities(mapped);
      } catch (error: any) {
        setQualitiesError(error?.message ?? 'Failed to load qualities');
      } finally {
        setQualitiesLoading(false);
      }
    };
    fetchQualities();
  }, []);


  const PriceCard = ({ karatage, ratio }: { karatage: string; ratio: number }) => (
    <BlurView intensity={15} tint="light" style={styles.karatCard}>
      <Text style={styles.karatTitle}>{karatage}</Text>
      <Text style={styles.karatPrice}>₹{(goldPrice * ratio).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })}</Text>
    </BlurView>
  );

  const HeroSection = () => (
    <View style={styles.heroContainer}>
      <FlatList
        data={heroImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={styles.heroSlide}>
            <View style={styles.heroImageContainer}>
              <Animated.Image
                source={{ uri: item.url }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>{`Banner ${item.poster_no}`}</Text>
                <Text style={styles.heroSubtitle}>Discover our finest collection</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id ?? String(item.poster_no)}
      />
      <View style={styles.paginationContainer}>
        {heroImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentImageIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );


  const StatusHeader = () => (
    <View style={styles.statusHeader}>
      <Text style={styles.statusText}>
        {/* {currentTime.toLocaleTimeString()} | 4G | {batteryLevel}% */}
      </Text>
    </View>
  );
  useEffect(() => {
    // setupNotifications(); // Disabled for Expo Go
    
  }, []);
  return (
    <SafeAreaView style={styles.container}>


      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.content}
      >
        
        <HeroSection />

        <Animated.View style={[
          styles.mainPriceCard,
          {
            backgroundColor: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#1a1a1a', priceChange.isPositive ? '#163516' : '#351616']
            })
          }
        ]}>
          <Text style={styles.currentPrice}>{goldPrice === 0 ? "...." : `₹${goldPrice.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}`}</Text>
          <View style={[styles.priceChangeContainer, {
            backgroundColor: priceChange.isPositive ? '#0f290f' : '#290f0f'
          }]}>
            <MaterialCommunityIcons
              name={priceChange.isPositive ? 'trending-up' : 'trending-down'}
              size={20}
              color={priceChange.isPositive ? '#4CAF50' : '#F44336'}
            />
            <Text style={[styles.priceChangeText, {
              color: priceChange.isPositive ? '#4CAF50' : '#F44336'
            }]}>
              ₹{Math.abs(priceChange.value).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              })}
            </Text>
          </View>
        </Animated.View>

        
          <View style={styles.karatContainer}>
            {qualitiesLoading && (
              <Text style={{ color: '#000', marginBottom: 8 }}>Loading qualities...</Text>
            )}
            {qualitiesError && (
              <Text style={{ color: 'red', marginBottom: 8 }}>{qualitiesError}</Text>
            )}
            {(!qualitiesLoading && !qualitiesError && qualities.length > 0) && (
              qualities.map((item) => (
                <PriceCard key={item.karatage} {...item} />
              ))
            )}
          </View>
          
      </ScrollView>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  statusHeader: {
    backgroundColor: '#000',
    padding: 5,
    alignItems: 'flex-end',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  
  mainPriceCard: {
    margin: 20,

    padding: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f290f',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'center',
  },
  priceChangeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  karatContainer: {
    padding: 20,
    // paddingVertical:10,
  },
  karatCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  karatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  karatPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  
  // Hero Section Styles
  heroContainer: {
    height: 250,
    marginBottom: 20,
  },
  heroSlide: {
    width: width,
    height: 250,
  },
  heroImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFD700',
  },
});