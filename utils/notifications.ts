import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { onMessage } from 'firebase/messaging';
import { Platform } from 'react-native';
import FirebaseService from './firebaseConfig';

interface NotificationHandler {
  onNotificationReceived?: (notification: any) => void;
  onNotificationResponse?: (response: any) => void;
}

export class PushNotificationService {
  private firebaseService: FirebaseService;

  constructor() {
    this.firebaseService = FirebaseService.getInstance();
  }

  public async initialize(): Promise<void> {
    if (Platform.OS !== 'web') {
      await this.firebaseService.initialize();
    }
  }

  public async requestNotificationPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push notification permissions');
        return false;
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          // Include newer iOS fields to satisfy NotificationBehavior in newer SDKs
          shouldShowBanner: true,
          shouldShowList: true,
        } as Notifications.NotificationBehavior),
      });

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default Channel',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  public async getPushToken(): Promise<string | null> {
    try {
      const permissionsGranted = await this.requestNotificationPermissions();
      if (!permissionsGranted) return null;

      // Get Expo push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error('Missing EAS Project ID in app config');
      }

      const { data: expoToken } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      // Get Firebase token if available
      if (this.firebaseService.isInitialized()) {
        await this.firebaseService.getMessagingToken();
      }

      return expoToken;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  public setupNotificationListeners({
    onNotificationReceived,
    onNotificationResponse
  }: NotificationHandler) {
    let unsubscribeFirebase = () => {};

    const messaging = this.firebaseService.getMessaging();
    if (messaging) {
      unsubscribeFirebase = onMessage(messaging, async (remoteMessage) => {
        console.log('Firebase Foreground Message:', remoteMessage);
        onNotificationReceived?.(remoteMessage);
      });
    }

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        onNotificationReceived?.(notification);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        onNotificationResponse?.(response);
      }
    );

    return () => {
      unsubscribeFirebase();
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }
}