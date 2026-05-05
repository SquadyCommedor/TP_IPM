# 🔌 Hardware Guide - O Meu Guia do Cabeleireiro

## Recomendação Principal: Pulseira Multissensorial Low-Cost

Como a BITalino pode não estar disponível, aqui está uma alternativa **muito mais barata e igualmente eficaz** para o teu TP.

---

## 🧩 Componentes Necessários (Total: ~€15-25)

| Componente | Modelo | Preço (aprox.) | Onde comprar |
|-----------|--------|---------------|-------------|
| **Microcontrolador** | ESP32 DevKit V1 | €5-8 | AliExpress, Amazon |
| **Sensor de FC** | MAX30102 (oxímetro + batimentos) | €3-5 | AliExpress |
| **Acelerómetro** | GY-521 MPU6050 | €2-3 | AliExpress |
| **Motor de vibração** | Coin Vibration Motor 3V + MOSFET/driver | €1-2 | AliExpress |
| **Bateria** | LiPo 3.7V 500mAh + carregador TP4056 | €3-5 | AliExpress |
| **Pulseira/banda** | Elástica ou velcro | €1-2 | Local/DIY |
| **Protoboard/fios** | - | €2-3 | Local |

**Total: ~€15-25** (vs €200+ da BITalino)

---

## 📡 Porque ESP32 em vez de Arduino Uno?

| Feature | ESP32 | Arduino Uno |
|---------|-------|-------------|
| WiFi/Bluetooth | ✅ Built-in | ❌ Necessita shield |
| Processador | Dual-core 240MHz | 16MHz |
| Memória | 520KB RAM | 2KB RAM |
| Preço | €5-8 | €15-25 |
| Tamanho | Compacto | Maior |

**O ESP32 é ideal porque:**
- Tem WiFi nativo → envia dados direto para a app/web
- Tem Bluetooth → pode comunicar com a app mobile
- É pequeno o suficiente para uma pulseira

---

## 💓 Sensor de Batimentos Cardíacos: MAX30102

### O que mede:
- **Frequência cardíaca (BPM)** via fotopletismografia (PPG)
- **SpO2** (saturação de oxigénio no sangue) — bónus!

### Como funciona:
Dois LEDs (vermelho + infravermelho) iluminam o dedo/pulso. Um fotodetector mede a luz refletida. A variação da luz refletida corresponde ao fluxo sanguíneo → batimentos cardíacos. [^21^]

### Ligações (I2C):
```
MAX30102 VCC → ESP32 3.3V
MAX30102 GND → ESP32 GND
MAX30102 SDA → ESP32 GPIO21
MAX30102 SCL → ESP32 GPIO22
MAX30102 INT → ESP32 GPIO4 (opcional)
```

### Biblioteca Arduino:
```cpp
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

MAX30105 particleSensor;

void setup() {
  Serial.begin(115200);
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 não encontrado!");
    while(1);
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

void loop() {
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue)) {
    // Detetou batimento!
    float bpm = 60 / ((millis() - lastBeat) / 1000.0);
    Serial.print("BPM: "); Serial.println(bpm);
  }
}
```

---

## 🎯 Acelerómetro: GY-521 (MPU6050)

### O que mede:
- **Aceleração em 3 eixos** (X, Y, Z) → deteta movimentos bruscos, balançar
- **Giroscópio em 3 eixos** → deteta rotação/Agitação
- **Temperatura** → bónus

### Porque é útil para PEA:
Crianças com autismo têm **comportamentos repetitivos** (stimming) que aumentam com a ansiedade:
- Balançar as mãos
- Agitar os pés
- Morder as unhas
- Acelerómetro deteta estes padrões de movimento! [^30^]

### Ligações (I2C):
```
MPU6050 VCC → ESP32 3.3V
MPU6050 GND → ESP32 GND
MPU6050 SDA → ESP32 GPIO21 (partilhado com MAX30102)
MPU6050 SCL → ESP32 GPIO22 (partilhado com MAX30102)
```

**Nota:** Ambos os sensores usam I2C e podem partilhar os mesmos pinos SDA/SCL! O MPU6050 tem endereço 0x68 e o MAX30102 tem 0x57, por isso não há conflito.

### Biblioteca:
```cpp
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;

void setup() {
  if (!mpu.begin()) {
    Serial.println("MPU6050 não encontrado!");
    while(1);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Magnitude do movimento (agitação)
  float movement = sqrt(a.acceleration.x*a.acceleration.x + 
                        a.acceleration.y*a.acceleration.y + 
                        a.acceleration.z*a.acceleration.z);

  Serial.print("Movimento: "); Serial.println(movement);
}
```

---

## 📳 Motor de Vibração: Coin Vibration Motor

### Modelo recomendado:
**Coin Vibration Motor 3V** (tipo os que vêm nos telemóveis) — ~€0.50-1.00

### Especificações típicas:
- Tensão: 1.5-3V
- Corrente: 60-80mA
- Diâmetro: 8-10mm
- Espessura: 2-3mm [^15^]

### ⚠️ IMPORTANTE: NÃO ligues diretamente ao ESP32!

O ESP32 não fornece corrente suficiente (máx ~40mA por pino). Precisas de:

**Opção 1: Transistor NPN (2N2222) — €0.10**
```
ESP32 GPIO → Resistor 1kΩ → Base do 2N2222
Emissor do 2N2222 → GND
Coletor do 2N2222 → Motor -
Motor + → 3.3V
Diodo (1N4001) em paralelo com o motor (catodo para 3.3V)
```

**Opção 2: Módulo pré-fabricado — €1-2**
Módulos como o "Vibration Motor Module" já têm o transistor integrado. [^17^]
```
VCC → 3.3V
GND → GND
IN → ESP32 GPIO (qualquer pino digital com PWM)
```

### Código de controlo PWM:
```cpp
const int MOTOR_PIN = 18;  // GPIO do ESP32

void setup() {
  pinMode(MOTOR_PIN, OUTPUT);
  ledcSetup(0, 5000, 8);  // Canal 0, 5kHz, 8-bit
  ledcAttachPin(MOTOR_PIN, 0);
}

// Vibração suave (calma)
void calmVibration() {
  for(int i=0; i<255; i+=5) {
    ledcWrite(0, i);      // Aumenta intensidade
    delay(20);
  }
  delay(1000);
  for(int i=255; i>0; i-=5) {
    ledcWrite(0, i);      // Diminui intensidade
    delay(20);
  }
}

// Vibração no ritmo da respiração (4s in, 6s out)
void breathingVibration() {
  // Inspiração - 4 segundos
  for(int i=0; i<=255; i++) {
    ledcWrite(0, i);
    delay(4000/255);
  }
  // Expiração - 6 segundos
  for(int i=255; i>=0; i--) {
    ledcWrite(0, i);
    delay(6000/255);
  }
}
```

---

## 🔋 Alimentação

### Opção 1: Bateria LiPo 3.7V + TP4056
- **LiPo 500mAh**: Dura ~2-3 horas de uso contínuo
- **TP4056**: Módulo de carregamento USB-C/Micro-USB
- **Regulador**: AMS1117-3.3V para converter 3.7V → 3.3V

### Opção 2: Power Bank pequeno
- Mais fácil para protótipo
- Menos elegante para pulseira final

---

## 📡 Comunicação com a App

### Opção A: WiFi + HTTP (mais fácil)
O ESP32 cria um servidor web simples ou envia dados para a API:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "NOME_DA_REDE";
const char* password = "PASSWORD";
const char* serverUrl = "https://teu-projeto.supabase.co/rest/v1/bitalino_readings";

void sendData(float heartRate, float movement, int stressLevel) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", "SUA_SUPABASE_ANON_KEY");

  String json = "{"heart_rate":" + String(heartRate) + 
                ","movement":" + String(movement) +
                ","stress_index":" + String(stressLevel) + "}";

  http.POST(json);
  http.end();
}
```

### Opção B: WebSocket (tempo real)
Mais eficiente para dados contínuos.

### Opção C: Bluetooth BLE (sem WiFi do salão)
Se o salão não tiver WiFi, usa Bluetooth Low Energy:
```cpp
#include <BLEDevice.h>
#include <BLEServer.h>

BLEServer *pServer;
BLECharacteristic *pCharacteristic;

void setupBLE() {
  BLEDevice::init("PulseiraCabeleireiro");
  pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
  pCharacteristic = pService->createCharacteristic(
    "beb5483e-36e1-4688-b7f5-ea07361b26a8",
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pService->start();
}
```

---

## 🧮 Algoritmo de Stress Combinado

```cpp
// Normaliza cada sensor para 0-100
float normalizeHR(float hr) {
  // FC normal: 60-100, stress: 100-160
  return constrain(map(hr, 60, 160, 0, 100), 0, 100);
}

float normalizeMovement(float mov) {
  // Movimento calmo: ~9.8 (só gravidade), agitado: >15
  return constrain(map(mov, 9.8, 20, 0, 100), 0, 100);
}

// Índice combinado (pesos ajustáveis)
int calculateStress(float hr, float movement) {
  float hrWeight = 0.6;      // FC tem mais peso
  float movWeight = 0.4;   // Movimento complementa

  float stress = (normalizeHR(hr) * hrWeight) + 
                 (normalizeMovement(movement) * movWeight);

  return (int)stress;
}
```

---

## 🏗️ Montagem Física

```
    [Pulseira Elástica]
         │
    ┌────┴────┐
    │  ESP32  │  ← Microcontrolador central
    │ (pequeno)│
    └────┬────┘
         │
    ┌────┼────┐
    │    │    │
[MAX30102] [MPU6050] [Motor Vibração]
  (dedo)   (pulso)    (interior pulseira)
```

### Dicas de montagem:
1. **MAX30102**: Colocar numa aba flexível que envolve o dedo indicador
2. **MPU6050**: Fixar no pulso (onde a pulseira fica)
3. **Motor**: No interior da pulseira, contra a pele
4. **ESP32**: No centro, na parte de cima do pulso
5. **Bateria**: Na parte de baixo do pulso (contrapeso)

---

## 📋 Lista de Compras (copy-paste)

```
1x ESP32 DevKit V1
1x MAX30102 sensor module
1x GY-521 MPU6050 module  
1x Coin vibration motor 3V
1x 2N2222 transistor (ou módulo driver)
1x 1kΩ resistor
1x 1N4001 diode
1x LiPo battery 3.7V 500mAh
1x TP4056 charging module
1x AMS1117-3.3 regulator
1x Breadboard + jumper wires
1x Velcro/elastic band for bracelet
```

---

## 🔗 Recursos Úteis

- [MAX30102 com ESP32 - Tutorial completo](https://microcontrollerslab.com/esp32-heart-rate-pulse-oximeter-max30102/) [^23^]
- [MPU6050 com ESP32 - Random Nerd Tutorials](https://randomnerdtutorials.com/esp32-mpu-6050-accelerometer-gyroscope-arduino/) [^30^]
- [Vibration Motor com Arduino](https://deepbluembedded.com/arduino-vibration-motor-code-circuit/) [^15^]
- [ESP32 $3 Heart Rate Monitor (2026)](https://www.atomic14.com/2026/03/15/cheap-heart-rate-monitor.html) [^21^]
