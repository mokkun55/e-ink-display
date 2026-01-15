# サーバー側実装要件

## 概要

ESP32 の 7.3 インチ e-Paper ディスプレイ（800×480 ピクセル）に表示するための画像データを提供するサーバーの実装要件です。

## HTTP エンドポイント仕様

### リクエスト

- **メソッド**: `GET`
- **エンドポイント**: 任意（例: `/api/image` または `/image.bin`）
- **認証**: 必要に応じて実装

### レスポンス

- **Content-Type**: `application/octet-stream`
- **Content-Length**: 画像データのバイト数（必須）
- **Body**: バイナリデータ（生の画像データ）

## 画像データ形式

### 基本仕様

- **解像度**: 800×480 ピクセル（フルスクリーン）
- **データサイズ**: `width × height ÷ 2` バイト
  - フルスクリーン: 800 × 480 ÷ 2 = **192,000 バイト**
- **ピクセルフォーマット**: 1 バイトに 2 ピクセル分のデータ
  - 上位 4 ビット: 1 ピクセル目の色情報
  - 下位 4 ビット: 2 ピクセル目の色情報

### データ順序

- **順序**: 行優先（左 → 右、上 → 下）
- **インデックス計算**: `data[j + width*i]`
  - `i`: 行番号（0 ～ height-1）
  - `j`: 列番号（0 ～ width/2-1）
  - `width`: 画像の幅（ピクセル単位）

### 色パレット

各ピクセルは 3 ビット（0x0 ～ 0x7）で色を表現します：

| 値  | 色     | 説明             |
| --- | ------ | ---------------- |
| 0x0 | BLACK  | 黒               |
| 0x1 | WHITE  | 白               |
| 0x2 | GREEN  | 緑               |
| 0x3 | BLUE   | 青               |
| 0x4 | RED    | 赤               |
| 0x5 | YELLOW | 黄               |
| 0x6 | ORANGE | オレンジ         |
| 0x7 | CLEAN  | 使用不可（残像） |

### データ例

同じ色を 2 ピクセル分送る場合：

- 白 2 ピクセル: `0x11` (0x1 << 4 | 0x1)
- 黒 2 ピクセル: `0x00` (0x0 << 4 | 0x0)
- 赤 2 ピクセル: `0x44` (0x4 << 4 | 0x4)

異なる色を 2 ピクセル分送る場合：

- 白と黒: `0x10` (0x1 << 4 | 0x0)
- 赤と青: `0x43` (0x4 << 4 | 0x3)

## HTTP レスポンス例

### 成功時のレスポンス（200 OK）

#### レスポンスヘッダー

```
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 192000
Cache-Control: no-cache
Connection: close
```

#### レスポンスボディ

バイナリデータ（192,000 バイト）。例：

```
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11
22 22 22 22 22 22 22 22 22 22 22 22 22 22 22 22
...
```

### エラー時のレスポンス

#### 404 Not Found（画像が見つからない場合）

```
HTTP/1.1 404 Not Found
Content-Type: text/plain
Content-Length: 13

Image not found
```

#### 500 Internal Server Error（サーバーエラー）

```
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain
Content-Length: 21

Internal server error
```

### 重要なポイント

1. **Content-Type**: `application/octet-stream`（バイナリデータ）
2. **Content-Length**: 必須（ESP32 側でメモリ確保に使用）
3. **Cache-Control**: `no-cache`（画像が頻繁に更新される場合）
4. **Body**: 生のバイナリデータ（テキスト変換なし）

# **ハードウェア側の実装**

```
#include <SPI.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "epd7in3f.h"

// WiFi設定 - お使いの環境に合わせて変更してください
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
// サーバーURL
// TODO localhostは使えないよ!!
const char* serverUrl = "http://192.168.1.100:3000/api/epaper";

#define IMAGE_DATA_SIZE (EPD_WIDTH * EPD_HEIGHT / 2)

Epd epd;

void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.println("Starting e-Paper display application...");

    // WiFi接続
    Serial.print("Connecting to WiFi: ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);

    int wifiAttempts = 0;
    while (WiFi.status() != WL_CONNECTED && wifiAttempts < 20) {
        delay(500);
        Serial.print(".");
        wifiAttempts++;
    }

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("\nWiFi connection failed!");
        return;
    }

    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    // 電子ペーパー初期化
    Serial.println("Initializing e-Paper display...");
    if (epd.Init() != 0) {
        Serial.println("e-Paper init failed!");
        return;
    }

    Serial.println("e-Paper initialized successfully!");

    // 画面をクリア
    Serial.println("Clearing display...");
    epd.Clear(EPD_7IN3F_WHITE);
    delay(1000);

    // HTTPから画像データを取得して表示
    fetchAndDisplayImage();

    // スリープモードに移行
    Serial.println("Entering sleep mode...");
    epd.Sleep();
}

void loop() {
    // メインループでは何もしない（1回だけ実行）
    // delay(60000); // 60秒待機（必要に応じて再取得を実装可能）
}

void fetchAndDisplayImage() {
    HTTPClient http;
    
    Serial.print("Fetching image from: ");
    Serial.println(serverUrl);

    http.begin(serverUrl);
    
    int httpCode = http.GET();
    
    if (httpCode > 0) {
        Serial.printf("HTTP response code: %d\n", httpCode);
        
        if (httpCode == HTTP_CODE_OK) {
            // Content-Type を確認
            String contentType = http.header("Content-Type");
            Serial.print("Content-Type: ");
            Serial.println(contentType);

            // Content-Length を取得
            int contentLength = http.getSize();
            Serial.print("Content-Length: ");
            Serial.println(contentLength);

            if (contentLength != IMAGE_DATA_SIZE) {
                Serial.print("Warning: Expected ");
                Serial.print(IMAGE_DATA_SIZE);
                Serial.print(" bytes, got ");
                Serial.println(contentLength);
            }

            // 画像データ用のバッファを確保
            uint8_t* imageData = (uint8_t*)malloc(IMAGE_DATA_SIZE);
            if (imageData == NULL) {
                Serial.println("Failed to allocate memory for image data!");
                http.end();
                return;
            }

            // データを受信
            WiFiClient* stream = http.getStreamPtr();
            size_t bytesRead = 0;
            
            Serial.println("Downloading image data...");
            while (http.connected() && bytesRead < IMAGE_DATA_SIZE) {
                size_t available = stream->available();
                if (available > 0) {
                    size_t toRead = min(available, (size_t)(IMAGE_DATA_SIZE - bytesRead));
                    size_t read = stream->readBytes(imageData + bytesRead, toRead);
                    bytesRead += read;
                    
                    // 進行状況を表示（10%ごと）
                    if (bytesRead % (IMAGE_DATA_SIZE / 10) < toRead) {
                        Serial.print("Progress: ");
                        Serial.print((bytesRead * 100) / IMAGE_DATA_SIZE);
                        Serial.println("%");
                    }
                }
                delay(1);
            }

            Serial.print("Downloaded ");
            Serial.print(bytesRead);
            Serial.println(" bytes");

            if (bytesRead == IMAGE_DATA_SIZE || bytesRead > 0) {
                // 電子ペーパーに表示
                Serial.println("Displaying image on e-Paper...");
                
                if (bytesRead == IMAGE_DATA_SIZE) {
                    // フルスクリーン表示
                    epd.EPD_7IN3F_Display(imageData);
                } else {
                    Serial.println("Warning: Incomplete image data, display may be corrupted");
                    // 不完全なデータでも表示を試みる
                    epd.EPD_7IN3F_Display(imageData);
                }
                
                Serial.println("Image displayed successfully!");
            } else {
                Serial.println("Failed to download image data!");
            }

            // メモリを解放
            free(imageData);
        } else {
            Serial.printf("HTTP request failed with code: %d\n", httpCode);
        }
    } else {
        Serial.printf("HTTP request failed: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
}

```