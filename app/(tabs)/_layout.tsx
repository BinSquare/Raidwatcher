import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { MaterialIcons } from 'react-native-vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName='map/index'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="map/index"
        options={{
          title: 'Map',
          lazy: false, // ✅ Keeps the tab in memory so it doesn't reset
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="list/index"
        options={{
          title: 'List',
          lazy: false, // ✅ Keeps the tab in memory so it doesn't reset
          tabBarIcon: ({ color }) => <MaterialIcons name="format-list-bulleted" size={28} color={color} />,

        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'About',
          lazy: false, // ✅ Keeps the tab in memory so it doesn't reset
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
