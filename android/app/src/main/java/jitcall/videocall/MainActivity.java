package jitcall.videocall;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Registrar plugins de Capacitor
    registerPlugins(new ArrayList<Class<? extends Plugin>>() {{
      add(com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin.class);
    }});
  }
}
