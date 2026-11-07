import { Ionicons } from "@expo/vector-icons";
import { Tabs, router, usePathname } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

const RED = "#E8311A";
const GREY = "#777";

export default function TabsLayout() {
  const pathname = usePathname();
  const isHome = pathname === "/home" || pathname === "/";

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isHome) {
        router.navigate("/home");
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [isHome]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: RED,
        tabBarInactiveTintColor: GREY,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Beranda",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? RED : GREY}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pengajuan"
        options={{
          title: "Pengajuan",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={26}
              color={focused ? RED : GREY}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? RED : GREY}
            />
          ),
        }}
      />
    </Tabs>
  );
}
