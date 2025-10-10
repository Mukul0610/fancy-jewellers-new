// import { useLocalSearchParams } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   Alert,
//   Dimensions,
//   Image,
//   Keyboard,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';


// const { width } = Dimensions.get('window');

// export default function ProductDetail() {
  
//   const params = useLocalSearchParams();
  
//   // Parse the stringified arrays
//   const images = JSON.parse(params.images as string || '[]');
//   const otherDesignImg = JSON.parse(params.otherDesignImg as string || '[]');
  
  
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [quantity, setQuantity] = useState('1');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [userEmail, setUserEmail] = useState<string | null>(null);



//   // Combine main images and other design images
//   const allImages = [...images, ...otherDesignImg];

//   const formatPrice = (price: number) => {
//     return `${price.toLocaleString('en-IN')}`;
//   };

//   const getUserId = async () => {
//     try {
//       if (!userEmail) {
//         throw new Error('No user email found');
//       }

//       const response = await fetch(`https://nrf-admin-gsl7.vercel.app/api/devices/register?email=${encodeURIComponent(userEmail)}`);
//       const data = await response.json();
      
//       return data.device._id;
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       Alert.alert('Error', 'Please login again');
//       return null;
//     }
//   };

//   const handleAddToCart = async () => {
//     try {
//       setLoading(true);
//       if (!userEmail) {
//         Alert.alert('Error', 'Please login first');
//         return;
//       }

//       const userId = await getUserId();
      
//       if (!userId) {
//         Alert.alert('Error', 'User not found');
//         return;
//       }

//       const response = await fetch('https://nrf-admin-gsl7.vercel.app/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: userId,
//           product_id: params.id,
//           quantity: parseInt(quantity),
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         Alert.alert('Success', 'Added to cart successfully');
//         setModalVisible(false);
//       } else {
//         Alert.alert('Error', data.error || 'Failed to add to cart');
//       }
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       Alert.alert('Error', 'Failed to add to cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const QuantityModal = () => (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={() => setModalVisible(false)}
//       // onShow={() => Keyboard.dismiss()}
//     >
      
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//     <View style={styles.modalContainer}>
//       <View style={styles.modalContent}>
//         <Text style={styles.modalTitle}>Enter Quantity</Text>
//         <TextInput
//           style={styles.quantityInput}
//           keyboardType="number-pad"
//           value={quantity}
//           onChangeText={setQuantity}
//           placeholder="Enter quantity"
//           autoFocus={true}
//           maxLength={3}
//           returnKeyType="done"
//           onSubmitEditing={handleAddToCart}
//         />
//         <View style={styles.modalButtons}>
//           <TouchableOpacity 
//             style={[styles.modalButton, styles.cancelButton]}
//             onPress={() => setModalVisible(false)}
//           >
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.modalButton, styles.confirmButton]}
//             onPress={handleAddToCart}
//             disabled={loading}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? 'Adding...' : 'Confirm'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </TouchableWithoutFeedback>
//     </Modal>

//   );

//   // Add a safety check
//   if (!params.name || !images) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.errorText}>Loading product details...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
      
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Main Image */}
//         <Image 
//           source={{ uri: allImages[selectedImageIndex] }} 
//           style={styles.mainImage}
//         />

//         {/* Image Carousel */}
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           style={styles.thumbnailContainer}
//         >
//           {allImages.map((img, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => setSelectedImageIndex(index)}
//             >
//               <Image
//                 source={{ uri: img }}
//                 style={[
//                   styles.thumbnail,
//                   selectedImageIndex === index && styles.selectedThumbnail,
//                 ]}
//               />
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <View style={styles.details}>
//           {/* Product Info */}
//           <Text style={styles.name}>{params.name}</Text>
         
         
//             <Text style={styles.price}>₹{formatPrice(Number(params.price))}</Text>
          
//           <Text style={styles.sectionTitle}>Weight</Text>
//           <View style={styles.optionsContainer}>
//             <Text style={[
//               styles.optionText,
//             ]}>
//               {params.sizes} g
//             </Text>
//           </View>

          
//         </View>
//       </ScrollView>

//       <QuantityModal />
      
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   mainImage: {
//     width: width,
//     height: width,
//     resizeMode: 'cover',
//   },
//   thumbnailContainer: {
//     padding: 10,
//   },
//   thumbnail: {
//     width: 60,
//     height: 60,
//     marginRight: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   selectedThumbnail: {
//     borderColor: '#e91e63',
//     borderWidth: 2,
//   },
//   details: {
//     padding: 20,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   price: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#e91e63',
//     marginBottom: 15,
//   },
//   description: {
//     fontSize: 16,
//     color: '#666',
//     lineHeight: 24,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   optionsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   optionButton: {
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginRight: 10,
//     marginBottom: 10,
//     minWidth: 50,
//     alignItems: 'center',
//   },
//   selectedOption: {
//     backgroundColor: '#e91e63',
//     borderColor: '#e91e63',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   selectedOptionText: {
//     color: '#fff',
//   },
//   additionalInfo: {
//     backgroundColor: '#f8f8f8',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   addToCartButton: {
//     backgroundColor: '#e91e63',
//     padding: 15,
//     margin: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   addToCartText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   quantityInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   modalButton: {
//     padding: 10,
//     borderRadius: 5,
//     width: '45%',
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#666',
//   },
//   confirmButton: {
//     backgroundColor: '#e91e63',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });


import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ProductDetail() {
  const params = useLocalSearchParams();
  
  // Parse the stringified arrays
  const images = JSON.parse(params.images as string || '[]');
  const otherDesignImg = JSON.parse(params.otherDesignImg as string || '[]');
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Animation values
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Combine main images and other design images
  const allImages = [...images];

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('en-IN')}`;
  };

  const getUserId = async () => {
    try {
      if (!userEmail) {
        throw new Error('No user email found');
      }

      const response = await fetch(`https://nrf-admin-gsl7.vercel.app/api/devices/register?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      return data.device._id;
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('Error', 'Please login again');
      return null;
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      if (!userEmail) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      const userId = await getUserId();
      
      if (!userId) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const response = await fetch('https://nrf-admin-gsl7.vercel.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: params.id,
          quantity: parseInt(quantity),
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Added to cart successfully');
        setModalVisible(false);
      } else {
        Alert.alert('Error', data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = () => {
    setZoomModalVisible(true);
  };

  const resetZoom = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const ZoomModal = () => (
    <Modal
      visible={zoomModalVisible}
      transparent={true}
      onRequestClose={() => {
        setZoomModalVisible(false);
        resetZoom();
      }}
    >
      <View style={styles.zoomModalContainer}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        
        {/* Header with close button and image counter */}
        <View style={styles.zoomHeader}>
          <TouchableOpacity
            style={styles.closeZoomButton}
            onPress={() => {
              setZoomModalVisible(false);
              resetZoom();
            }}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          <View style={styles.imageCounter}>
            <Text style={styles.counterText}>
              {selectedImageIndex + 1} / {allImages.length}
            </Text>
          </View>
        </View>
        
        
        <Animated.View style={styles.zoomImageContainer}>
              <Animated.Image
                source={{ uri: allImages[selectedImageIndex] }}
                style={[
                  styles.zoomImage,
                  {
                    transform: [
                      { scale: scale },
                      { translateX: translateX },
                      { translateY: translateY },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>
        <View style={styles.zoomNavigation}>
          <TouchableOpacity
            style={[styles.navArrow, selectedImageIndex === 0 && styles.disabledNav]}
            onPress={() => {
              if (selectedImageIndex > 0) {
                setSelectedImageIndex(selectedImageIndex - 1);
                resetZoom();
              }
            }}
            disabled={selectedImageIndex === 0}
          >
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navArrow, selectedImageIndex === allImages.length - 1 && styles.disabledNav]}
            onPress={() => {
              if (selectedImageIndex < allImages.length - 1) {
                setSelectedImageIndex(selectedImageIndex + 1);
                resetZoom();
              }
            }}
            disabled={selectedImageIndex === allImages.length - 1}
          >
            <Ionicons name="chevron-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Instructions */}
        
      </View>
    </Modal>
  );

  // const QuantityModal = () => (
  //   <Modal
  //     animationType="slide"
  //     transparent={true}
  //     visible={modalVisible}
  //     onRequestClose={() => setModalVisible(false)}
  //   >
  //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  //       <View style={styles.modalContainer}>
  //         <View style={styles.modalContent}>
  //           <View style={styles.modalHeader}>
  //             <MaterialIcons name="shopping-cart" size={24} color="#D4AF37" />
  //             <Text style={styles.modalTitle}>Add to Cart</Text>
  //           </View>
            
  //           <View style={styles.quantitySection}>
  //             <Text style={styles.quantityLabel}>Quantity</Text>
  //             <View style={styles.quantityContainer}>
  //               <TouchableOpacity
  //                 style={styles.quantityButton}
  //                 onPress={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
  //               >
  //                 <Ionicons name="remove" size={20} color="#666" />
  //               </TouchableOpacity>
                
  //               <TextInput
  //                 style={styles.quantityInput}
  //                 keyboardType="number-pad"
  //                 value={quantity}
  //                 onChangeText={(text) => setQuantity(text || '1')}
  //                 placeholder="1"
  //                 maxLength={3}
  //                 returnKeyType="done"
  //                 onSubmitEditing={handleAddToCart}
  //                 textAlign="center"
  //               />
                
  //               <TouchableOpacity
  //                 style={styles.quantityButton}
  //                 onPress={() => setQuantity((parseInt(quantity) + 1).toString())}
  //               >
  //                 <Ionicons name="add" size={20} color="#666" />
  //               </TouchableOpacity>
  //             </View>
  //           </View>

  //           <View style={styles.priceSection}>
  //             <Text style={styles.totalLabel}>Total Price:</Text>
  //             <Text style={styles.totalPrice}>
  //               ₹{formatPrice(Number(params.price) * parseInt(quantity || '1'))}
  //             </Text>
  //           </View>

  //           <View style={styles.modalButtons}>
  //             <TouchableOpacity 
  //               style={[styles.modalButton, styles.cancelButton]}
  //               onPress={() => setModalVisible(false)}
  //             >
  //               <Text style={styles.cancelButtonText}>Cancel</Text>
  //             </TouchableOpacity>
              
  //             <TouchableOpacity 
  //               style={[styles.modalButton, styles.confirmButton]}
  //               onPress={handleAddToCart}
  //               disabled={loading}
  //             >
  //               <LinearGradient
  //                 colors={['#D4AF37', '#B8860B']}
  //                 style={styles.gradientButton}
  //               >
  //                 <Text style={styles.confirmButtonText}>
  //                   {loading ? 'Adding...' : 'Add to Cart'}
  //                 </Text>
  //               </LinearGradient>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableWithoutFeedback>
  //   </Modal>
  // );

  if (!params.name || !images) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="diamond" size={50} color="#D4AF37" />
          <Text style={styles.loadingText}>Loading jewelry details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsWishlisted(!isWishlisted)}
            >
              <Ionicons 
                name={isWishlisted ? "heart" : "heart-outline"} 
                size={24} 
                color={isWishlisted ? "#ff4757" : "#333"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Image Container */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.mainImageContainer}
            onPress={handleImagePress}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: allImages[selectedImageIndex] }} 
              style={styles.mainImage}
            />
            
            {/* Zoom Hint */}
            <View style={styles.zoomHint}>
              <MaterialIcons name="zoom-in" size={20} color="white" />
              <Text style={styles.zoomHintText}>Tap to zoom</Text>
            </View>
          </TouchableOpacity>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {allImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.thumbnailSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.thumbnailContainer}
          >
            {allImages.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={styles.thumbnailWrapper}
              >
                <Image
                  source={{ uri: img }}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                />
                {selectedImageIndex === index && (
                  <View style={styles.thumbnailOverlay}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Details */}
        <View style={styles.details}>
          <View style={styles.productHeader}>
            <View style={styles.productInfo}>
              <Text style={styles.name}>{params.name}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color="#FFD700"
                  />
                ))}
                <Text style={styles.ratingText}>(4.8) 124 reviews</Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{formatPrice(Number(params.price))}</Text>
              <Text style={styles.originalPrice}>₹{formatPrice(Number(params.price) * 1.2)}</Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <MaterialIcons name="verified" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Certified Authentic</Text>
            </View>
            <View style={styles.feature}>
              <MaterialIcons name="local-shipping" size={20} color="#2196F3" />
              <Text style={styles.featureText}>Free Shipping</Text>
            </View>
            <View style={styles.feature}>
              <MaterialIcons name="replay" size={20} color="#FF9800" />
              <Text style={styles.featureText}>30-Day Returns</Text>
            </View>
          </View>

          {/* Weight Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight</Text>
            <View style={styles.weightContainer}>
              <MaterialIcons name="scale" size={20} color="#D4AF37" />
              <Text style={styles.weightText}>{params.sizes} grams</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              Exquisite handcrafted jewelry piece featuring premium materials and intricate design. 
              Perfect for special occasions or as a thoughtful gift. Each piece is carefully 
              inspected to ensure the highest quality standards.
            </Text>
          </View>

          {/* Care Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care Instructions</Text>
            <View style={styles.careInstructions}>
              <Text style={styles.careText}>• Store in a dry, cool place</Text>
              <Text style={styles.careText}>• Clean with soft cloth</Text>
              <Text style={styles.careText}>• Avoid contact with chemicals</Text>
              <Text style={styles.careText}>• Remove before swimming or bathing</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {/* <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buyNowButton}>
          <LinearGradient
            colors={['#D4AF37', '#B8860B']}
            style={styles.gradientButton}
          >
            <MaterialIcons name="flash-on" size={20} color="white" />
            <Text style={styles.buyNowText}>Buy Now</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="shopping-cart" size={20} color="#D4AF37" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View> */}

      {/* <QuantityModal /> */}
      <ZoomModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  imageSection: {
    position: 'relative',
  },
  mainImageContainer: {
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  mainImage: {
    width: width,
    height: width * 0.8,
    resizeMode: 'cover',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomHintText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#D4AF37',
    width: 20,
  },
  thumbnailSection: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
  },
  thumbnailContainer: {
    paddingHorizontal: 20,
  },
  thumbnailWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#D4AF37',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    padding: 2,
  },
  details: {
    padding: 20,
  },
  productHeader: {
    marginBottom: 20,
  },
  productInfo: {
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  weightText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  careInstructions: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  careText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buyNowButton: {
    flex: 1,
    marginRight: 10,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 15,
    marginLeft: 10,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  buyNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  addToCartText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    minWidth: 60,
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  confirmButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  zoomModalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeZoomButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    padding: 10,
  },
  zoomHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    zIndex: 1000,
  },
  imageCounter: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  counterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  zoomImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImage: {
    width: width,
    height: height * 0.8,
  },
  zoomNavigation: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navArrow: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
    opacity: 0.8,
  },
  disabledNav: {
    opacity: 0.3,
  },
  zoomInstructions: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});