import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('NOTIFICATION RESPONSE RECEIVED', JSON.stringify(response, null, 2));
    });
    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    async function logLastNotificationResponse() {
      const response = await Notifications.getLastNotificationResponseAsync()
      console.log('LAST NOTIFICATION RESPONSE', JSON.stringify(response, null, 2));
    }
    logLastNotificationResponse()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
