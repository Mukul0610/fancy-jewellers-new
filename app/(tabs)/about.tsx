import { MaterialIcons } from '@expo/vector-icons';
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from '../../constants/Colors';

const { width } = Dimensions.get("window");

export default function About() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialIcons name="diamond" size={60} color={Colors.fontColors} />
        <Text style={styles.title}>Fancy Jewellers</Text>
        <Text style={styles.subtitle}>Excellence in Craftsmanship Since 1985</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.description}>
          For over three decades, Fancy Jewellers has been a beacon of luxury and elegance in the world of fine jewelry.
          Founded in 1985, we have built our reputation on uncompromising quality, exquisite craftsmanship, and
          unparalleled customer service. Each piece in our collection tells a story of tradition, innovation, and timeless beauty.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Commitment</Text>
        <View style={styles.commitmentList}>
          <View style={styles.commitmentItem}>
            <MaterialIcons name="verified" size={24} color={Colors.fontColors} />
            <Text style={styles.commitmentText}>100% Authentic Precious Metals</Text>
          </View>
          <View style={styles.commitmentItem}>
            <MaterialIcons name="local-shipping" size={24} color={Colors.fontColors} />
            <Text style={styles.commitmentText}>Free Shipping Worldwide</Text>
          </View>
          <View style={styles.commitmentItem}>
            <MaterialIcons name="security" size={24} color={Colors.fontColors} />
            <Text style={styles.commitmentText}>Lifetime Warranty</Text>
          </View>
          <View style={styles.commitmentItem}>
            <MaterialIcons name="support" size={24} color={Colors.fontColors} />
            <Text style={styles.commitmentText}>24/7 Customer Support</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <Text style={styles.description}>
          We source only the finest materials from trusted suppliers around the world. Our master craftsmen
          combine traditional techniques with modern innovation to create pieces that are both heirloom-quality
          and contemporary in design. Every piece comes with certification of authenticity and our personal guarantee.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visit Our Store</Text>
        <View style={styles.storeInfo}>
          <MaterialIcons name="location-on" size={24} color={Colors.fontColors} />
          <Text style={styles.storeText}>Parkota Tower, Katra Bazaar, Sagar, Madhya Pradesh 470002</Text>
        </View>
        <View style={styles.storeInfo}>
          <MaterialIcons name="phone" size={24} color={Colors.fontColors} />
          <Text style={styles.storeText}>+91 7879902029</Text>
        </View>
        <View style={styles.storeInfo}>
          <MaterialIcons name="email" size={24} color={Colors.fontColors} />
          <Text style={styles.storeText}>sagarfancyjewellers@gmail.com</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Experience the Art of Fine Jewelry</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 20,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  commitmentList: {
    marginTop: 10,
  },
  commitmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.fontColorsLight,
  },
  commitmentText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 15,
    fontWeight: '500',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.fontColorsLight,
  },
  storeText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 15,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.surfaceDark,
    margin: 20,
    borderRadius: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.fontColors,
    textAlign: 'center',
  },
});