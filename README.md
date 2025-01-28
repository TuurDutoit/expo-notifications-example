expo-notifications example
===

This repo contains a minimal example of `expo-notifications`.
It can be used to reproduce an issue with `expo-notifications`, where it provides an "empty" notification response when launching the app on Android.

## Steps used to create this repo
1. `npx create-expo-app --template bare-minimum`
2. `npx expo install expo-notifications`
3. Added some logs to see the data received from `expo-notifications` in the console

## How to reproduce the issue
1. Build and run the app: `npm run android`
2. Close and reopen the app

Expected behavior: the last notification response logged to the console is `null`

Actual behavior: the data is an object that *looks* like a notification response, but misses most of the keys.

JS logs:
```
 LOG  LAST NOTIFICATION RESPONSE {
  "actionIdentifier": "expo.modules.notifications.actions.DEFAULT",
  "notification": {
    "date": 0,
    "request": {
      "identifier": null,
      "content": {
        "data": {
          "anim_not_finish": false
        },
        "title": null
      },
      "trigger": {
        "type": "push",
        "channelId": null
      }
    }
  }
}
```

Native logs (logcat):
```
01-28 13:36:20.643 10349 10436 I expo-notifications: NotificationsEmitter.onNotificationResponseIntentReceived:
01-28 13:36:20.643 10349 10436 I expo-notifications: actionIdentifier: expo.modules.notifications.actions.DEFAULT
01-28 13:36:20.643 10349 10436 I expo-notifications: notification
01-28 13:36:20.643 10349 10436 I expo-notifications:   date: 0
01-28 13:36:20.643 10349 10436 I expo-notifications:   request
01-28 13:36:20.643 10349 10436 I expo-notifications:     identifier: (null)
01-28 13:36:20.643 10349 10436 I expo-notifications:     trigger
01-28 13:36:20.643 10349 10436 I expo-notifications:       type: push
01-28 13:36:20.643 10349 10436 I expo-notifications:       channelId: (null)
01-28 13:36:20.643 10349 10436 I expo-notifications:     content
01-28 13:36:20.643 10349 10436 I expo-notifications:       data
01-28 13:36:20.643 10349 10436 I expo-notifications:         anim_not_finish: false
01-28 13:36:20.643 10349 10436 I expo-notifications:       title: (null)
```

## Other useful info
Note that, when the app is launched, there is 1 "extra" attached to the intent: `anim_not_finish`. I'm not sure where this comes from, I assume it's from my OS (I use a OnePlus Nord 2T 5G).
```
01-28 13:36:19.229 10349 10349 I expo-notifications: ExpoNotificationLifeCycleListener.onCreate::
01-28 13:36:19.229 10349 10349 I expo-notifications: anim_not_finish: false
01-28 13:36:19.229 10349 10349 I TESTING : MainActivity.onCreate | intent.extras:
01-28 13:36:19.229 10349 10349 I TESTING : MainActivity.onCreate | - anim_not_finish
01-28 13:36:19.229 10349 10349 I TESTING : MainActivity.onCreate | /intent.extras
```

## What I've been able to find so far
- `MainActivity.onCreate` calls `ReactActivityDelegateWrapper.onCreate`
- `ReactActivityDelegateWrapper.onCreate` calls all `reactActivityLifecycleListeners` [here](https://github.com/expo/expo/blob/6ada9f5a9559fd75aeeaffdfdff5dc4e1b3180bf/packages/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt#L183)
- That includes `expo-notifications`' `ExpoNotificationLifecycleListener.onCreate` [here](https://github.com/expo/expo/blob/6ada9f5a9559fd75aeeaffdfdff5dc4e1b3180bf/packages/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoNotificationLifecycleListener.java#L31)
- If there are *any* extras attacked to the intent, they are passed to `mNotificationManager.onNotificationResponseFromExtras`
