import { StyleSheet, Pressable, Linking, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getUserProgress, toggleChapterCompletion } from '@/services/scoreService';
import { useAuth } from '@/contexts/AuthContext';

export default function MaterialScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [isCompletedBab1, setIsCompletedBab1] = useState(false);
  const [isCompletedBab2, setIsCompletedBab2] = useState(false);
  const [isCompletedBab3, setIsCompletedBab3] = useState(false);
  const [isCompletedBab4, setIsCompletedBab4] = useState(false);
  const [isCompletedBab5, setIsCompletedBab5] = useState(false);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    const progress = await getUserProgress();
    if (progress && progress.completed_modules) {
      setIsCompletedBab1(progress.completed_modules.includes(1));
      setIsCompletedBab2(progress.completed_modules.includes(2));
      setIsCompletedBab3(progress.completed_modules.includes(3));
      setIsCompletedBab4(progress.completed_modules.includes(4));
      setIsCompletedBab5(progress.completed_modules.includes(5));
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  }, []);

  const openVideoBab1 = () => {
    Linking.openURL('https://www.youtube.com/watch?v=gxmTFXfrMzk');
  };

  const openVideoBab2 = () => {
    Linking.openURL('https://www.youtube.com/watch?v=Hqndpzj0ZFg');
  };

  const openVideoBab3 = () => {
    Linking.openURL('https://www.youtube.com/watch?v=MPvC9uWATLI');
  };

  const openVideoBab4 = () => {
    Linking.openURL('https://www.youtube.com/watch?v=6VDCFBKyn7Y');
  };

  const openVideoBab5 = () => {
    Linking.openURL('https://www.youtube.com/watch?v=wQwf5eKpxqs');
  };

  const toggleCompletionBab1 = async () => {
    const newState = !isCompletedBab1;
    setIsCompletedBab1(newState); // Optimistic update
    await toggleChapterCompletion(1);
    loadProgress(); // Sync to be sure
  };

  const toggleCompletionBab2 = async () => {
    const newState = !isCompletedBab2;
    setIsCompletedBab2(newState);
    await toggleChapterCompletion(2);
    loadProgress();
  };

  const toggleCompletionBab3 = async () => {
    const newState = !isCompletedBab3;
    setIsCompletedBab3(newState);
    await toggleChapterCompletion(3);
    loadProgress();
  };

  const toggleCompletionBab4 = async () => {
    const newState = !isCompletedBab4;
    setIsCompletedBab4(newState);
    await toggleChapterCompletion(4);
    loadProgress();
  };

  const toggleCompletionBab5 = async () => {
    const newState = !isCompletedBab5;
    setIsCompletedBab5(newState);
    await toggleChapterCompletion(5);
    loadProgress();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#9333EA" />}
      >
        {/* Page Title */}
        <ThemedText style={styles.pageTitle}>Materi Pembelajaran</ThemedText>

        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.babLabel}>BAB 1</ThemedText>
          <ThemedText style={styles.title}>Fondasi Pemrograman Python</ThemedText>

          <Pressable style={styles.videoButton} onPress={openVideoBab1}>
            <ThemedText style={styles.videoButtonText}>Tonton Video</ThemedText>
          </Pressable>

          {/* Divider Line */}
          <ThemedView style={styles.divider} />
        </ThemedView>

        {/* Tujuan Pembelajaran */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tujuan Pembelajaran</ThemedText>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Konseptual:</ThemedText> Mahasiswa memahami alur kerja dasar dari program komputer yang terdiri dari Input → Proses → Output.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Praktis:</ThemedText> Mahasiswa mampu menulis dan menjalankan program Python sederhana untuk memahami bagaimana data diproses di dalam komputer.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Materi Perkuliahan */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Materi Perkuliahan</ThemedText>

          {/* Topic 1 */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>1. Konsep Inti: Variabel dan Tipe Data</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Variabel</ThemedText> adalah wadah untuk menyimpan data. Analogi: variabel seperti sebuah kotak berlabel yang berisi nilai tertentu.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Dynamic Typing di Python:</ThemedText> Tidak perlu mendeklarasikan tipe data secara eksplisit, Python otomatis menentukannya saat program berjalan.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Konvensi Penamaan:</ThemedText> Menggunakan format snake_case (huruf kecil dengan garis bawah sebagai pemisah), misal{' '}
                <ThemedText style={styles.codeText}>nama_mahasiswa</ThemedText>.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 1A */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>A. Jenis Tipe Data Dasar dalam Python:</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Integer (int):</ThemedText> Bilangan bulat (positif, negatif, atau nol)
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Floating Point (float):</ThemedText> Bilangan pecahan (desimal)
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>String (str):</ThemedText> Teks yang ditulis dengan tanda kutip
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Boolean (bool):</ThemedText> Nilai logika dengan dua kemungkinan: benar (True) atau salah (False)
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 1B */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>B. Kesalahan umum:</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Mengakses variabel yang belum didefinisikan (menyebabkan error)
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Salah penulisan nama variabel karena Python membedakan huruf besar dan kecil (case-sensitive)
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 2 */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>2. Interaksi Program: Input, Output, dan Konversi Tipe Data</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Program harus bisa berkomunikasi dengan pengguna
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Input:</ThemedText> Perintah untuk menerima data dari pengguna
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Output:</ThemedText> Perintah untuk menampilkan hasil (string)
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Semua data dari input awalnya berupa teks (string), sehingga jika ingin melakukan operasi matematika, perlu dilakukan konversi tipe data (casting)
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Contoh: mengubah string menjadi integer menggunakan <ThemedText style={styles.codeText}>int()</ThemedText>
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Output dapat diformat agar lebih jelas, misalnya dengan memisahkan beberapa nilai menggunakan koma atau teks penjelas
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 3 */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>3. Operator Aritmatika dan Aturan Prioritas</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Operator</ThemedText> adalah simbol untuk melakukan operasi matematika seperti penjumlahan, pengurangan, perkalian, dan pembagian
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Prioritas operasi (precedence):</ThemedText> Aturan yang menentukan urutan eksekusi operasi. Misalnya, operasi perkalian dan pembagian dieksekusi lebih dahulu, kemudian pangkat, lalu perkalian/pembagian, baru penjumlahan/pengurangan
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Catatan penting:</ThemedText> di Python, pembagian biasa selalu menghasilkan bilangan desimal, meskipun hasilnya bulat
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* BAB 1 Completion Button */}
        <ThemedView style={styles.divider} />

        <Pressable
          style={[styles.completionButton, isCompletedBab1 && styles.completionButtonCompleted]}
          onPress={toggleCompletionBab1}
        >
          <ThemedText style={styles.completionButtonText}>
            ✓ Tandai Pembelajaran Selesai
          </ThemedText>
        </Pressable>

        <ThemedView style={styles.divider} />

        {/* BAB 2 */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.babLabel}>BAB 2</ThemedText>
          <ThemedText style={styles.title}>Mengontrol Alur Program</ThemedText>

          <Pressable style={styles.videoButton} onPress={openVideoBab2}>
            <ThemedText style={styles.videoButtonText}>Tonton Video</ThemedText>
          </Pressable>

          {/* Divider Line */}
          <ThemedView style={styles.divider} />
        </ThemedView>

        {/* Tujuan Pembelajaran BAB 2 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tujuan Pembelajaran</ThemedText>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Konseptual:</ThemedText> Mahasiswa memahami bagaimana alur eksekusi program dapat dikontrol agar tidak berjalan lurus saja, melainkan dapat bercabang atau berulang.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Praktis:</ThemedText> Mahasiswa mampu menggunakan percabangan dan perulangan untuk menyelesaikan permasalahan logika sederhana.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Materi Perkuliahan BAB 2 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Materi Perkuliahan</ThemedText>

          {/* Topic 1 - Percabangan */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>1. Percabangan (if-elif-else)</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Alur keputusan:</ThemedText> Program sering kali harus memilih jalur berdasarkan kondisi tertentu. Misalnya, jika nilai ujian {'>'} 85, maka hasilnya 'A'.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Indentasi:</ThemedText> Python menggunakan indentasi (spasi menjorok) di dalam blok kondisional untuk membentuk blok kode. Kesalahan indentasi akan membuat program tidak dapat dijalankan.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Truthy dan Falsy:</ThemedText> Nilai tertentu dianggap False jika kosong atau nol; Python juga menganggap nilai lain sebagai kondisi benar atau salah. Contoh: angka 0, string kosong, list kosong dianggap salah (False).
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 2 - Perulangan */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>2. Perulangan (Looping)</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>While Loop:</ThemedText> Digunakan ketika jumlah pengulangan belum diketahui. Perulangan terus dilakukan selama kondisi tertentu masih benar.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>For Loop:</ThemedText> Digunakan untuk mengulang berdasarkan data yang sudah jelas jumlahnya.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Break:</ThemedText> Menghentikan perulangan sepenuhnya.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Continue:</ThemedText> Melewati satu iterasi lalu melanjutkan ke iterasi berikutnya.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 3 - Kesalahan Umum */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>3. Kesalahan Umum</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Tidak memperbaruhi variabel kondisi dalam while loop sehingga menimbulkan loop tak berjung.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Salah memahami fungsi <ThemedText style={styles.codeText}>range()</ThemedText>, karena range() menghasilkan urutan dari 0 sampai n-1, bukan sampai n.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* BAB 2 Completion Button */}
        <ThemedView style={styles.divider} />

        <Pressable
          style={[styles.completionButton, isCompletedBab2 && styles.completionButtonCompleted]}
          onPress={toggleCompletionBab2}
        >
          <ThemedText style={styles.completionButtonText}>
            ✓ Tandai Pembelajaran Selesai
          </ThemedText>
        </Pressable>

        <ThemedView style={styles.divider} />

        {/* BAB 3 */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.babLabel}>BAB 3</ThemedText>
          <ThemedText style={styles.title}>Bekerja dengan Kumpulan Data</ThemedText>

          <Pressable style={styles.videoButton} onPress={openVideoBab3}>
            <ThemedText style={styles.videoButtonText}>Tonton Video</ThemedText>
          </Pressable>

          {/* Divider Line */}
          <ThemedView style={styles.divider} />
        </ThemedView>

        {/* Tujuan Pembelajaran BAB 3 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tujuan Pembelajaran</ThemedText>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Konseptual:</ThemedText> Mahasiswa memahami perbedaan antara string yang dapat diubah (mutable) dan yang tidak bisa diubah (immutable).
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Praktis:</ThemedText> Mahasiswa mampu menyimpan, mengakses, dan memanipulasi data dalam jumlah banyak menggunakan string dan list.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Materi Perkuliahan BAB 3 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Materi Perkuliahan</ThemedText>

          {/* Topic 1 - String */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>1. String sebagai Sekuens Data</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                String adalah kumpulan karakter yang bersifat immutable. Artinya, setelah string dibuat, isinya tidak dapat diubah.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Operasi seperti menambah, menjadi kapital atau menghapus spasi hanya menghasilkan string baru, bukan memodifikasi string asli.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                String memiliki banyak metode bawaan, seperti mengubah ke huruf besar, menggabungkan, memisahkan atau mengganti kata tertentu, atau memisahkan string menjadi daftar kata.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 2 - List */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>2. List sebagai Koleksi Dinamis</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                List adalah kumpulan elemen yang bersifat mutable. Artinya, isi list dapat ditambah, diubah, atau dihapus.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                List digunakan untuk menyimpan data dalam jumlah banyak yang dapat berubah-ubah.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Python menyediakan metode bawaan untuk list misalnya, menambah elemen, mengurutkan elemen, dan mengurutkan.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Penting untuk memahami bahwa beberapa metode list mengubah data asli dan tidak mengembalikan nilai baru.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 3 - Kesalahan Umum */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>3. Kesalahan Umum</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Menggunakan metode string pada list, atau sebaliknya.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Mengira metode <ThemedText style={styles.codeText}>sort()</ThemedText> menghasilkan list baru, padahal sebenarnya mengubah list yang sudah ada.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* BAB 3 Completion Button */}
        <ThemedView style={styles.divider} />

        <Pressable
          style={[styles.completionButton, isCompletedBab3 && styles.completionButtonCompleted]}
          onPress={toggleCompletionBab3}
        >
          <ThemedText style={styles.completionButtonText}>
            ✓ Tandai Pembelajaran Selesai
          </ThemedText>
        </Pressable>

        <ThemedView style={styles.divider} />

        {/* BAB 4 */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.babLabel}>BAB 4</ThemedText>
          <ThemedText style={styles.title}>Struktur Data Lanjutan dan Pola Perulangan</ThemedText>

          <Pressable style={styles.videoButton} onPress={openVideoBab4}>
            <ThemedText style={styles.videoButtonText}>Tonton Video</ThemedText>
          </Pressable>

          {/* Divider Line */}
          <ThemedView style={styles.divider} />
        </ThemedView>

        {/* Tujuan Pembelajaran BAB 4 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tujuan Pembelajaran</ThemedText>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Konseptual:</ThemedText> Mahasiswa memahami bagaimana data dalam jumlah besar dapat direpresentasikan dalam bentuk baris dan kolom.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Praktis:</ThemedText> Mahasiswa mampu membuat dan mengolah list 2D dengan menggunakan perulangan bersarang.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Materi Perkuliahan BAB 4 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Materi Perkuliahan</ThemedText>

          {/* Topic 1 - Perulangan Bersarang */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>1. Perulangan Bersarang</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Perulangan bersarang adalah perulangan di dalam perulangan.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Analogi: seperti jam, di mana jarum panjang (menit) berputar lebih cepat dan jarum pendek (jam) bergeser satu langkah. Perulangan dalam (inner loop) menyelesaikan seluruh iterasinya untuk setiap satu iterasi loop luar.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Nested loop umum digunakan untuk memproses data 2 dimensi (list of list) atau grid.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 2 - List 2D */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>2. List Dua Dimensi (Matriks)</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                List 2D adalah list yang berisi list lain.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Data diakses menggunakan indeks ganda: indeks baris dan indeks kolom.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Matriks memungkinkan penyimpanan data dalam bentuk label, misalnya papan pertandingan atau papan permainan.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 3 - Kesalahan Umum */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>3. Kesalahan Umum</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Mengakses indeks yang tidak ada (IndexError).
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Membalik urutan indeks baris dan kolom.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* BAB 4 Completion Button */}
        <ThemedView style={styles.divider} />

        <Pressable
          style={[styles.completionButton, isCompletedBab4 && styles.completionButtonCompleted]}
          onPress={toggleCompletionBab4}
        >
          <ThemedText style={styles.completionButtonText}>
            ✓ Tandai Pembelajaran Selesai
          </ThemedText>
        </Pressable>

        <ThemedView style={styles.divider} />

        {/* BAB 5 */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.babLabel}>BAB 5</ThemedText>
          <ThemedText style={styles.title}>Membuat Kode Modular dengan Fungsi</ThemedText>

          <Pressable style={styles.videoButton} onPress={openVideoBab5}>
            <ThemedText style={styles.videoButtonText}>Tonton Video</ThemedText>
          </Pressable>

          {/* Divider Line */}
          <ThemedView style={styles.divider} />
        </ThemedView>

        {/* Tujuan Pembelajaran BAB 5 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tujuan Pembelajaran</ThemedText>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Konseptual:</ThemedText> Mahasiswa memahami konsep abstraksi dan cara meningkatkan kualitas dengan membagi program besar menjadi bagian-bagian kecil.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.subsection}>
            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Praktis:</ThemedText> Mahasiswa mampu membuat fungsi yang rapi, efisien, serta dapat digunakan kembali.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Materi Perkuliahan BAB 5 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Materi Perkuliahan</ThemedText>

          {/* Topic 1 - Abstraksi dan Dekomposisi */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>1. Abstraksi dan Dekomposisi</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Dekomposisi:</ThemedText> Memecah masalah besar menjadi sub-masalah kecil yang lebih mudah dikontrol.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                <ThemedText style={styles.boldText}>Abstraksi:</ThemedText> Menyembunyikan detail implementasi dan hanya menampilkan cara penggunaan. Misalnya, saat menggunakan fungsi bawaan seperti <ThemedText style={styles.codeText}>print()</ThemedText>, kita tidak perlu tahu bagaimana cara kerja hasil yang diberikan.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Fungsi dapat diberi dokumentasi (docstring) untuk menjelaskan tujuan, parameter, dan hasil yang diterima.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 2 - Parameter dan Return */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>2. Parameter, Argumen, dan Nilai Kembali (Return)</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Fungsi dapat menerima data melalui parameter.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Argumen dapat diberikan berdasarkan urutan (positional) atau berdasarkan nama (keyword).
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Parameter dapat memiliki nilai default sehingga opsional saat fungsi dipanggil.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Fungsi bisa mengembalikan hasil dengan return, yang dapat digunakan dalam perhitungan atau saat input.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Topic 3 - Variable Scope */}
          <ThemedView style={styles.topic}>
            <ThemedText style={styles.topicTitle}>3. Variabel Lokal dan Global (Scope)</ThemedText>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Variabel lokal: Dibuat di dalam fungsi dan hanya dapat diakses di fungsi tersebut.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Variabel global: Dibuat di luar fungsi dan dapat diakses di mana saja.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.bulletRow}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Sebaiknya hindari mengubah variabel global dari dalam fungsi, karena dapat membingungkan alur program.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* BAB 5 Completion Button */}
        <ThemedView style={styles.divider} />

        <Pressable
          style={[styles.completionButton, isCompletedBab5 && styles.completionButtonCompleted]}
          onPress={toggleCompletionBab5}
        >
          <ThemedText style={styles.completionButtonText}>
            ✓ Tandai Pembelajaran Selesai
          </ThemedText>
        </Pressable>

        <ThemedView style={styles.divider} />

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
  pageTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 20,
    marginTop: 23,
    textAlign: 'center',
    lineHeight: 36,
  },
  header: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    marginTop: 20,
  },
  babLabel: {
    fontSize: 14,
    color: '#9333EA',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 32,
  },
  videoButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 12,
  },
  subsection: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  topic: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: 'transparent',
    marginLeft: 20,
  },
  bullet: {
    fontSize: 14,
    color: '#CCCCCC',
    marginRight: 8,
    minWidth: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#9333EA',
    fontWeight: '600',
  },
  completionButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 0,
    alignSelf: 'center',
    minWidth: '80%',
  },
  completionButtonCompleted: {
    backgroundColor: '#34C759',
  },
  checkIcon: {
    marginRight: 8,
  },
  completionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  bottomSpacer: {
    height: 40,
    backgroundColor: 'transparent',
  },
});
