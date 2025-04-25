package com.jtcall.videocall;

import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.RemoteMessage;

@CapacitorPlugin(name = "NotificationPlugin")
public class NotificationPlugin extends Plugin {

    private static final String TAG = "NotificationPlugin";

    @PluginMethod
    public void subscribeToTopic(PluginCall call) {
        String topic = call.getString("topic", "all");

        FirebaseMessaging.getInstance().subscribeToTopic(topic)
            .addOnCompleteListener(task -> {
                if (!task.isSuccessful()) {
                    Log.e(TAG, "Subscription failed", task.getException());
                    call.reject("Failed to subscribe to topic");
                    return;
                }

                JSObject ret = new JSObject();
                ret.put("message", "Subscribed to topic: " + topic);
                call.resolve(ret);
            });
    }

    @PluginMethod
    public void unsubscribeFromTopic(PluginCall call) {
        String topic = call.getString("topic", "all");

        FirebaseMessaging.getInstance().unsubscribeFromTopic(topic)
            .addOnCompleteListener(task -> {
                if (!task.isSuccessful()) {
                    Log.e(TAG, "Unsubscription failed", task.getException());
                    call.reject("Failed to unsubscribe from topic");
                    return;
                }

                JSObject ret = new JSObject();
                ret.put("message", "Unsubscribed from topic: " + topic);
                call.resolve(ret);
            });
    }

    @PluginMethod
    public void sendNotification(PluginCall call) {
        String token = call.getString("token");
        String title = call.getString("title", "New Notification");
        String body = call.getString("body", "You have a new message");

        if (token == null || token.isEmpty()) {
            call.reject("Device token is required");
            return;
        }

        try {
            FirebaseMessaging.getInstance().send(new RemoteMessage.Builder(token)
                .setMessageId(Integer.toString((int) System.currentTimeMillis()))
                .addData("title", title)
                .addData("body", body)
                .build());

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error sending notification", e);
            call.reject("Failed to send notification: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getFCMToken(PluginCall call) {
        FirebaseMessaging.getInstance().getToken()
            .addOnCompleteListener(task -> {
                if (!task.isSuccessful()) {
                    Log.e(TAG, "Fetching FCM token failed", task.getException());
                    call.reject("Failed to get FCM token");
                    return;
                }

                String token = task.getResult();
                JSObject ret = new JSObject();
                ret.put("token", token);
                call.resolve(ret);
            });
    }
}
