# APP-Stringbox

APP-Stringbox adalah aplikasi Android yang dibangun menggunakan **Jetpack Compose** dan menampilkan splash screen dengan material design yang modern. Aplikasi ini berfungsi sebagai demonstrasi implementasi splash screen dan Jetpack Compose di Android.

## 🚀 Cara Menjalankan APP

### Prerequisites
Sebelum menjalankan aplikasi, pastikan Anda sudah menginstal:
- **Android Studio** (versi terbaru)
- **Java Development Kit (JDK) 11** atau lebih tinggi
- **Android SDK** dengan API level 24 atau lebih tinggi
- **Gradle** (sudah included dengan Android Studio)
- **Git** (untuk clone repository)

### Langkah-Langkah Menjalankan

1. **Clone repository**
   ```bash
   git clone https://github.com/KenzieRafa/APP-Stringbox.git
   cd APP-Stringbox
   ```

2. **Buka project di Android Studio**
   - Buka Android Studio
   - Pilih `File` → `Open`
   - Navigate ke folder `APP-Stringbox`
   - Klik `Open`

3. **Build project**
   - Tunggu Gradle selesai melakukan build (di bawah menu ada proses loading)
   - Atau tekan `Ctrl + B` untuk build manually

4. **Setup emulator atau device**
   - Gunakan Android Virtual Device (AVD) Manager untuk membuat emulator
   - Atau gunakan device fisik dengan USB debugging enabled

5. **Run aplikasi**
   - Klik tombol `Run` (▶) atau tekan `Shift + F10`
   - Pilih emulator atau device yang ingin Anda gunakan
   - Tunggu aplikasi selesai install dan running

### Konfigurasi Project
- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 36 (Android 15)
- **Compile SDK**: API 36
- **Kotlin Version**: Latest

---

## 📝 Penjelasan Singkat Kode

### Struktur Project
```
APP-Stringbox/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/stringbox_splashscreen/
│   │   │   │   ├── MainActivity.kt          # Main Activity
│   │   │   │   └── ui/
│   │   │   │       └── theme/              # Theme configuration
│   │   │   ├── AndroidManifest.xml         # App manifest
│   │   │   └── res/                        # Resources
│   │   └── androidTest/                    # Unit tests
│   └── build.gradle.kts                    # App build config
└── build.gradle.kts                        # Project build config
```

### MainActivity.kt - File Utama Aplikasi

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Thread.sleep(3000) - Menampilkan splash screen selama 3 detik
        Thread.sleep(3000)

        // installSplashScreen() - Mengaktifkan splash screen API
        installSplashScreen()

        // enableEdgeToEdge() - Membuat UI mencover seluruh layar
        enableEdgeToEdge()

        // setContent - Menampilkan UI dengan Jetpack Compose
        setContent {
            StringboxsplashscreenTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Greeting(
                        name = "Android",
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}
```

#### Penjelasan Komponen:

1. **Thread.sleep(3000)**
   - Menampilkan splash screen selama 3 detik (3000 milliseconds)
   - Splash screen biasanya menampilkan logo atau branding app

2. **installSplashScreen()**
   - Mengaktifkan Android Splash Screen API
   - Memberikan pengalaman launching yang lebih smooth

3. **enableEdgeToEdge()**
   - Membuat konten UI meluas ke edge layar
   - Meningkatkan penggunaan space layar

4. **setContent()**
   - Mengganti view hierarchy dengan Jetpack Compose
   - Semua UI didefinisikan secara deklaratif dengan Compose

5. **Scaffold**
   - Layout container dari Material Design 3
   - Menyediakan struktur untuk AppBar, FAB, BottomBar, dll

### Greeting Composable Function

```kotlin
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}
```
- Fungsi yang menampilkan text widget sederhana
- `@Composable` annotation menandakan ini adalah Composable function
- Bisa di-preview dengan `GreetingPreview()` function

---

## 🛠 Dependencies & Libraries

| Library | Fungsi |
|---------|--------|
| `androidx.core:core-splashscreen:1.0.0` | Splash Screen API |
| `androidx.activity:activity-compose` | Integration Compose dengan Activity |
| `androidx.compose.material3` | Material Design 3 Components |
| `androidx.compose.ui` | Core Compose UI Framework |
| `androidx.lifecycle:lifecycle-runtime-ktx` | Lifecycle awareness |
| `androidx.core:core-ktx` | Android KTX extensions |

---

## 📱 Platform & Compatibility
- **Min SDK**: 24 (Android 7.0 Nougat)
- **Target SDK**: 36 (Android 15)
- **Language**: Kotlin
- **Build System**: Gradle
- **UI Framework**: Jetpack Compose

---

## 💡 Fitur Aplikasi

- ✅ Splash Screen dengan durasi 3 detik
- ✅ Material Design 3 Theme
- ✅ Edge-to-Edge UI
- ✅ Jetpack Compose Architecture
- ✅ Preview composable di Android Studio

---

## 📧 Author
Kenzie Raffa Ardhana (18223127)
Rasyid Rizky S N (18223114)
