export default {
  expo: {
    name: "Hostel Manager",
    slug: "hostel-manager",
    version: "1.0.0",
    platforms: ["ios", "android"],
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2E86AB"
    },
    notifications: {
      icon: "./assets/notification-icon.png",
      color: "#2E86AB"
    },
    android: {
      package: "com.hostelmanager.app",
      versionCode: 1
    },
    ios: {
      bundleIdentifier: "com.hostelmanager.app",
      buildNumber: "1.0.0"
    },
    extra: {
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};