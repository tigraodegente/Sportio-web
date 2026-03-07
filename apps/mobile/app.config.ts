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
  },
};
