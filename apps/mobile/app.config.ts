export default {
  expo: {
    name: "Sportio",
    slug: "sportio",
    version: "1.0.0",
    scheme: "sportio",
    platforms: ["ios", "android"],
    icon: "./assets/icon.png",
    splash: {
      backgroundColor: "#0A1628",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || "YOUR_EAS_PROJECT_ID",
      },
    },
    updates: {
      url: "https://u.expo.dev/YOUR_EAS_PROJECT_ID",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    ios: {
      bundleIdentifier: "com.sportio.app",
      supportsTablet: true,
    },
    android: {
      package: "com.sportio.app",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#0A1628",
      },
    },
  },
};
