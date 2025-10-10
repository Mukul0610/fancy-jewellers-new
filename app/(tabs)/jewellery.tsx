

import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GoldPriceContext } from './_layout';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

interface Product {
  _id: string;
  title: string;
  price: number;
  weight: number;
  quality: number;
  discount: number;
  primaryImage: string[];
  secondaryImage1:string;
  category:string;
  secondaryImage2:string
}

const Jewellery = () => {
  const { goldPrice: goldPriceFromContext } = useContext(GoldPriceContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quality, setQuality] = useState<number | string>('');
  const [qualities, setQualities] = useState<Array<{ label: string; value: number }>>([]);
  const [qualitiesLoading, setQualitiesLoading] = useState<boolean>(false);
  const [qualitiesError, setQualitiesError] = useState<string | null>(null);
  
  const categories = ['All', 'Necklace', 'Earrings', 'Ring', 'Bracelet','Pendant'];
  
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, quality]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const category = selectedCategory.toLowerCase();
      const qualityParam = quality ? `&quality=${quality}` : '';
      const url = `https://admin-pearl-kappa-34.vercel.app/api/products${
        category === 'all' ? `?1=1${qualityParam}` : `?category=${category}${qualityParam}`
      }`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load qualities from API
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
        const mapped = apiData.map(item => ({
          label: (item.quality || '').toUpperCase(),
          value: item.price ?? 0,
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

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryButton, 
        selectedCategory === item && styles.selectedCategory
      ]}
    >
    
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => {
    const calculatePrice = (basePrice: number, isDiscounted: boolean = false) => {
      const discountMultiplier = isDiscounted ? (1 - (0.01 * item.discount)) : 1;
      return Math.round(
        (((item.price * 0.01 + (isDiscounted ? item.quality * discountMultiplier : item.quality)) * 
        item.weight * goldPriceFromContext * 0.103) + 45)
      );
    };

    return (
      // <TouchableOpacity style={styles.productCard}>
        <TouchableOpacity 
        style={styles.productCard}
        onPress={() => {
          router.push({
            pathname: "/ProductDetail",
            params: { 
              id: item._id,
              name: item.title,
              images: JSON.stringify(item.primaryImage),
              otherDesignImg: JSON.stringify(item.secondaryImage1),
              price:(calculatePrice(item.price, true)),
              description: item.quality,
              sizes: JSON.stringify(item.weight),
              colors: JSON.stringify(item.discount),
              category: item.category,
              quality: item.quality,
              stock: item.secondaryImage2,
            }
          });
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.primaryImage[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.qualityTag}>
            <Text style={styles.qualityText}>
              {(() => {
                const matched = qualities.find(q => Math.abs(q.value - (item.quality ?? 0)) < 1e-6);
                return matched ? matched.label : 'N/A';
              })()}
            </Text>
          </View>
        </View>
        
        <View style={styles.productInfo}>
          <Text numberOfLines={2} style={styles.productTitle}>
            {item.title}
          </Text>
          
          <View style={styles.productDetails}>
            {item.discount !== 0 ? (
              <View style={styles.priceContainer}>
                <Text style={styles.discountedPriceText}>
                  ₹{calculatePrice(item.price, true)}
                </Text>
                <Text style={styles.originalPriceText}>
                  ₹{calculatePrice(item.price)} 
                </Text>
                <Text style={styles.discountBadge}>
                  {item.discount}% OFF on making charge
                </Text>
              </View>
            ) : (
              <Text style={styles.priceText}>
                ₹{calculatePrice(item.price)}
              </Text>
            )}
            <Text style={styles.weightText}>{item.weight}g</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        contentContainerStyle={styles.categoryContainer}
      />
      
      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={quality}
            style={styles.picker}
            dropdownIconColor="#7C0000"
            onValueChange={(value) => setQuality(value)}
          >
            <Picker.Item key="all" label={qualitiesLoading ? 'Loading qualities...' : 'All Qualities'} value="" />
            {qualitiesError && (
              <Picker.Item key="err" label={`Error: ${qualitiesError}`} value="" />
            )}
            {qualities.map((option) => (
              <Picker.Item 
                key={String(option.value)} 
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No products found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    marginHorizontal: 16,
    
  },
  categoryList: {
    marginBottom: 4,
  },
  categoryContainer: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
  },
  selectedCategory: {
    
  },
  categoryText: {
    fontSize: 14,
    
    fontWeight: '500',
  },
  selectedCategoryText: {
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 10,
  },
  picker: {
    
  },
  productGrid: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: COLUMN_WIDTH,
    
    borderRadius: 12,
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: COLUMN_WIDTH * 1.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  qualityTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
   
    marginBottom: 8,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    
  },
  discountedPriceText: {
    fontSize: 16,
    fontWeight: '700',
  },
  originalPriceText: {
    fontSize: 12,
    
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontSize: 10,
    
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  weightText: {
    fontSize: 12,
    marginLeft:-12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    
    fontSize: 18,
  },
});

export default Jewellery;