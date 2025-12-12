// Vue 3 Migration - NotificationsPlugin
import Notifications from "./Notifications.vue";
import { reactive } from "vue";

const NotificationStore = reactive({
  state: [], // here the notifications will be added

  removeNotification(timestamp) {
    const indexToDelete = this.state.findIndex(n => n.timestamp === timestamp);
    if (indexToDelete !== -1) {
      this.state.splice(indexToDelete, 1);
    }
  },
  addNotification(notification) {
    notification.timestamp = new Date();
    notification.timestamp.setMilliseconds(
      notification.timestamp.getMilliseconds() + this.state.length
    );
    this.state.push(notification);
  },
  notify(notification) {
    if (Array.isArray(notification)) {
      notification.forEach(notificationInstance => {
        this.addNotification(notificationInstance);
      });
    } else {
      this.addNotification(notification);
    }
  }
});

const NotificationsPlugin = {
  install(app) {
    // Provide notification store globally
    app.provide('notificationStore', NotificationStore);
    
    // Register component
    app.component("Notifications", Notifications);
    
    // Add global properties for compatibility
    app.config.globalProperties.$notify = (notification) => {
      NotificationStore.notify(notification);
    };
    app.config.globalProperties.$notifications = NotificationStore;
  }
};

export default NotificationsPlugin;


