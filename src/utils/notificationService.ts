// Notification service for managing background notifications
export class NotificationService {
  private static swRegistration: ServiceWorkerRegistration | null = null;

  static async initialize() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
        
        // Request notification permission
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  static async scheduleNotification(noteId: string, title: string, content: string, notificationTime: Date) {
    if (!this.swRegistration) {
      console.warn('Service Worker not registered');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }
    }

    // Send message to service worker to schedule notification
    if (this.swRegistration.active) {
      this.swRegistration.active.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        noteId,
        title,
        content,
        notificationTime: notificationTime.toISOString()
      });
    }
  }

  static async cancelNotification(noteId: string) {
    if (!this.swRegistration?.active) return;

    this.swRegistration.active.postMessage({
      type: 'CANCEL_NOTIFICATION',
      noteId
    });
  }

  static async showImmediateNotification(title: string, content: string) {
    if (Notification.permission === 'granted') {
      new Notification(`Reminder: ${title}`, {
        body: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        icon: '/favicon-r.svg'
      });
    }
  }
}