import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Clipboard,
    Easing,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../constants/Colors';

const Contact = () => {
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
  
    const ContactMethodCard = ({ 
      icon, 
      title, 
      value, 
      onPress,
      copyValue
    }: {
      icon: React.ReactNode, 
      title: string, 
      value: string, 
      onPress?: () => void,
      copyValue?: string
    }) => (
      <View style={styles.contactMethodCard}>
    <View style={styles.contactMethodContent}>
      <View style={styles.contactMethodIcon}>
        {icon}
      </View>
      <View style={styles.contactMethodTextContainer}>
        <Text style={styles.contactMethodTitle}>{title}</Text>
        <Text style={styles.contactMethodValue}>{value}</Text>
      </View>
      <View style={styles.contactMethodActions}>
        {onPress && (
          <TouchableOpacity onPress={onPress} style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons name="open-in-new" size={22} color="#FFD700" />
          </TouchableOpacity>
        )}
        {copyValue && (
          <TouchableOpacity onPress={() => handleCopy(copyValue, title)} style={styles.actionButton} activeOpacity={0.7}>
            <MaterialIcons 
              name="content-copy" 
              size={22} 
              color={copiedField === title ? '#4CAF50' : '#FFD700'} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
    );
  
   
  
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* <Image
              style={styles.image}
              source={{ uri: "https://res.cloudinary.com/dzpsk7xch/image/upload/v1734705712/icon_ds6z0j.png" }}
            />
            <Text style={styles.headerTitle}>Fancy Jewellers</Text>
            <Text style={styles.headerSubtitle}>Contact Fancy Jewellers</Text> */}
            <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        
  
        <View style={styles.sectionTitle} >
          {/* <BlurView style={styles.contactMethodsCard}> */}
            <Text >Contact</Text></View>
            <View>
            <ContactMethodCard 
              icon={<FontAwesome5 name="whatsapp" size={24} color="#25D366" />}
              title="WhatsApp"
              value="+91 7879902029"
              onPress={handleWhatsAppPress}
              copyValue="+917879902029"
            />
            
            <ContactMethodCard 
              icon={<MaterialIcons name="email" size={24} color="#DB4437" />}
              title="Email"
              value="sagarfancyjewellers@gmail.com"
              onPress={handleEmailPress}
              copyValue="sagarfancyjewellers@gmail.com"
            />
            <ContactMethodCard 
              icon={<MaterialIcons name="location-on" size={24} color="#4285F4" />}
              title="Address"
              value=" Parkota Tower, Katra Bazaar, Sagar, Madhya Pradesh 470002"
              copyValue=" Parkota Tower, Katra Bazaar, Sagar, Madhya Pradesh 470002"
            />
          {/* </BlurView> */}
  
          
          </View> 
        </ScrollView>
        <View><Animated.Text style={[styles.created, { transform: [{ translateX }] }]}>Build by www.dathub.in</Animated.Text></View>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      justifyContent:"center",
    },
    header: {
      padding: 20,
      paddingTop: 5,
    },
    image: {
      width: '30%',
      height: 150,
      alignSelf: 'center',
      borderRadius: 10,
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: Colors.textPrimary,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 16,
      color: Colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
      marginBottom:12
    },
    scrollContent: {
      padding: 20,
    },
      contactMethodsCard: {
       backgroundColor: Colors.surface, 
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
    
  contactMethodCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.fontColorsLight,
  },
  contactMethodContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactMethodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceDark,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
    contactMethodTextContainer: {
      flex: 1,
    },
    contactMethodTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.textSecondary,
    },
    contactMethodValue: {
      fontSize: 13,
      color: Colors.textPrimary,
      marginTop: 2,
    },
    contactMethodActions: {
      flexDirection: 'row',
    },
    actionButton: {
      marginLeft: 10,
      padding: 6,
      borderRadius: 20,
      backgroundColor: Colors.backgroundLight,
    },
    DetailCard: {
      backgroundColor: Colors.surface,
      borderRadius: 20,
      padding: 15,
      marginBottom: 20,
      overflow: 'hidden',
    },
    
    created: {
      fontSize: 12,
      color: Colors.textSecondary,
      fontWeight: "500",
      marginBottom: 10,
    },
    
  });

export default Contact
