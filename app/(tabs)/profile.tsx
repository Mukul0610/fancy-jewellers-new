import { auth } from "@/utils/firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

const Profile = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser)
    const [isInitializing, setIsInitializing] = useState<boolean>(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setIsInitializing(false)
        })
        return unsubscribe
    }, [])

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (isInitializing) {
        return (
            <View style={styles.loadingContainer}>
                <MaterialIcons name="diamond" size={50} color={Colors.fontColors} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {currentUser ? (
                <View style={styles.profileContainer}>
                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <MaterialIcons name="account-circle" size={80} color={Colors.fontColors} />
                        </View>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.userName}>{currentUser.displayName || 'Valued Customer'}</Text>
                        <Text style={styles.userEmail}>{currentUser.email}</Text>
                    </View>

                    <View style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>Account</Text>
                        
                        <View style={styles.menuItem}>
                            <MaterialIcons name="shopping-bag" size={24} color={Colors.fontColors} />
                            <Text style={styles.menuText}>My Orders</Text>
                            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                        </View>

                        <View style={styles.menuItem}>
                            <MaterialIcons name="favorite" size={24} color={Colors.fontColors} />
                            <Text style={styles.menuText}>Wishlist</Text>
                            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                        </View>

                        <View style={styles.menuItem}>
                            <MaterialIcons name="location-on" size={24} color={Colors.fontColors} />
                            <Text style={styles.menuText}>Shipping Addresses</Text>
                            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                        </View>

                        <View style={styles.menuItem}>
                            <MaterialIcons name="payment" size={24} color={Colors.fontColors} />
                            <Text style={styles.menuText}>Payment Methods</Text>
                            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                        </View>
                    </View>

                    <View style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>Support</Text>
                        
                        <View style={styles.menuItem}>
                            <MaterialIcons name="help" size={24} color={Colors.fontColors} />
                            <Text style={styles.menuText}>Help & Support</Text>
                            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                        </View>

                        <View style={styles.menuItem}>
                            <MaterialIcons name="privacy-tip" size={24} color={Colors.fontColors} />
                            <Text style={styles.menuText}>Privacy Policy</Text>
                            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                        </View>

                        <View style={styles.menuItem}>
                            <MaterialIcons name="description" size={24} color={Colors.fontColors} />
                            <Text style={styles.menuText}>Terms of Service</Text>
                            <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                        </View>
                    </View>

                    <View style={styles.logoutSection}>
                        <Pressable
                            onPress={handleLogout}
                            style={styles.logoutButton}
                        >
                            <MaterialIcons name="logout" size={24} color={Colors.textPrimary} />
                            <Text style={styles.logoutText}>Logout</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View style={styles.loginPrompt}>
                    <MaterialIcons name="account-circle" size={100} color={Colors.fontColorsLight} />
                    <Text style={styles.loginTitle}>Welcome to Fancy Jewellers</Text>
                    <Text style={styles.loginSubtitle}>Sign in to access your account and exclusive offers</Text>
                    <Pressable
                        onPress={() => router.push('/(auth)/login')}
                        style={styles.loginButton}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push('/(auth)/signup')}
                        style={styles.signupButton}
                    >
                        <Text style={styles.signupButtonText}>Create Account</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 10,
    },
    profileContainer: {
        flex: 1,
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
    avatarContainer: {
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    menuSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.fontColorsLight,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        marginLeft: 15,
    },
    logoutSection: {
        padding: 20,
        paddingBottom: 40,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundMedium,
        padding: 15,
        borderRadius: 12,
    },
    logoutText: {
        fontSize: 16,
        color: Colors.textPrimary,
        marginLeft: 10,
        fontWeight: '600',
    },
    loginPrompt: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    loginSubtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: Colors.accent,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: Colors.background,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    loginButtonText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    signupButton: {
        borderWidth: 2,
        borderColor: Colors.fontColors,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    signupButtonText: {
        color: Colors.fontColors,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Profile
