import { notificationsAPI } from "~/apis/";
import { logError } from "~/utils/";

const getNotifications: () => Promise<any[]> = async () => {
  try {
    const { data } = await notificationsAPI.getNotifications();
    const { notifications } = data;
    return notifications;
  } catch (error) {
    logError(`Error: getNotifications --notifications.ts-- ${error}`);
    throw error;
  }
};

export default {
  getNotifications
};
