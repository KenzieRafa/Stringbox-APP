import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <ThemedView style={styles.heroContainer}>
          <MaskedView
            maskElement={
              <ThemedText type="title" style={styles.heroTitle}>
                Selamat Datang di Stringbox
              </ThemedText>
            }>
            <LinearGradient
              colors={['#FFFFFF', '#C084FC', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientContainer}>
              <ThemedText type="title" style={[styles.heroTitle, { opacity: 0 }]}>
                Selamat Datang di Stringbox
              </ThemedText>
            </LinearGradient>
          </MaskedView>
          <ThemedText style={styles.heroDescription}>
            Platform pembelajaran interaktif untuk mahasiswa TPB Institut Teknologi Bandung.
            Mulai perjalanan Anda dalam dunia pemrograman Python dengan cara yang menyenangkan dan interaktif.
          </ThemedText>

          <Pressable
            onPress={() => router.push('/(tabs)/material')}>
            <LinearGradient
              colors={['#C084FC', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}>
              <ThemedText style={styles.ctaButtonText} numberOfLines={1}>
                MULAI BELAJAR SEKARANG
              </ThemedText>
            </LinearGradient>
          </Pressable>
        </ThemedView>

        {/* Divider */}
        <ThemedView style={styles.divider} />

        {/* Feature 1 */}
        <ThemedView style={styles.featureRow}>
          <ThemedView style={styles.featureNumber}>
            <ThemedText style={styles.featureNumberText}>01</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureContent}>
            <ThemedText type="subtitle" style={styles.featureTitle}>Materi Lengkap</ThemedText>
            <ThemedText style={styles.featureDescription}>
              5 bab pembelajaran dari dasar hingga mahir, dengan penjelasan konsep yang mudah dipahami dan contoh praktis untuk setiap topik pembelajaran.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Divider */}
        <ThemedView style={styles.divider} />

        {/* Feature 2 */}
        <ThemedView style={styles.featureRow}>
          <ThemedView style={styles.featureNumber}>
            <ThemedText style={styles.featureNumberText}>02</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureContent}>
            <ThemedText type="subtitle" style={styles.featureTitle}>Editor Kode Interaktif</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Tulis dan jalankan kode Python langsung di browser tanpa instalasi apapun. Lihat hasil secara real-time dengan feedback instan.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Divider */}
        <ThemedView style={styles.divider} />

        {/* Feature 3 */}
        <ThemedView style={styles.featureRow}>
          <ThemedView style={styles.featureNumber}>
            <ThemedText style={styles.featureNumberText}>03</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureContent}>
            <ThemedText type="subtitle" style={styles.featureTitle}>Latihan Terintegrasi</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Soal-soal praktik yang disesuaikan dengan materi perkuliahan, lengkap dengan sistem penilaian otomatis dan panduan step-by-step.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Divider */}
        <ThemedView style={styles.divider} />

        {/* Curriculum Section */}
        <ThemedView style={styles.curriculumSection}>
          <ThemedText type="title" style={styles.curriculumTitle}>
            Kurikulum{'\n'}Pembelajaran
          </ThemedText>

          {[
            { number: 1, title: 'Fondasi Pemrograman', desc: 'Variabel, tipe data, input/output' },
            { number: 2, title: 'Kontrol Alur', desc: 'Percabangan dan perulangan' },
            { number: 3, title: 'Kumpulan Data', desc: 'String dan list manipulation' },
            { number: 4, title: 'Struktur Lanjutan', desc: 'List 2D dan nested loops' },
            { number: 5, title: 'Fungsi', desc: 'Kode modular dan reusable' },
          ].map((item, index, array) => (
            <ThemedView key={item.number} style={styles.curriculumItem}>
              <ThemedView style={styles.curriculumLeftColumn}>
                <ThemedView style={styles.curriculumMarker}>
                  <ThemedText style={styles.curriculumMarkerText}>{item.number}</ThemedText>
                </ThemedView>
                {index < array.length - 1 && (
                  <ThemedView style={styles.curriculumLine} />
                )}
              </ThemedView>
              <ThemedView style={styles.curriculumContent}>
                <ThemedText type="defaultSemiBold" style={styles.curriculumItemTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.curriculumDesc}>{item.desc}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0b2e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  heroContainer: {
    marginBottom: 40,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  heroTitle: {
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 42,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  gradientContainer: {
    alignSelf: 'stretch',
  },
  brandName: {
    color: '#9333EA',
    fontSize: 32,
  },
  heroDescription: {
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.75,
    fontSize: 16,
    paddingHorizontal: 8,
    color: '#FFFFFF',
  },
  ctaButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginTop: 8,
    flexDirection: 'row',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
    textAlign: 'center',
    flexShrink: 0,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    padding: 0,
    backgroundColor: 'transparent',
  },
  featureNumber: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureNumberText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  featureContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  featureDescription: {
    marginTop: 6,
    lineHeight: 22,
    opacity: 0.7,
    fontSize: 14,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#4B5563',
    marginVertical: 32,
  },
  curriculumSection: {
    marginTop: 24,
    paddingTop: 16,
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  curriculumTitle: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  curriculumItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  curriculumLeftColumn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  curriculumMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    zIndex: 1,
  },
  curriculumLine: {
    width: 3,
    flex: 1,
    backgroundColor: '#9333EA',
    marginTop: 4,
    marginBottom: 4,
  },
  curriculumMarkerText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  curriculumContent: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  curriculumItemTitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  curriculumDesc: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.6,
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 40,
    backgroundColor: 'transparent',
  },
});
