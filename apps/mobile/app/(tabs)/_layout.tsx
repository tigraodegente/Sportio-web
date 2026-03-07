import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ACTIVE_COLOR = "#00C853";
const INACTIVE_COLOR = "#78909C";
const TAB_BAR_BG = "#0D1B2A";

type TabIcon = React.ComponentProps<typeof Ionicons>["name"];

const tabs: { name: string; title: string; icon: TabIcon }[] = [
  { name: "index", title: "Home", icon: "home" },
  { name: "compete", title: "Compete", icon: "trophy" },
  { name: "feed", title: "Feed", icon: "chatbubble-ellipses" },
  { name: "wallet", title: "Wallet", icon: "wallet" },
  { name: "profile", title: "Profile", icon: "person" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
          borderTopColor: "#1B2838",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
