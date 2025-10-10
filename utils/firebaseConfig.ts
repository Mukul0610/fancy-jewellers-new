import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  // @ts-ignore
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyB-drcKAH8VAHpmsdWLbnPIqp3SmtrBn60",
  authDomain: "com.fancyjewellers.fancyjewellers",
  projectId: "fancy-jewellers",
  storageBucket: "fancy-jewellers.firebasestorage.app",
  messagingSenderId: "769345226854",
  appId: "1:769345226854:android:a34fa06d61979e039845a7"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp;
  private messaging: any;
  private initialized: boolean = false;

  private constructor() {
    this.app = app;
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      if (Platform.OS === 'web') {
        const isMessagingSupported = await isSupported();
        if (isMessagingSupported) {
          this.messaging = getMessaging(this.app);
        }
      }
      
      this.initialized = true;
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      this.initialized = false;
      throw error;
    }
  }

  public async getMessagingToken(): Promise<string | null> {
    if (!this.initialized || !this.messaging) {
      console.warn('Firebase messaging not initialized');
      return null;
    }

    try {
      const token = await getToken(this.messaging);
      console.log('Firebase messaging token:', token);
      return token;
    } catch (error) {
      console.error('Error getting messaging token:', error);
      return null;
    }
  }

  public getMessaging() {
    return this.messaging;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}

export default FirebaseService;
export { app, auth };
