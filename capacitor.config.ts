import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

	appId: 'jitcall.videocall',
	appName: 'jitCall',
	webDir: 'www',
	plugins: {

		PushNotifications: {

			presentationOptions: ['badge', 'sound', 'alert']

		}

	}, android: {
		buildOptions: {
		  keystorePath: 'my-release-key.keystore',
		  keystoreAlias: 'jitcall',
		  keystorePassword: 'jitcall123', // La que pusiste al generarlo
		  keystoreAliasPassword: 'jitcall123' // Normalmente es la misma
		}
	  }

};

export default config;