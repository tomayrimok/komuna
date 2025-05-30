import axios from 'axios';
import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = 'BBHAayEpqS4peeQYeK9Qb0dFG6kShA4WD4A3UOvhXSxteAkBORDLvhz5nZrWSHGFgzi5YQ8kcMNoURRNFWFho5Y';

export const requestPermissionAndGetToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            return null;
        }

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        await axios.post('/api/notifications/register-token', { token });
        return token;
    } catch (err) {
        console.error('Error getting FCM token:', err);
        return null;
    }
}

export const listenToForegroundMessages = (callback: (payload: any) => void) => {
    onMessage(messaging, callback)
}
