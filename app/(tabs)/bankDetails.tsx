import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Clipboard,
    Easing,
    Linking,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const BankDetails = () => {
  //animating create logo 
  
  const translateX = useRef(new Animated.Value(400)).current; // Start off-screen (right)

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -200, // Move to the left (off-screen)
          duration: 10000,
          easing: Easing.inOut(Easing.ease), // Smooth ease-in-out movement
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 400, // Move back to the right (off-screen)
          duration: 10000,
          easing: Easing.inOut(Easing.ease), // Smooth ease-in-out movement
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -200, // Move back to the right (off-screen)
          duration: 10000,
          easing: Easing.inOut(Easing.ease), // Smooth ease-in-out movement
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [translateX]);


  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    Clipboard.setString(value);
    setCopiedField(field);
    Alert.alert('Copied', `${field} copied to clipboard`);
    
    // Reset the copied field after 2 seconds
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('whatsapp://send?phone=+917879902029');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:sagarfancyjewellers@gmail.com');
  };

  

  const BankDetailCard = ({ 
    title,
    details
  }: {
    title: string,
    details: {label: string, value: string}[]
  }) => (
    <View  style={styles.bankDetailCard}>
      
      
      <View style={styles.bankDetailContent}>
      <Image
              style={styles.logoimage}
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/en/f/f2/BankOfBarodaLogo.svg",
              }}
            />
        {details.map((detail, index) => (
          <View key={index} style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>{detail.label}</Text>
            <TouchableOpacity 
              onPress={() => handleCopy(detail.value, detail.label)}
              style={styles.bankDetailValueContainer}
            >
              <Text 
                style={[
                  styles.bankDetailValue, 
                  copiedField === detail.label && styles.copiedValue
                ]}
              >
                {detail.value}
              </Text>
              <MaterialIcons 
                name="content-copy" 
                size={16} 
                color="#E7B858"
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
        <BankDetailCard 
          title="Primary Bank Account"
          details={[
            { label: "Account Name", value: "Fancy Jewellers" },
            { label: "Account Number", value: "07680200000814" },
            { label: "IFSC Code", value: "BARB0SAGARX" },
            { label: "Bank Name", value: "BANK OF BARODA" },
            { label: "Branch", value: "KATRA BAZAR SAGAR" }
          ]}
        />

        <BankDetailCard 
          title="Secondary Bank Account"
          details={[
            { label: "Account Name", value: "New Fancy Jewellers" },
            { label: "Account Number", value: "07680200000290" },
            { label: "IFSC Code", value: "BARB0SAGARX" },
            { label: "Bank Name", value: "BANK OF BARODA" },
            { label: "Branch", value: "KATRA BAZAR SAGAR" }
          ]}
        />
      {/* </ScrollView> */}
      {/* <View><Animated.Text style={[styles.created, { transform: [{ translateX }] }]}>Build by www.dathub.in</Animated.Text></View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  logoimage: {
    width: 280,
    height: 100,
  },
  
 
  
  
//   contactMethodsCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
  
 
  
  bankDetailCard: {
    borderRadius: 20,
    padding: 15,
    overflow: 'hidden',
  },
  bankDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  bankDetailContent: {
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankDetailLabel: {
    fontSize: 12,
    
    flex: 1,
  },
  bankDetailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankDetailValue: {
    fontSize: 14,
    
    fontWeight: '500',
    marginRight: 8,
  },
  created: {
    fontSize: 14,
    
    fontWeight: '500',
    marginRight: 8,
   // Transparent background for floating effect
    paddingHorizontal: 10,
    paddingVertical: 5,
     // For Android shadow effect
  },
  copiedValue: {
    
  },
});


export default BankDetails
