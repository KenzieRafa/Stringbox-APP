import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeModal from '@/components/WelcomeModal';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    checkWelcomeStatus();
  }, [user, loading]);

  const checkWelcomeStatus = async () => {
    // Don't show modal if still loading auth state
    if (loading) return;

    // Show modal if user is not logged in (Force Sign In)
    if (!user) {
      setShowWelcomeModal(true);
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
  };

  return (
    <>
      <WelcomeModal
        visible={showWelcomeModal}
        onClose={handleCloseWelcome}
      />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#8b5cf6', // PracticeColors.accentPurple
          tabBarInactiveTintColor: '#a89abf', // PracticeColors.textSecondary
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#1e122b', // PracticeColors.primaryDark
            borderTopColor: '#2d2438', // PracticeColors.borderColor
            borderTopWidth: 1,
            height: 85, // Increased height to prevent cutoff
            paddingBottom: 20, // Added more padding to lift icons up
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 9.5, // Standardized font size as requested
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="material"
          options={{
            title: 'Materi',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Latihan',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            tabBarIcon: ({ color }) => <IconSymbol size={30} name="trophy.fill" color="#fff" />,
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={props.onPress}
                onLongPress={props.onLongPress || undefined}
                style={{
                  top: -30, // Raised higher as requested
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#7c3aed', // Badge Purple
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: '#7c3aed',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  borderWidth: 4,
                  borderColor: '#130b1b', // Background color to blend ring
                }}>
                  <IconSymbol size={28} name="trophy.fill" color="#fff" />
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#8b5cf6',
                    fontSize: 10, // Updated to 10px as requested
                    fontWeight: 'bold',
                    marginTop: 4,
                    textAlign: 'center',
                    width: 100, // Ensure enough width to not wrap immediately
                  }}
                >Leaderboard</Text>
              </TouchableOpacity>
            ),
            tabBarLabel: () => null, // Hide label for the center button
          }}
        />
        <Tabs.Screen
          name="dragdrop"
          options={{
            title: 'Drag&Drop',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="hand.draw.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="visualization"
          options={{
            title: 'Visualisasi',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.xyaxis.line" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}

