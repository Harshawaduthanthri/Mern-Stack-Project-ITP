// Assuming you have a function to send notifications to admin
export const sendNotificationToAdmin = async (message) => {
    try {
      // Code to send notification to admin
      console.log("Notification sent to admin:", message);
      // You would have your actual notification sending logic here
    } catch (error) {
      console.error("Error sending notification to admin:", error);
      throw error;
    }
  };
  