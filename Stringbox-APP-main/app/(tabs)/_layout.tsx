import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native'; // Hapus TouchableOpacity dan Text yang tidak dipakai
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeModal from '@/components/WelcomeModal';

// Warna Tema
const THEME = {
  primaryDark: '#1e122b',
  accentPurple: '#8b5cf6',
  textSecondary: '#a89abf',
  borderColor: '#2d2438',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    checkWelcomeStatus();
  }, [user, loading]);

  const checkWelcomeStatus = async () => {
    if (loading) return;
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
          tabBarActiveTintColor: THEME.accentPurple,
          tabBarInactiveTintColor: THEME.textSecondary,
          headerShown: false,
          tabBarButton: HapticTab,
          // PENGATURAN NAVBAR STANDAR (DOCKED)
          tabBarStyle: {
            backgroundColor: THEME.primaryDark,
            borderTopColor: THEME.borderColor,
            borderTopWidth: 1,
            height: 75, // Tinggi standar yang cukup untuk icon + text
            paddingBottom: 12, // Memberi jarak dari bawah (penting untuk HP layar poni)
            paddingTop: 8,
          },
          // Font diperkecil agar 7 item muat dalam satu baris
          tabBarLabelStyle: {
            fontSize: 9, 
            fontWeight: '600',
            marginTop: 2,
          },
          // Ukuran area klik icon
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          }
        }}>
        
        {/* 1. BERANDA */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
          }}
        />

        {/* 2. MATERI */}
        <Tabs.Screen
          name="material"
          options={{
            title: 'Materi',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="book.fill" color={color} />,
          }}
        />

        {/* 3. LATIHAN */}
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Latihan',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="chevron.left.forwardslash.chevron.right" color={color} />,
          }}
        />

        {/* 4. LEADERBOARD (KEMBALI NORMAL) */}
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Rank',
            tabBarIcon: ({ color }) => <Ionicons size={24} name="trophy" color={color} />,
          }}
        />

        {/* 5. DRAG & DROP */}
        <Tabs.Screen
          name="dragdrop"
          options={{
            title: 'Drag&Drop',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="hand.draw.fill" color={color} />,
          }}
        />

        {/* 6. VISUALISASI */}
        <Tabs.Screen
          name="visualization"
          options={{
            title: 'Visual',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.xyaxis.line" color={color} />,
          }}
        />

        {/* 7. PROFILE */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.circle.fill" color={color} />,
          }}
        />

        {/* EXPLORE (Hidden) */}
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