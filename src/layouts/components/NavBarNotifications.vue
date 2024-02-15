<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { Notification } from "@layouts/types";

const store: any = useAuthStore();
const notifications = computed(() => store.user.notifications);

const removeNotification = (notificationId: number) => {
  notifications.value.forEach((item: any, index: any) => {
    if (notificationId === item.id) notifications.value.splice(index, 1);
  });
};

const markRead = (notificationId: number[]) => {
  notifications.value.forEach((item: any) => {
    notificationId.forEach((id) => {
      if (id === item.id) item.read_at != null;
    });
  });
};

const markUnRead = (notificationId: number[]) => {
  notifications.value.forEach((item: any) => {
    notificationId.forEach((id) => {
      if (id === item.id) item.read_at = null;
    });
  });
};

const handleNotificationClick = (notification: Notification) => {
  if (!notification.read_at) markRead([notification.id]);
};
</script>

<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
  />
</template>
