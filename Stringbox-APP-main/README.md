# StringBox App

StringBox adalah aplikasi mobile cross-platform yang dibangun dengan Expo dan React Native. Aplikasi ini mendukung iOS, Android, dan Web.

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Proses Build](#proses-build)
- [Struktur Proyek](#struktur-proyek)

---

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

### 1. **Node.js dan npm**
   - Download dari [https://nodejs.org/](https://nodejs.org/) (versi LTS)
   - Verifikasi instalasi:
     ```bash
     node --version
     npm --version
     ```

### 2. **Expo CLI**
   - Digunakan untuk menjalankan dan build aplikasi
   - Sudah terinstall di project ini

### 3. **Untuk Android:**
   - **Android Studio** atau **Android SDK** (API 24+)
   - **Java Development Kit (JDK) 11** atau lebih baru
   - Environment variables: `ANDROID_HOME` dan `JAVA_HOME`

### 4. **Untuk iOS (Mac only):**
   - **Xcode** (versi 12+)
   - **CocoaPods** (dependency manager untuk iOS)
   - **Xcode Command Line Tools**

### 5. **Untuk Testing di Device:**
   - **Expo Go App** (tersedia di Google Play Store dan Apple App Store)

---

## Instalasi

### Step 1: Clone Repository
```bash
git clone https://github.com/KenzieRafa/Stringbox-APP.git
cd APP_STRINGBOXFINAL
```

### Step 2: Install Dependencies
```bash
npm install
```

Proses ini akan menginstall semua package yang diperlukan termasuk Expo, React Native, dan dependencies lainnya.

### Step 3: Setup Environment (Opsional)

Jika Anda menggunakan file `.env`, buat file `.env.local` atau `.env` di root directory:
```
# .env
API_URL=https://your-api-endpoint.com
```

---

## Menjalankan Aplikasi

### Option 1: Menjalankan di Expo Go (Paling Mudah)

1. **Start Expo Server:**
   ```bash
   npm start
   ```
   atau
   ```bash
   expo start
   ```

2. **Scan QR Code:**
   - Buka **Expo Go App** di device Anda
   - Scan QR code yang muncul di terminal
   - Aplikasi akan load secara otomatis

### Option 2: Menjalankan di Android Emulator

1. **Start Expo Server:**
   ```bash
   npm start
   ```

2. **Tekan `a` di terminal** untuk membuka Android Emulator
   - Android Emulator harus sudah berjalan sebelumnya
   - Atau buka Android Studio → Virtual Device Manager

3. **Aplikasi akan auto-load** di emulator

### Option 3: Menjalankan di iOS Simulator (Mac Only)

1. **Start Expo Server:**
   ```bash
   npm start
   ```

2. **Tekan `i` di terminal** untuk membuka iOS Simulator
   - Xcode harus sudah terinstall

3. **Aplikasi akan auto-load** di simulator

### Option 4: Menjalankan di Device Fisik

1. **Android:**
   - Pastikan USB Debugging diaktifkan
   - Hubungkan device via USB
   - Jalankan: `npm start` → tekan `a`

2. **iOS:**
   - Tidak memerlukan USB connection
   - Jalankan: `npm start` → scan QR code dengan camera native iOS

---

## Proses Build

### Mengerti Build Process

Aplikasi Expo/React Native melalui beberapa tahap build:

```
Source Code (TS/TSX)
    ↓
Babel Transpiler (convert TS → JS)
    ↓
Metro Bundler (bundle semua modules)
    ↓
Platform-specific bundle (Android/iOS/Web)
    ↓
Native Module (bridge ke native code)
    ↓
APK (Android) / IPA (iOS)
```

### Build untuk Android

#### Opsi 1: Build APK (Installable File)

```bash
eas build --platform android --local
```

atau menggunakan Expo CLI langsung:

```bash
expo build:android
```

**Konfigurasi:**
- Build ini akan membuat **APK** (Android Package)
- Signing key akan diminta (jika belum ada)
- File output: `app-release.apk`

**Instalasi ke Device:**
```bash
adb install app-release.apk
```

#### Opsi 2: Build AAB (untuk Google Play Store)

```bash
eas build --platform android --local
```

- Pilih "internal" atau "production" saat prompted
- Output: `app-release.aab`
- File ini diupload ke Google Play Console

#### Opsi 3: Debug Build Lokal

```bash
npm run android
```

Memerlukan:
- Android Studio ter-install
- Android Emulator berjalan
- `ANDROID_HOME` environment variable ter-setup

### Build untuk iOS

#### Opsi 1: Build IPA (untuk Apple App Store)

```bash
eas build --platform ios --local
```

**Konfigurasi:**
- Apple Developer Account diperlukan
- Signing certificate akan diminta
- Output: `app.ipa`

#### Opsi 2: Debug Build ke Simulator

```bash
npm run ios
```

Memerlukan:
- Xcode ter-install
- iOS Simulator berjalan

#### Opsi 3: Build untuk Device Testing

```bash
eas build --platform ios --local
```

- Pilih "internal" untuk device testing
- Scan QR code dengan device untuk install

### Build untuk Web

```bash
expo build:web
```

atau

```bash
expo export --platform web
```

Output akan berada di folder `web-build/` atau `dist/`

---

## Penjelasan Build Process Lebih Detail

### 1. **Transpilation Phase**

Babel mengkonversi TypeScript ke JavaScript yang bisa dipahami oleh runtime:

```
input:  const value: string = "hello"
output: const value = "hello"
```

### 2. **Bundling Phase**

Metro Bundler mengumpulkan semua modules dan dependencies:

```javascript
// Sebelum bundling
import { useColorScheme } from '@/hooks/use-color-scheme'

// Setelah bundling - semua inline dalam satu file
```

### 3. **Platform-Specific Optimization**

Platform-specific files (`.ios.ts`, `.android.ts`, `.web.ts`) dipilih:

```
Input files:
  ├─ Component.ts
  ├─ Component.ios.ts
  ├─ Component.android.ts
  └─ Component.web.ts

Android Build Output:
  └─ Component.android.ts (dipilih)

iOS Build Output:
  └─ Component.ios.ts (dipilih)

Web Build Output:
  └─ Component.web.ts (dipilih)
```

### 4. **Native Compilation**

- **Android:** Gradle mengkompile JavaScript bridge menjadi native code
- **iOS:** Xcode mengkompile Objective-C/Swift bridge

### 5. **APK/IPA Packaging**

Seluruh bundled code dan assets dikemas ke dalam:
- **APK** (Android) - signed dengan certificate
- **IPA** (iOS) - signed dengan Apple certificate

---

## Struktur Proyek

```
APP_STRINGBOXFINAL/
├── hooks/                 # Custom React hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── app/                   # Main app structure (jika exist)
├── constants/             # App constants
├── node_modules/          # Dependencies
├── .git/                  # Git repository
├── package.json           # Project metadata & dependencies
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
├── babel.config.js       # Babel configuration
└── README.md             # This file
```

---

## Troubleshooting

### 1. **Expo Server tidak mau start**
```bash
# Clear cache
expo start --clear

# atau
npm start -- --clear
```

### 2. **Module not found error**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### 3. **Android emulator tidak muncul**
```bash
# Check emulator availability
emulator -list-avds

# Jalankan emulator secara manual
emulator -avd <emulator-name>
```

### 4. **iOS Simulator error**
```bash
# Reset iOS Simulator
xcrun simctl erase all
```

### 5. **Build gagal di Android**
- Pastikan `ANDROID_HOME` ter-setup: `echo $ANDROID_HOME`
- Update Android SDK: Buka Android Studio → SDK Manager
- Clear gradle cache: `cd android && ./gradlew clean && cd ..`

### 6. **Build gagal di iOS**
```bash
# Clear Xcode cache
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Reinstall pods
cd ios
pod deintegrate
pod install
cd ..
```

---

## Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm start

# atau dengan Expo CLI langsung
expo start
```

### Debugging

1. **Dalam Expo App:**
   - Shake device → Debug menu
   - Pilih "Open debugger" atau "Debug remote JS"

2. **Chrome DevTools:**
   - Buka `http://localhost:19000` di browser
   - Klik "Debug remote JS"

3. **VSCode Debugger:**
   - Install "React Native Tools" extension
   - Setup `.vscode/launch.json` untuk debugging

---

## Deployment

### Deploy ke Google Play Store (Android)

1. Build AAB:
   ```bash
   eas build --platform android
   ```

2. Upload ke Google Play Console:
   - Create app di [Google Play Console](https://play.google.com/console)
   - Upload AAB file
   - Fill app details dan submit untuk review

### Deploy ke Apple App Store (iOS)

1. Build IPA:
   ```bash
   eas build --platform ios
   ```

2. Upload ke App Store:
   - Create app di [App Store Connect](https://appstoreconnect.apple.com)
   - Upload IPA menggunakan Transporter
   - Fill app details dan submit untuk review

---

## Kontribusi

Untuk kontribusi:

1. Fork repository
2. Create feature branch: `git checkout -b feature/nama-feature`
3. Commit changes: `git commit -m "Add: deskripsi"`
4. Push ke branch: `git push origin feature/nama-feature`
5. Open Pull Request

---

## License

Project ini dilisensikan di bawah MIT License - lihat file LICENSE untuk detail.

---

## Support

Jika ada pertanyaan atau issue:

1. Check [Expo Documentation](https://docs.expo.dev/)
2. Check [React Native Documentation](https://reactnative.dev/)
3. Create issue di repository ini

---

**Last Updated:** November 2025
