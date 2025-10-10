import { auth } from "@/utils/firebaseConfig";
import { router } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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

    if (isInitializing) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            {currentUser ? (
                <View style={{ alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Welcome</Text>
                    <Text style={{ fontSize: 16 }}>{currentUser.email ?? 'No email available'}</Text>
                </View>
            ) : (
                <View style={{ alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>You are not logged in.</Text>
                    <Pressable
                        onPress={() => router.push('/(auth)/login')}
                        style={({ pressed }) => ({
                            backgroundColor: '#111827',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            opacity: pressed ? 0.8 : 1,
                        })}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>Login</Text>
                    </Pressable>
                </View>
            )}
        </View>
    )
}

export default Profile
