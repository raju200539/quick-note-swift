// Service Worker for background notifications
const CACHE_NAME = 'quicknotes-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle background notifications
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { noteId, title, content, notificationTime } = event.data;
    scheduleNotification(noteId, title, content, notificationTime);
  } else if (event.data.type === 'CANCEL_NOTIFICATION') {
    const { noteId } = event.data;
    cancelNotification(noteId);
  }
});

function scheduleNotification(noteId, title, content, notificationTime) {
  const delay = new Date(notificationTime).getTime() - Date.now();
  
  if (delay > 0) {
    setTimeout(() => {
      self.registration.showNotification(`Reminder: ${title}`, {
        body: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        icon: '/favicon-r.svg',
        badge: '/favicon-r.svg',
        tag: `note-${noteId}`,
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Note'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      });
    }, delay);
  }
}

function cancelNotification(noteId) {
  // Note: We can't cancel setTimeout in service worker easily
  // So we'll just close any existing notification with the same tag
  self.registration.getNotifications({ tag: `note-${noteId}` })
    .then(notifications => {
      notifications.forEach(notification => notification.close());
    });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app when notification is clicked
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        if (clients.length > 0) {
          return clients[0].focus();
        } else {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});