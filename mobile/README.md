# Fresnel mobile

אפליקציית React Native (Expo SDK 58) ל-Android ול-iOS. צוות Marconi.
מה בונים: `CLAUDE.md`. איך כותבים קוד: `react-native-standards.md`.

## דרישות

- **Node 22** (לפחות 22.13, ראו `.nvmrc`). Expo SDK 58 לא רץ על Node 20.
- JDK 17, Android Studio ו-Android SDK, ומשתנה `ANDROID_HOME`.
- אמולטור Android מתמונת **Google Play**, אחרת אין Push.
- iOS: רק על Mac, עם Xcode ו-CocoaPods.

## הרצה ראשונה

כל הפקודות רצות מתוך `mobile/`.

```bash
npm install
cp .env.example .env        # למלא לפי הצורך
npm run android             # בונה את ה-dev client ומתקין על האמולטור
```

הבנייה הראשונה לוקחת כמה דקות. אחריה מספיק:

```bash
npm start                   # Metro בלבד. שינויי JS נטענים בלי בנייה
```

בונים מחדש (`npm run android`) רק אחרי שינוי ב-`app.config.ts` או הוספת ספרייה נייטיב.
ספרייה נייטיב חדשה דורשת אישור של בן.

## פקודות

| פקודה                             | מה                           |
| --------------------------------- | ---------------------------- |
| `npm start`                       | Metro ל-dev client           |
| `npm run android` / `npm run ios` | בנייה והתקנה של ה-dev client |
| `npm run lint`                    | ESLint                       |
| `npm run typecheck`               | TypeScript                   |
| `npm run format`                  | Prettier                     |

לפני כל MR: `npm run lint` ו-`npm run typecheck` עוברים נקי.

## השרת

האפליקציה פונה רק ל-`api/` בפורט 3000, וממנו לשרת ה-mock המשותף ברנדר. לפני האפליקציה, מתוך `api/`:

```bash
npm install
npm run start:dev           # http://localhost:3000/api
```

בלי Docker: `API_WITHOUT_DB=true` ב-`.env` שבשורש ה-repo.
ב-Android אין צורך לשנות את `EXPO_PUBLIC_API_URL`: `localhost` מוחלף אוטומטית בכתובת של המחשב. בטלפון אמיתי, הטלפון והמחשב צריכים להיות באותה רשת.

## כניסה בפיתוח

האפליקציה תמיד נפתחת במסך הכניסה. "כניסה עם SSO" קורא ל-`POST /api/mobile/auth`, שמביא מה-mock טוקן של משתמש אקראי (כל אחד עם גזרות והרשאות משלו, רשימה ב-`https://fresnel-mock-api.onrender.com/api/mobile/auth/users`). ה-mock מסנן את הנתונים לפי המשתמש שבטוקן. התנתקות מהפרופיל, וכניסה נוספת מגרילה משתמש אחר.

## פתיחת מסך ישירות

למשל מסך אירוע, בלי לעבור דרך הבית (מזהה של אירוע מה-mock. כל האירועים לבדיקה ב-`https://fresnel-mock-api.onrender.com/api/mock/scenarios`):

```bash
adb shell am start -W -a android.intent.action.VIEW -d "fresnel://events/6fdd21dd-94df-56de-8ee0-94fe60ddcc84"
adb shell am start -W -a android.intent.action.VIEW -d "fresnel://events/6fdd21dd-94df-56de-8ee0-94fe60ddcc84/sources"
```

## מבנה

```
src/
  app/                    # routes בלבד (expo-router). כל קובץ הוא מסך
    _layout.tsx           # providers, ומעבר בין כניסה לאפליקציה
    login.tsx             # כניסה (SSO)
    (app)/_layout.tsx     # Stack וכותרות
    (app)/index.tsx       # בית: אירועים פתוחים
    (app)/profile.tsx
    (app)/events/[id]/_layout.tsx   # בורר לשוניות
    (app)/events/[id]/index.tsx     # תמונת מצב
    (app)/events/[id]/actions.tsx   # פעולות שבוצעו
    (app)/events/[id]/sources.tsx   # מקורות מידע
  features/               # קומפוננטות ו-hooks לפי תחום
    events/ snapshot/ actions/ sources/ oracle/ profile/
  components/             # קומפוננטות משותפות (Screen, Sheet, EventTabs)
  api/                    # API client ו-TanStack Query
  auth/  realtime/  notifications/  hooks/
  constants/labels.ts     # תוויות בעברית
  config.ts               # משתני סביבה
  theme.ts                # צבעים, ריווח וגדלים
```

- `src/app/` מכיל רק routes. כל השאר מחוץ לו.
- import דרך `@/`, למשל `import { Screen } from '@/components/Screen'`.

## Push: הגדרות חד-פעמיות (בן)

ההתראות עוברות דרך שירות ה-Push של Expo. הקוד באפליקציה זהה ל-Android ול-iOS.

| מה                                                  | איפה                                                         | ב-git?      |
| --------------------------------------------------- | ------------------------------------------------------------ | ----------- |
| מזהי האפליקציה (`ANDROID_PACKAGE`, `IOS_BUNDLE_ID`) | קבועים בראש `app.config.ts`                                  | כן          |
| `EAS_PROJECT_ID` (מ-`eas init`)                     | קבוע בראש `app.config.ts`                                    | כן, לא סוד  |
| `google-services.json` (Firebase, Android)          | `mobile/google-services.json`. `app.config.ts` מזהה אותו לבד | כן, לא סוד  |
| מפתח service account של Firebase (FCM V1)           | מועלה ל-EAS עם `eas credentials`                             | **לא. סוד** |
| מפתח APNs (`.p8`, iOS)                              | נוצר או מועלה ב-EAS עם `eas credentials`                     | **לא. סוד** |

אחרי כל שינוי בקבצים האלה בונים מחדש את ה-dev client (`npm run android`).






















פרומוט להתקנת אימולטור 

Task: install the Android SDK and get an Android emulator booting on this Windows machine
You are working on a Windows machine (PowerShell 5.1) where Android Studio is installed but the Android SDK is missing or broken, and the user wants a working Android Virtual Device (AVD). Android Studio's own "SDK Components Setup" wizard shows every component as "(unavailable)" on this machine, so do NOT rely on the wizard. Follow the steps below in order, and report clearly what worked and what did not.

Known facts about this environment (learned the hard way, do not rediscover)
Corporate HTTP proxy. netsh winhttp show proxy shows a proxy (e.g. 10.106.2.4:80). Internet downloads from dl.google.com work from PowerShell. That proxy also receives localhost traffic and answers it with HTTP 403. The emulator talks to its own helper (netsimd, the Wi-Fi/Bluetooth simulator) over localhost gRPC, so without a NO_PROXY exception the emulator log shows HTTP proxy handshake with ipv4:10.106.2.4:80 failed: ... response code 403, netsim restarts every ~18 s, and boot is extremely slow or never finishes.
sdkmanager / android.exe do not work here. The new command-line tools turn sdkmanager.bat into a wrapper for android.exe, which crashes with java.io.IOException: Unable to establish loopback connection (AF_UNIX Invalid argument: connect). It fails inside and outside the sandbox. Therefore packages are installed manually from Google's official repository XML, with SHA-1 verification. avdmanager.bat (Java, run with Android Studio's bundled JBR) does work.
Windows path-length limits. Long temp/scratchpad paths break Invoke-WebRequest -OutFile and powershell -File. Put downloads and scripts under short paths such as $env:TEMP\android-sdk-dl and $env:TEMP\android-setup.
Old Intel GPU driver. Intel UHD 630 reports Vulkan 1.3.215 (< 1.3.240 required), so the emulator falls back to software rendering (SwiftShader/lavapipe). The first cold boot of an API 37 Play Store image took about 6 minutes. That is expected, not a hang.
adb commands can hang while the device is offline. Always wrap them with a timeout (e.g. Start-Job + Wait-Job -Timeout).
Hardware acceleration works: emulator -accel-check reports WHPX ... is installed and usable.
Rules
Download only from https://dl.google.com/android/repository/ and verify every archive's SHA-1 against the repository XML before extracting. Abort on any mismatch.
Do not accept the Android SDK license on the user's behalf. Android Studio/Gradle will ask the user when needed.
Setting a persistent user environment variable (NO_PROXY) is a lasting change: ask the user before doing it. Setting it only for the current process ($env:NO_PROXY = ...) is fine.
Do not delete existing SDK folders without asking. The script below refuses to overwrite.
Step 1: inspect
$sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
"SDK exists: $(Test-Path $sdk)"; if (Test-Path $sdk) { Get-ChildItem $sdk | Select-Object -ExpandProperty Name }
"ARCH=$env:PROCESSOR_ARCHITECTURE"; (Get-CimInstance Win32_Processor).Name
"HypervisorPresent=$((Get-CimInstance Win32_ComputerSystem).HypervisorPresent)"
netsh winhttp show proxy
Test-Path 'C:\Program Files\Android\Android Studio\jbr\bin\java.exe'
The steps assume an x86_64 CPU (AMD64). On ARM64, change the system image ABI accordingly.

Step 2: fix the localhost proxy problem
Ask the user, then set the variable persistently. Also set it for the current process so the rest of this session benefits:

[Environment]::SetEnvironmentVariable('NO_PROXY', 'localhost,127.0.0.1,::1', 'User')
$env:NO_PROXY = 'localhost,127.0.0.1,::1'; $env:no_proxy = $env:NO_PROXY
Tell the user to restart Android Studio afterwards. Optionally, in Android Studio, go to Settings → Appearance & Behavior → System Settings → HTTP Proxy and fill "No proxy for" with localhost, 127.0.0.1.

Step 3: install the SDK packages
Save the script below to $env:TEMP\android-setup\setup-android-sdk.ps1 (a short path) and run it with powershell -NoProfile -ExecutionPolicy Bypass -File "$env:TEMP\android-setup\setup-android-sdk.ps1". It downloads about 2.8 GB, so run it in the background and wait for it to finish.

It installs the newest stable (channel-0) cmdline-tools;latest, platform-tools and emulator, plus platforms;android-<Api> and system-images;android-<Api>;<Tag>;x86_64. Defaults: API 37.0 with google_apis_playstore (this combination booted on this machine). For a lighter image use -Api 36 -Tag google_apis.

Every package also gets a package.xml. Most archives ship only source.properties, and without package.xml the tools do not recognize the new-style 37.0 API levels (avdmanager list target comes back empty).

param(
    [string]$Api     = '37.0',
    [string]$Tag     = 'google_apis_playstore',
    [string]$Abi     = 'x86_64',
    [string]$Device  = 'pixel_10',
    [string]$AvdName = 'Pixel_API_37'
)
$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'
$sdk  = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$base = 'https://dl.google.com/android/repository/'
$dl   = Join-Path $env:TEMP 'android-sdk-dl'
$ext  = Join-Path $env:TEMP 'android-sdk-extract'
New-Item -ItemType Directory -Force $sdk, $dl, $ext | Out-Null

$repo = [xml](Invoke-WebRequest "$base/repository2-3.xml" -UseBasicParsing).Content
$sys  = [xml](Invoke-WebRequest "$base/sys-img/$Tag/sys-img2-5.xml" -UseBasicParsing).Content

function Get-Rev($p) {
    $r = $p.revision
    $minor = if ($r.minor) { $r.minor } else { 0 }
    $micro = if ($r.micro) { $r.micro } else { 0 }
    [version]("{0}.{1}.{2}" -f $r.major, $minor, $micro)
}

function Find-Package($doc, $path) {
    $doc.SelectNodes('//remotePackage') |
        Where-Object { $_.path -eq $path -and $_.channelRef.ref -eq 'channel-0' } |
        Sort-Object { Get-Rev $_ } | Select-Object -Last 1
}

function Find-Archive($pkg) {
    foreach ($a in $pkg.archives.archive) {
        $osOk   = (-not $a.'host-os')   -or $a.'host-os'   -eq 'windows'
        $archOk = (-not $a.'host-arch') -or $a.'host-arch' -eq 'x64'
        if ($osOk -and $archOk) { return $a }
    }
    throw "No Windows archive for $($pkg.path)"
}

function Write-PackageXml($doc, $pkg, $dir) {
    $out = New-Object System.Xml.XmlDocument
    $out.AppendChild($out.CreateXmlDeclaration('1.0', 'UTF-8', 'yes')) | Out-Null
    $root = $out.ImportNode($doc.DocumentElement, $false)
    $out.AppendChild($root) | Out-Null
    $licRef = $pkg.'uses-license'.ref
    $lic = $doc.DocumentElement.ChildNodes | Where-Object { $_.LocalName -eq 'license' -and $_.id -eq $licRef }
    if ($lic) { $root.AppendChild($out.ImportNode($lic, $true)) | Out-Null }
    $local = $out.CreateElement('localPackage')
    $local.SetAttribute('path', $pkg.path)
    $local.SetAttribute('obsolete', 'false')
    foreach ($child in $pkg.ChildNodes) {
        if ($child.NodeType -ne 'Element') { continue }
        if ($child.LocalName -in @('channelRef', 'archives')) { continue }
        $local.AppendChild($out.ImportNode($child, $true)) | Out-Null
    }
    $root.AppendChild($local) | Out-Null
    $out.Save((Join-Path $dir 'package.xml'))
}

$sysPath = "system-images;android-$Api;$Tag;$Abi"
$packages = @(
    @{ Path = 'cmdline-tools;latest';  Doc = $repo; Prefix = $base;                  Dest = 'cmdline-tools\latest' },
    @{ Path = 'platform-tools';        Doc = $repo; Prefix = $base;                  Dest = 'platform-tools' },
    @{ Path = 'emulator';              Doc = $repo; Prefix = $base;                  Dest = 'emulator' },
    @{ Path = "platforms;android-$Api"; Doc = $repo; Prefix = $base;                 Dest = "platforms\android-$Api" },
    @{ Path = $sysPath;                Doc = $sys;  Prefix = "$base/sys-img/$Tag/";  Dest = "system-images\android-$Api\$Tag\$Abi" }
)

foreach ($p in $packages) {
    $dest = Join-Path $sdk $p.Dest
    if (Test-Path (Join-Path $dest 'package.xml')) { Write-Output "[$($p.Path)] already installed, skipping"; continue }
    if (Test-Path $dest) { throw "$dest exists without package.xml. Ask the user before removing it." }

    $pkg = Find-Package $p.Doc $p.Path
    if (-not $pkg) { throw "Package $($p.Path) not found in the repository" }
    $a   = Find-Archive $pkg
    $url = $a.complete.url
    $sha = $a.complete.checksum.'#text'
    $zip = Join-Path $dl $url
    Write-Output "[$($p.Path)] rev $(Get-Rev $pkg): $url ($([math]::Round([int64]$a.complete.size / 1MB)) MB)"

    if (-not (Test-Path $zip) -or (Get-FileHash $zip -Algorithm SHA1).Hash.ToLower() -ne $sha) {
        Invoke-WebRequest -Uri ($p.Prefix + $url) -OutFile $zip -UseBasicParsing -TimeoutSec 3600
    }
    $h = (Get-FileHash $zip -Algorithm SHA1).Hash.ToLower()
    if ($h -ne $sha) { throw "Checksum mismatch for $($p.Path): $h != $sha" }

    $tmp = Join-Path $ext ($p.Path -replace '[;]', '_')
    if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
    New-Item -ItemType Directory $tmp | Out-Null
    tar.exe -xf $zip -C $tmp
    if ($LASTEXITCODE -ne 0) { throw "Extract failed for $($p.Path)" }
    $top = @(Get-ChildItem $tmp -Directory)
    if ($top.Count -ne 1) { throw "Unexpected archive layout in $url" }

    New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null
    Move-Item $top[0].FullName $dest
    if (-not (Test-Path (Join-Path $dest 'package.xml'))) { Write-PackageXml $p.Doc $pkg $dest }
    Write-Output "[$($p.Path)] installed to $dest"
}

# Create the AVD with avdmanager (works; sdkmanager/android.exe do not)
$env:JAVA_HOME    = 'C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME = $sdk
$avdm = Join-Path $sdk 'cmdline-tools\latest\bin\avdmanager.bat'
$existing = & (Join-Path $sdk 'emulator\emulator.exe') -list-avds
if ($existing -contains $AvdName) {
    Write-Output "AVD $AvdName already exists"
} else {
    'no' | & $avdm create avd -n $AvdName -k $sysPath -d $Device
    if ($LASTEXITCODE -ne 0) { throw 'avdmanager create avd failed' }
    Write-Output "AVD $AvdName created"
}
Write-Output 'DONE'
Verify:

$sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'; $env:ANDROID_HOME = $sdk
& "$sdk\cmdline-tools\latest\bin\avdmanager.bat" list target   # must list android-<Api>
& "$sdk\emulator\emulator.exe" -list-avds                       # must list the AVD
& "$sdk\emulator\emulator.exe" -accel-check                     # expect WHPX usable
Step 4: boot the emulator and confirm
Remove stale lock files from earlier crashed runs, then launch in the background with NO_PROXY set in the same process:

$env:NO_PROXY = 'localhost,127.0.0.1,::1'; $env:no_proxy = $env:NO_PROXY
Get-ChildItem "$env:USERPROFILE\.android\avd\Pixel_API_37.avd" -Filter *.lock -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_API_37 -no-snapshot-load -no-boot-anim
Wait for boot (up to 15 minutes for the first cold boot), with adb calls wrapped in timeouts:

$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$start = Get-Date; $ok = $false
while (((Get-Date) - $start).TotalMinutes -lt 15) {
    $j = Start-Job { param($a) & $a shell getprop sys.boot_completed } -ArgumentList $adb
    $b = (Wait-Job $j -Timeout 15 | Receive-Job) -join ''; Remove-Job $j -Force
    if ($b.Trim() -eq '1') { $ok = $true; break }
    if (-not (Get-Process -Name 'qemu-system-x86_64*' -ErrorAction SilentlyContinue)) { 'emulator exited'; break }
    Start-Sleep 15
}
"boot_completed=$ok after $([int]((Get-Date) - $start).TotalSeconds)s"
Success means boot_completed=True, adb devices shows emulator-5554  device, and the emulator output contains Boot completed in ... ms. Leave the emulator running and tell the user. Later starts from Android Studio's Device Manager use Quick Boot snapshots and take seconds.

Troubleshooting
Symptom in emulator output	Fix
HTTP proxy handshake with ... failed ... 403, netsim startup repeating every ~18 s	NO_PROXY is not set in the emulator's environment (Step 2). Restart Android Studio or the shell after setting it.
Still repeating netsim restarts even with NO_PROXY	Add -feature -WiFiPacketStream -feature -Uwb -feature -NetsimWebUi -feature -NetsimCliUi to the emulator command (with these flags the emulator booted in about 6 min).
unsupported Vulkan API level, black screen for a long time	Software rendering is slow but works. Try -gpu swiftshader_indirect -feature -Vulkan; long-term, update the Intel graphics driver.
Exit code 5 shortly after start	Usually the netsim/proxy problem above, or stale *.lock files in the .avd folder.
adb devices shows offline for minutes	Normal during a slow cold boot. Keep waiting (with timeouts). Do not kill the adb server repeatedly.
Could not find a part of the path / -File parameter does not exist	The path is too long. Move the file to $env:TEMP\....
Report back
At the end, tell the user:

Which packages and versions were installed, and whether all checksums passed.
Whether NO_PROXY was set persistently (and that Android Studio needs a restart).
Whether the emulator reached boot_completed=1, and how long it took.
Anything that di
