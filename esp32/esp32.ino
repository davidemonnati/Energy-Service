/* lettura impulsi da Solaris ENRG2 di 4 appartamenti con gli interrupt
//  wemos d1 pro  
// pin Apartment1 D5 --> GPIO14
// pin Apartment2 D6 --> GPIO12
// pin Apartment3 D7 --> GPIO13
// pin Apartment4 D8 --> GPIO15
// pin LED Out    D0 --> GPIO16
// pin SCL x RTC  D1 --> GPIO5
// pin SCA x RTC  D2 --> GPIO4
*/
//LIBRERIE
#include <WiFi.h>
#include "esp_wpa2.h" //wpa2 library for connections to Enterprise networks
#include <PubSubClient.h>
#include <EEPROM.h>
//#include <NTPClient.h>
#include <RTClib.h>
#include <TimeLib.h>
#include <WiFiUdp.h>
//#include <Bounce2.h>
//#include <DS1307RTC.h>

//PARAMETRI RTC
RTC_DS1307 rtc; // per gestire RTP wemos usa i PIN: SCL-SDA (D1-D2)
DateTime adesso;
DateTime now1;
DateTime now2;
DateTime now3;
DateTime now4;
 
//PARAMETRI NTP (TimeNTP_ESP8266WiFi.ino)
static const char ntpServerName[] = "europe.pool.ntp.org";
const int timeZone = 1;
unsigned int localPort = 8888;  // local port to listen for UDP packets
const int NTP_PACKET_SIZE = 48; // NTP time is in the first 48 bytes of message
byte packetBuffer[NTP_PACKET_SIZE]; //buffer to hold incoming & outgoing packets

WiFiUDP ntpUDP;
time_t getNtpTime();
void digitalClockDisplay();
void printDigits(int digits);
void sendNTPpacket(IPAddress &address);
/*-------- NTP code ----------*/
void digitalClockDisplay(){  // digital clock display of the time
  Serial.print(hour());
  printDigits(minute());
  printDigits(second());
  Serial.print(" ");
  Serial.print(day());
  Serial.print(".");
  Serial.print(month());
  Serial.print(".");
  Serial.print(year());
  Serial.println();
}

void printDigits(int digits){ // utility for digital clock display: prints preceding colon and leading 0
  Serial.print(":");
  if (digits < 10)
    Serial.print('0');
  Serial.print(digits);
}

time_t getNtpTime() {
  IPAddress ntpServerIP; // NTP server's ip address
  while (ntpUDP.parsePacket() > 0) ; // discard any previously received packets
  Serial.println("Transmit NTP Request");
  // get a random server from the pool
  WiFi.hostByName(ntpServerName, ntpServerIP);
  Serial.print(ntpServerName);
  Serial.print(": ");
  Serial.println(ntpServerIP);
  sendNTPpacket(ntpServerIP);
  uint32_t beginWait = millis();
  while (millis() - beginWait < 1500) {
    int size = ntpUDP.parsePacket();
    if (size >= NTP_PACKET_SIZE) {
      Serial.println("Receive NTP Response");
      ntpUDP.read(packetBuffer, NTP_PACKET_SIZE);  // read packet into the buffer
      unsigned long secsSince1900;
      // convert four bytes starting at location 40 to a long integer
      secsSince1900 =  (unsigned long)packetBuffer[40] << 24;
      secsSince1900 |= (unsigned long)packetBuffer[41] << 16;
      secsSince1900 |= (unsigned long)packetBuffer[42] << 8;
      secsSince1900 |= (unsigned long)packetBuffer[43];
      return secsSince1900 - 2208988800UL + timeZone * SECS_PER_HOUR;
    }
  }
  Serial.println("No NTP Response :-(");
  return 0; // return 0 if unable to get the time
}

void sendNTPpacket(IPAddress &address){// send an NTP request to the time server at the given address
  // set all bytes in the buffer to 0
  memset(packetBuffer, 0, NTP_PACKET_SIZE);
  // Initialize values needed to form NTP request
  // (see URL above for details on the packets)
  packetBuffer[0] = 0b11100011;   // LI, Version, Mode
  packetBuffer[1] = 0;     // Stratum, or type of clock
  packetBuffer[2] = 6;     // Polling Interval
  packetBuffer[3] = 0xEC;  // Peer Clock Precision
  // 8 bytes of zero for Root Delay & Root Dispersion
  packetBuffer[12] = 49;
  packetBuffer[13] = 0x4E;
  packetBuffer[14] = 49;
  packetBuffer[15] = 52;
  // all NTP fields have been given values, now
  // you can send a packet requesting a timestamp:
  ntpUDP.beginPacket(address, 123); //NTP requests are to port 123
  ntpUDP.write(packetBuffer, NTP_PACKET_SIZE);
  ntpUDP.endPacket();
}

//PARAMETRI WIFI
const char* ssid = "IoTeam Enterprise";  //"iPhoneX di Matteo" - "MARCANTOGNINI"
const char* username = "username";
const char* password = "password";
WiFiClient espClient1;
//WiFiClient espClient2;

//PARAMETRI MQTT
                                                          // MQTT broker UNICAM: 90.147.42.37
const char* mqtt_server1 = "192.168.1.13";    // MQTT broker ITIS Fabriano: lab.iismerlonimiliani.it
//const char* mqtt_server1 = "192.168.0.148";
PubSubClient client(espClient1);
//PubSubClient client(espClient2);
String payload;

const char* clientID = "Building0Test";         //DA CAMBIARE
const char* outTopic_Ap1 = "Building0Test/apartment1";
const char* outTopic_Ap2 = "Building0Test/apartment2";
const char* outTopic_Ap3 = "Building0Test/apartment3";
const char* outTopic_Ap4 = "Building0Test/apartment4";
//const char* inTopic = "contatore";

// DICHIARAZIONE ROUTINE DI INTERRUPT
void ICACHE_RAM_ATTR ap1_INT ();
void ICACHE_RAM_ATTR ap2_INT ();
void ICACHE_RAM_ATTR ap3_INT ();
void ICACHE_RAM_ATTR ap4_INT ();

//DICHIARAZIONE PIN HW
int ap1_PIN = 14; // Pin D5 - Apartment n°1 GREEN
int ap2_PIN = 12; // Pin D6 - Apartment n°2 WHITE
int ap3_PIN = 13; // Pin D7 - Apartment n°3 BLUE
int ap4_PIN = 15; // Pin D8 - Apartment n°4 YELLOW
int LED     = 16; // Pin D0 - LED

//VARIABILI DI CONTEGGIO PULSAZIONI
unsigned long t1_1;   //time of pulse now
unsigned long t1_0;   //previous time
unsigned long Tt1;     // duration 
unsigned long t2_1;   //time of pulse now
unsigned long t2_0;   //previous time
unsigned long Tt2;     // duration
unsigned long t3_1;   //time of pulse now
unsigned long t3_0;   //previous time
unsigned long Tt3;     // duration 
unsigned long t4_1;   //time of pulse now
unsigned long t4_0;   //previous time
unsigned long Tt4;     // duration 

//long previousMillis = 0;
//long interval = 60000;
int wait = 0;
const int MINUTO = 60;
int TOLL = 0;
bool consumo;

// STRUTTURE DATI CODA DEGLI IMPULSI
//invio ogni 5 min (300 sec), max 1 imp/sec quindi 300 caselle 
struct impulso {
  String  t;
  int     dur;
};  
struct consumo {
  String  t;
  int     w;
  bool    sent;
};
struct impulso Impulsi1[300];
int dimI1=0; 
struct consumo Consumi1[300];
int dimC1=0;

struct impulso Impulsi2[300];
int dimI2=0;
struct consumo Consumi2[300];
int dimC2=0;

struct impulso Impulsi3[300];
int dimI3=0;
struct consumo Consumi3[300];
int dimC3=0;

struct impulso Impulsi4[300];
int dimI4=0;
struct consumo Consumi4[300];
int dimC4=0;

// VARIABILI DI APPOGGIO PER LA COMPATTAZIONE
int i;
int j;
int k;
unsigned long prev_millis;
String cur_ts;

// ALTRE VARIABILI DI APPOGGIO
char buffer0[30];
String  app0;
int cur_day;

// ---------- FUNZIONE SETUP WIFI
void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  // ==================== WPA 2 PSK ========================
  // WiFi.begin(ssid, password);
  
  // ==================== WPA 2 Enterprise ========================
  
  WiFi.disconnect(true);  //disconnect form wifi to set new wifi connection
  WiFi.mode(WIFI_STA); //init wifi mode
  esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)username, strlen(username)); //provide identity
  esp_wifi_sta_wpa2_ent_set_username((uint8_t *)username, strlen(username)); //provide username --> identity and username is same
  esp_wifi_sta_wpa2_ent_set_password((uint8_t *)password, strlen(password)); //provide password
  esp_wpa2_config_t config = WPA2_CONFIG_INIT_DEFAULT(); //set config settings to default
  esp_wifi_sta_wpa2_ent_enable(&config); //set config settings to enable function
  // WPA2 Enterprise authentication ends here
  
  WiFi.begin(ssid); //connect to wifi 
  
  while ((WiFi.status() != WL_CONNECTED) && (wait < MINUTO )) {
    digitalWrite(LED, HIGH); // turn the LED on (HIGH is the voltage level)
    delay(500); // wait for a second
    digitalWrite(LED, LOW); // turn the LED off by making the voltage LOW
    delay(500); // wait for a second
    Serial.print(".");
    wait++;
  }
  // randomSeed(micros()); TIPO RANDOMIZE ma non so perchè..
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  } else{
    Serial.println("NON CONNESSO - MEMORIZZO IN FLASH");
  }  
}

//------------- ROUTINE DI INTERRUPT
void ap1_INT(){
  manage_INT1();
}
void ap2_INT(){
  manage_INT2();
}
void ap3_INT(){
  manage_INT3();
}
void ap4_INT(){
  manage_INT4();
}
//------------- ROUTINE DI GESTIONE DELL'INTERRUPT
void manage_INT1()
{
  char buffer1[30];
  String app1;
  
  t1_1= millis();//prendo il tempo
  Tt1=(t1_1 - t1_0);
  if (Tt1>1000){ //tolgo rumore (un impulso non può durare meno di un secondo altrimenti significa che stiamo consumando oltre 3,6KWora)
    Serial.print("\nAcquisizione da App1 :  ");    
    now1 = rtc.now();
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    dtostrf(now1.year(),4,0,buffer1);
    app1=app1+buffer1+"-";
    dtostrf(now1.month(),2,0,buffer1);
    app1=app1+buffer1+"-";
    dtostrf(now1.day(),2,0,buffer1);
    app1=app1+buffer1+"_";
    dtostrf(now1.hour(),2,0,buffer1);
    app1=app1+buffer1+":";
    dtostrf(now1.minute(),2,0,buffer1);
    app1=app1+buffer1+":";
    dtostrf(now1.second(),2,0,buffer1);
    app1=app1+buffer1;
    }
    Impulsi1[dimI1].t=app1;
    Impulsi1[dimI1].dur=Tt1;
    Serial.print(Impulsi1[dimI1].t);
    Serial.print(" | ");
    Serial.println(Impulsi1[dimI1].dur);      
    dimI1++;
    t1_0=t1_1;
  }
}    
void manage_INT2()
{
  char buffer2[30];
  String app2;
  
  t2_1= millis();//prendo il tempo
  Tt2=(t2_1 - t2_0);
  if (Tt2>1000){ //tolgo rumore (un impulso non può durare meno di un secondo altrimenti significa che stiamo consumando oltre 3,6KWora)
    Serial.print("\nAcquisizione da App2 :  ");    
    now2 = rtc.now();
    //timestamp(Impulsi2[dimI2].t);
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    dtostrf(now2.year(),4,0,buffer2);
    app2=app2+buffer2+"-";
    dtostrf(now2.month(),2,0,buffer2);
    app2=app2+buffer2+"-";
    dtostrf(now2.day(),2,0,buffer2);
    app2=app2+buffer2+"_";
    dtostrf(now2.hour(),2,0,buffer2);
    app2=app2+buffer2+":";
    dtostrf(now2.minute(),2,0,buffer2);
    app2=app2+buffer2+":";
    dtostrf(now2.second(),2,0,buffer2);
    app2=app2+buffer2;
    }
    Impulsi2[dimI2].t=app2;
    Impulsi2[dimI2].dur=Tt2;
    Serial.print(Impulsi2[dimI2].t);
    Serial.print(" | ");
    Serial.println(Impulsi2[dimI2].dur);      
    dimI2++;
    t2_0=t2_1;    
  }
}    
void manage_INT3()
{
  char buffer3[30];
  String app3;
  
  t3_1= millis();//prendo il tempo
  Tt3=(t3_1 - t3_0);
  if (Tt3>1000){ //tolgo rumore (un impulso non può durare meno di un secondo altrimenti significa che stiamo consumando oltre 3,6KWora)
    Serial.print("\nAcquisizione da App3 :  ");    
    now3 = rtc.now();
    //timestamp(Impulsi3[dimI3].t);
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    dtostrf(now3.year(),4,0,buffer3);
    app3=app3+buffer3+"-";
    dtostrf(now3.month(),2,0,buffer3);
    app3=app3+buffer3+"-";
    dtostrf(now3.day(),2,0,buffer3);
    app3=app3+buffer3+"_";
    dtostrf(now3.hour(),2,0,buffer3);
    app3=app3+buffer3+":";
    dtostrf(now3.minute(),2,0,buffer3);
    app3=app3+buffer3+":";
    dtostrf(now3.second(),2,0,buffer3);
    app3=app3+buffer3;
    }
    Impulsi3[dimI3].t=app3;
    Impulsi3[dimI3].dur=Tt3;
    Serial.print(Impulsi3[dimI3].t);
    Serial.print(" | ");
    Serial.println(Impulsi3[dimI3].dur);      
    dimI3++;
    t3_0=t3_1;
  }
}    
void manage_INT4()
{
  char buffer4[30];
  String app4;
  
  t4_1= millis();//prendo il tempo
  Tt4=(t4_1 - t4_0);
  if (Tt4>1000){ //tolgo rumore (un impulso non può durare meno di un secondo altrimenti significa che stiamo consumando oltre 3,6KWora)
    Serial.print("\nAcquisizione da App4 :  ");    
    now4 = rtc.now();
    //timestamp(Impulsi4[dimI4].t);
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    dtostrf(now4.year(),4,0,buffer4);
    app4=app4+buffer4+"-";
    dtostrf(now4.month(),2,0,buffer4);
    app4=app4+buffer4+"-";
    dtostrf(now4.day(),2,0,buffer4);
    app4=app4+buffer4+"_";
    dtostrf(now4.hour(),2,0,buffer4);
    app4=app4+buffer4+":";
    dtostrf(now4.minute(),2,0,buffer4);
    app4=app4+buffer4+":";
    dtostrf(now4.second(),2,0,buffer4);
    app4=app4+buffer4;
    }
    Impulsi4[dimI4].t=app4;
    Impulsi4[dimI4].dur=Tt4;
    Serial.print(Impulsi4[dimI4].t);
    Serial.print(" | ");
    Serial.println(Impulsi4[dimI4].dur);      
    dimI4++;
    t4_0=t4_1;
  }
}    
// ------------- LETTURA TIMESTAMP DA RTC E STAMPA A VIDEO
void timestamp(String app) {
 
  adesso = rtc.now();
/*  VALORI INTERI
  int second = now.second();
  int minute = now.minute();
  int hour = now.hour();
  int date = now.day();
  int month = now.month();
  int year = now.year();
  Serial.print(year, DEC);
  Serial.print('-');
  Serial.print(month, DEC);
  Serial.print('-');
  Serial.print(date, DEC);
  Serial.print(' ');
  Serial.print(hour, DEC);
  Serial.print(':');
  Serial.print(minute, DEC);
  Serial.print(':');
  Serial.print(second, DEC);
*/
  { //STAMPA A VIDEO DEL TIMESTAMP
  Serial.print('\n');
  dtostrf(adesso.year(),4,0,buffer0);
  app=app+buffer0+"-";
  dtostrf(adesso.month(),2,0,buffer0);
  app=app+buffer0+"-";
  dtostrf(adesso.day(),2,0,buffer0);
  app=app+buffer0+"_";
  dtostrf(adesso.hour(),2,0,buffer0);
  app=app+buffer0+":";
  dtostrf(adesso.minute(),2,0,buffer0);
  app=app+buffer0+":";
  dtostrf(adesso.second(),2,0,buffer0);
  app=app+buffer0;
  }
  Serial.print("Time da RTC: ");
  Serial.println(app);  
  Serial.print("-----");  
}

//------------------ SETUP --------------------
void setup() {
  Serial.begin(115200);
  Serial.println("INIT COMMUNICATION: ");
  Serial.println("----------------- SERIAL --------------------");
  Serial.println("------------------ WIFI ---------------------");
  setup_wifi();                   // Connect to wifi
  Serial.println("------------------ MQTT ---------------------");
  client.setServer(mqtt_server1, 1883);
  //client.setServer(mqtt_server2, 1883);
  //client.setCallback(callback);
  Serial.println("------------------- RTC --------------------");
  {
  if (! rtc.begin()) {    //NON CANCELLARE, il BEGIN VA FATTO!!
    Serial.println("Couldn't find RTC");
    //while (1);
  }
  if (! rtc.isrunning()) {    //AGGIUSTAMENTO RTC DA NTP
    Serial.println("RTC is NOT running!");
  } 
  }
  Serial.println("------------------- NTP --------------------");  //inizializzazione NTP  (TimeNTP_ESP8266WiFi.ino)
  {  
  Serial.println("Starting UDP");
  ntpUDP.begin(localPort);
  Serial.print("Local port: ");
  /* SE NTP NON VA ALLORA SETTO RTC CON ORA DI SISTEMA
   *       rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
   * ALTRIMENTI
  */ 
  // Serial.println(ntpUDP.remtePort());
  Serial.println("waiting for sync");
  setSyncProvider(getNtpTime);
  setSyncInterval(300);
  digitalClockDisplay();
  Serial.println("ORA NTP"); 
  /*  // PER SETTARE ORA MANUALE E TESTARE CHE NTP AGGIORNA RTC
  rtc.adjust(DateTime(2000, 1, 1, 0, 0, 0));
  timestamp(payload);  
  Serial.print("ORA MANUALE");
    //rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    //Serial.print("ORA DI SISTEMA");
  */
   
  rtc.adjust(DateTime(year() ,month() ,day() ,hour() ,minute() ,second() ));
  timestamp(payload);
  Serial.println("ORA RTC");  
  }
  cur_day=adesso.day();
  Serial.println("INIT HARDWARE:  \n- PIN \n- INTERRUPT ");  
  {
  pinMode(ap1_PIN, INPUT);     // Initialize the app pin as an input
  pinMode(ap2_PIN, INPUT);
  pinMode(ap3_PIN, INPUT);
  pinMode(ap4_PIN, INPUT);
  pinMode(LED, OUTPUT);

  t1_0=0;                     // inizializzo contatori impulsi a 0
  t2_0=0;
  t3_0=0;
  t4_0=0;
  
  attachInterrupt(digitalPinToInterrupt(ap1_PIN), ap1_INT, FALLING);
  attachInterrupt(digitalPinToInterrupt(ap2_PIN), ap2_INT, FALLING);
  attachInterrupt(digitalPinToInterrupt(ap3_PIN), ap3_INT, FALLING);
  attachInterrupt(digitalPinToInterrupt(ap4_PIN), ap4_INT, FALLING);
  }
  Serial.println("------------------FINESETUP--------------");
}

//------------------ LOOP --------------------
void loop() {
  Serial.println("LOOP");
  delay(60000);
  {       // COMPATTAZIONE IMPULSI1
  Serial.println("COMPATTAZIONE IMPULSI1");
  if (dimI1==0){
    now1 = rtc.now();
    Serial.println("Impulsi1 Vuoto carico!");
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    app0="";
    dtostrf(now1.year(),4,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now1.month(),2,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now1.day(),2,0,buffer0);
    app0=app0+buffer0+"_";
    dtostrf(now1.hour(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now1.minute(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now1.second(),2,0,buffer0);
    app0=app0+buffer0;
    }
    Consumi1[0].w=0;
    Consumi1[0].t=app0;
    Serial.print("\tConsumi.Watt= ");
    Serial.println(Consumi1[0].w);
    Serial.print("\tConsumi.times= ");
    Serial.println(Consumi1[0].t);
    dimC1=1;
  }else{     
    j=0;    // contatore per Consumi1
    k=1;    // occorrenze della stessa durata
    prev_millis=Impulsi1[0].dur;
    cur_ts=Impulsi1[0].t;
    { //STAMPA Impulso[0]
    Serial.print("T-D Impulso1[");
    Serial.print(j);
    Serial.print("] : ");       
    Serial.print(Impulsi1[0].t);
    Serial.print(" | ");  
    Serial.println(Impulsi1[0].dur);
    }  
    for (i=1;i<dimI1;i++){ 
      { //STAMPA Impulso[i]
      Serial.print("T-D Impulso1[");
      Serial.print(i);
      Serial.print("] : ");       
      Serial.print(Impulsi1[i].t);
      Serial.print(" | ");       
      Serial.print(Impulsi1[i].dur);
      }
      TOLL=prev_millis/100;
      Serial.print("\tTOLL= ");
      Serial.println(TOLL);
      if (Impulsi1[i].dur<prev_millis-TOLL || Impulsi1[i].dur>prev_millis+TOLL){
        Consumi1[j].t=cur_ts;
        Consumi1[j].w=3600*1000/prev_millis;
        { //STAMPA Consumo[j]
        Serial.println("--------------------------------");      
        Serial.print("\tConsumo1[");
        Serial.print(j);      
        Serial.print("].watt : ");
        Serial.println(Consumi1[j].w);
        Serial.println("--------------------------------"); 
        }      
        Consumi1[j].sent=0;
        j++;
        cur_ts=Impulsi1[i].t;
        prev_millis=Impulsi1[i].dur; 
        k=1;
        consumo=1;    
      }else{
        prev_millis=(Impulsi1[i].dur+prev_millis*k)/(k+1);
        k++;
        consumo=0;
      }
    }
    if (consumo==0){    //USCITA con consumo costante, registro utimo consumo
      Consumi1[j].t=cur_ts;
      Consumi1[j].w=3600*1000/prev_millis;
      { //STAMPA Consumo[j]
      Serial.println("--------------------------------");      
      Serial.print("\tConsumo1[");
      Serial.print(j);      
      Serial.print("].watt : ");
      Serial.println(Consumi1[j].w);
      Serial.println("--------------------------------"); 
      }      
      Consumi1[j].sent=0;
      j++;
      cur_ts=Impulsi1[i].t;
      prev_millis=Impulsi1[i].dur;  
    }
    Impulsi1[0].dur =Impulsi1[dimI1-1].dur;
    Impulsi1[0].t   =Impulsi1[dimI1-1].t;
    dimI1=1;
    dimC1=j;
  }
  }  
  {       // COMPATTAZIONE IMPULSI2
  Serial.println("COMPATTAZIONE IMPULSI2");
  if (dimI2==0){
    now2 = rtc.now();
    Serial.println("Impulsi2 Vuoto carico!");    
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    app0="";  
    dtostrf(now2.year(),4,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now2.month(),2,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now2.day(),2,0,buffer0);
    app0=app0+buffer0+"_";
    dtostrf(now2.hour(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now2.minute(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now2.second(),2,0,buffer0);
    app0=app0+buffer0;
    }
    Consumi2[0].w=0;
    Consumi2[0].t=app0;
    Serial.print("\tConsumi.Watt= ");
    Serial.println(Consumi2[0].w);
    Serial.print("\tConsumi.times= ");
    Serial.println(Consumi2[0].t);
    dimC2=1;    
  }else{      
    j=0;    // contatore per Consumi1
    k=1;    // occorrenze della stessa durata
    prev_millis=Impulsi2[0].dur;
    cur_ts=Impulsi2[0].t;
    Serial.print("T-D Impulso2[");
    Serial.print(j);
    Serial.print("] : ");       
    Serial.print(Impulsi2[0].t);
    Serial.print(" | ");  
    Serial.println(Impulsi2[0].dur);
    for (i=1;i<dimI2;i++){ 
      { //STAMPA Impulso[i]
      Serial.print("T-D Impulso2[");
      Serial.print(i);
      Serial.print("] : ");       
      Serial.print(Impulsi2[i].t);
      Serial.print(" | ");       
      Serial.print(Impulsi2[i].dur);
      }
      TOLL=prev_millis/100;
      Serial.print("\tTOLL= ");
      Serial.println(TOLL);
      if (Impulsi2[i].dur<prev_millis-TOLL || Impulsi2[i].dur>prev_millis+TOLL){
        Consumi2[j].t=cur_ts;
        Consumi2[j].w=3600*1000/prev_millis;
        Serial.println("--------------------------------");      
        Serial.print("\tConsumo2[");
        Serial.print(j);      
        Serial.print("].watt : ");
        Serial.println(Consumi2[j].w);
        Serial.println("--------------------------------");      
        Consumi2[j].sent=0;
        j++;
        cur_ts=Impulsi2[i].t;
        prev_millis=Impulsi2[i].dur; 
        k=1;
        consumo=1;    
      }else{
        prev_millis=(Impulsi2[i].dur+prev_millis*k)/(k+1);
        k++;
        consumo=0;
      }
    }
    if (consumo==0){    //USCITA con consumo costante, registro utimo consumo
      Consumi2[j].t=cur_ts;
      Consumi2[j].w=3600*1000/prev_millis;
      { //STAMPA Consumo[j]
      Serial.println("--------------------------------");      
      Serial.print("\tConsumo2[");
      Serial.print(j);      
      Serial.print("].watt : ");
      Serial.println(Consumi2[j].w);
      Serial.println("--------------------------------"); 
      }      
      Consumi2[j].sent=0;
      j++;
      cur_ts=Impulsi2[i].t;
      prev_millis=Impulsi2[i].dur;  
    }
    Impulsi2[0].dur =Impulsi2[dimI2-1].dur;
    Impulsi2[0].t   =Impulsi2[dimI2-1].t;
    dimI2=1;
    dimC2=j;
  }
  }
  {       // COMPATTAZIONE IMPULSI3
  Serial.println("COMPATTAZIONE IMPULSI3");
  if (dimI3==0){
    now3 = rtc.now();
    Serial.println("Impulsi3 Vuoto carico!");    
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    app0="";
    dtostrf(now3.year(),4,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now3.month(),2,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now3.day(),2,0,buffer0);
    app0=app0+buffer0+"_";
    dtostrf(now3.hour(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now3.minute(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now3.second(),2,0,buffer0);
    app0=app0+buffer0;
    }
    Consumi3[0].w=0;
    Consumi3[0].t=app0;
    Serial.print("\tConsumi.Watt= ");
    Serial.println(Consumi3[0].w);
    Serial.print("\tConsumi.times= ");
    Serial.println(Consumi3[0].t);
    dimC3=1;    
  }else{  
    j=0;    // contatore per Consumi1
    k=1;    // occorrenze della stessa durata
    prev_millis=Impulsi3[0].dur;
    cur_ts=Impulsi3[0].t;
    Serial.print("T-D Impulso3[");
    Serial.print(j);
    Serial.print("] : ");       
    Serial.print(Impulsi3[0].t);
    Serial.print(" | ");  
    Serial.println(Impulsi3[0].dur);
    for (i=1;i<dimI3;i++){ 
      { //STAMPA Impulso[i]
      Serial.print("T-D Impulso3[");
      Serial.print(i);
      Serial.print("] : ");       
      Serial.print(Impulsi3[i].t);
      Serial.print(" | ");       
      Serial.print(Impulsi3[i].dur);
      }
      TOLL=prev_millis/100;
      Serial.print("\tTOLL= ");
      Serial.println(TOLL);
      if (Impulsi3[i].dur<prev_millis-TOLL || Impulsi3[i].dur>prev_millis+TOLL){
        Consumi3[j].t=cur_ts;
        Consumi3[j].w=3600*1000/prev_millis;
        Serial.println("--------------------------------");      
        Serial.print("\tConsumo3[");
        Serial.print(j);      
        Serial.print("].watt : ");
        Serial.println(Consumi3[j].w);
        Serial.println("--------------------------------");       
        Consumi3[j].sent=0;
        j++;
        cur_ts=Impulsi3[i].t;
        prev_millis=Impulsi3[i].dur; 
        k=1;
        consumo=1;
      }else{
        prev_millis=(Impulsi3[i].dur+prev_millis*k)/(k+1);
        k++;
        consumo=0;
      }
    }
    if (consumo==0){    //USCITA con consumo costante, registro utimo consumo
      Consumi3[j].t=cur_ts;
      Consumi3[j].w=3600*1000/prev_millis;
      { //STAMPA Consumo[j]
      Serial.println("--------------------------------");      
      Serial.print("\tConsumo3[");
      Serial.print(j);      
      Serial.print("].watt : ");
      Serial.println(Consumi3[j].w);
      Serial.println("--------------------------------"); 
      }      
      Consumi3[j].sent=0;
      j++;
      cur_ts=Impulsi3[i].t;
      prev_millis=Impulsi3[i].dur;  
    }
    Impulsi3[0].dur =Impulsi3[dimI3-1].dur;
    Impulsi3[0].t   =Impulsi3[dimI3-1].t;
    dimI3=1;
    dimC3=j;
  }
  }  
  {       // COMPATTAZIONE IMPULSI4
  Serial.println("COMPATTAZIONE IMPULSI4");
  if (dimI4==0){
    now4 = rtc.now();
    Serial.println("Impulsi4 Vuoto carico!");    
    { // COMPONGO LA STRINGA DEL TIMESTAMP
    app0="";
    dtostrf(now4.year(),4,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now4.month(),2,0,buffer0);
    app0=app0+buffer0+"-";
    dtostrf(now4.day(),2,0,buffer0);
    app0=app0+buffer0+"_";
    dtostrf(now4.hour(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now4.minute(),2,0,buffer0);
    app0=app0+buffer0+":";
    dtostrf(now4.second(),2,0,buffer0);
    app0=app0+buffer0;
    }
    Consumi4[0].w=0;
    Consumi4[0].t=app0;
    Serial.print("\tConsumi.Watt= ");
    Serial.println(Consumi4[0].w);
    Serial.print("\tConsumi.times= ");
    Serial.println(Consumi4[0].t);
    dimC4=1;    
  }else{        
    j=0;    // contatore per Consumi1
    k=1;    // occorrenze della stessa durata
    prev_millis=Impulsi4[0].dur;
    cur_ts=Impulsi4[0].t;
    Serial.print("T-D Impulso4[");
    Serial.print(j);
    Serial.print("] : ");       
    Serial.print(Impulsi4[0].t);
    Serial.print(" | ");  
    Serial.println(Impulsi4[0].dur);
    for (i=1;i<dimI4;i++){ 
      { //STAMPA Impulso[i]
      Serial.print("T-D Impulso4[");
      Serial.print(i);
      Serial.print("] : ");       
      Serial.print(Impulsi4[i].t);
      Serial.print(" | ");       
      Serial.print(Impulsi4[i].dur);
      }
      TOLL=prev_millis/100;
      Serial.print("\tTOLL= ");
      Serial.println(TOLL);
      if (Impulsi4[i].dur<prev_millis-TOLL || Impulsi4[i].dur>prev_millis+TOLL){
        Consumi4[j].t=cur_ts;
        Consumi4[j].w=3600*1000/prev_millis;
        Serial.println("--------------------------------");      
        Serial.print("\tConsumo4[");
        Serial.print(j);      
        Serial.print("].watt : ");
        Serial.println(Consumi4[j].w);
        Serial.println("--------------------------------"); 
        Consumi4[j].sent=0;
        j++;
        cur_ts=Impulsi4[i].t;
        prev_millis=Impulsi4[i].dur; 
        k=1;
        consumo=1;  
      }else{
        prev_millis=(Impulsi4[i].dur+prev_millis*k)/(k+1);
        k++;
        consumo=0;
      }
    }
    if (consumo==0){    //USCITA con consumo costante, registro utimo consumo
      Consumi4[j].t=cur_ts;
      Consumi4[j].w=3600*1000/prev_millis;
      { //STAMPA Consumo[j]
      Serial.println("--------------------------------");      
      Serial.print("\tConsumo4[");
      Serial.print(j);      
      Serial.print("].watt : ");
      Serial.println(Consumi4[j].w);
      Serial.println("--------------------------------"); 
      }      
      Consumi4[j].sent=0;
      j++;
      cur_ts=Impulsi4[i].t;
      prev_millis=Impulsi4[i].dur;  
    }    
    Impulsi4[0].dur =Impulsi4[dimI4-1].dur;
    Impulsi4[0].t   =Impulsi4[dimI4-1].t;
    dimI4=1;
    dimC4=j;
  }
  }  
  i=0;    // PROVO LA RICONNESSIONE A MQTT per 3 VOLTE
  while ((!client.connected()) && (i<3)) {    
    Serial.println("Client disconnesso da MQTT.. provo la riconnessione :");
    //reconnect();
    delay(1000);
    client.connect(clientID);
     i++;
  }   
  if (client.connected()) {    // SE MI SONO RICOLLEGATO INVIO VETTORI
    Serial.println("MI SONO RICOLLEGATO A MQTT :");
    Serial.println("INVIO VETTORI CONSUMI1 MQTT");  
    for (i=0;i<dimC1;i++){    //INVIO VETTORI CONSUMI1 MQTT
      if (Consumi1[i].sent==0){
        dtostrf(Consumi1[i].w,4,0,buffer0);
        payload=Consumi1[i].t+"_"+buffer0;
        Serial.println(payload);      
        payload.toCharArray(buffer0,30);  
        client.publish(outTopic_Ap1, buffer0);
        Consumi1[i].sent=1;
      }
    }
    dimC1=0;
    Serial.println("INVIO VETTORI CONSUMI2 MQTT");  
    for (i=0;i<dimC2;i++){    //INVIO VETTORI CONSUMI2 MQTT
      if (Consumi2[i].sent==0){
        dtostrf(Consumi2[i].w,4,0,buffer0);
        payload=Consumi2[i].t+"_"+buffer0;
        Serial.println(payload);      
        payload.toCharArray(buffer0,30);  
        client.publish(outTopic_Ap2, buffer0);
        Consumi2[i].sent=1;
      }
    }
    dimC2=0;
    Serial.println("INVIO VETTORI CONSUMI3 MQTT");  
    for (i=0;i<dimC3;i++){    //INVIO VETTORI CONSUMI3 MQTT
      if (Consumi3[i].sent==0){
        dtostrf(Consumi3[i].w,4,0,buffer0);
        payload=Consumi3[i].t+"_"+buffer0;
        Serial.println(payload);      
        payload.toCharArray(buffer0,30);  
        client.publish(outTopic_Ap3, buffer0);
        Consumi3[i].sent=1;
      }
    }
    dimC3=0;
    Serial.println("INVIO VETTORI CONSUMI4 MQTT");  
    for (i=0;i<dimC4;i++){    //INVIO VETTORI CONSUMI4 MQTT
      if (Consumi4[i].sent==0){
        dtostrf(Consumi4[i].w,4,0,buffer0);
        payload=Consumi4[i].t+"_"+buffer0;
        Serial.println(payload);
        payload.toCharArray(buffer0,30);  
        client.publish(outTopic_Ap4, buffer0);
        Consumi4[i].sent=1;
      }
    }
    dimC4=0;
  }
  else{                         // ALTRIMENTI SCRIVO SU FLASH (da fare!!)
    Serial.println("Non riesco a ricollegarmi :");
    Serial.println("Scrivo su Flash e proverò tra un minuto");      
  }
/* ESEMPIO INVIO MQTT   
  if(mqttClient.connect(CLIENT_ID)) {
    mqttClient.publish(PUB_TOPIC1, dtostrf(T, 6, 2, msgBuffer));
    mqttClient.publish(PUB_TOPIC2, dtostrf(Bright, 6, 2, msgBuffer));
  }
*/  
  // AGGIORNAMENTO GIORNALIERO DEL RTC CON NTP SERVER
  Serial.print("Giorno salvato: ");
  Serial.println(cur_day);
  Serial.print("Giorno attuale: ");  
  Serial.println(adesso.day());
  if (cur_day!=adesso.day()) { //RISINCRONIZZO NTP UNA VOLTA AL GIORNO
    Serial.println("- NTP ----------------------");  //inizializzazione NTP  (TimeNTP_ESP8266WiFi.ino)
    Serial.println("Starting UDP");
    ntpUDP.begin(localPort);
    Serial.print("Local port: ");
    /* SE NTP NON VA ALLORA SETTO RTC CON ORA DI SISTEMA
     *       rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
     * ALTRIMENTI
    */ 
    // Serial.println(ntpUDP.remtePort());
    Serial.println("waiting for sync");
    setSyncProvider(getNtpTime);
    setSyncInterval(300);
    digitalClockDisplay();
    Serial.println("ORA NTP"); 
    /*  // PER SETTARE ORA MANUALE E TESTARE CHE NTP AGGIORNA RTC
    rtc.adjust(DateTime(2000, 1, 1, 0, 0, 0));
    timestamp(payload);  
    Serial.print("ORA MANUALE");
      //rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
      //Serial.print("ORA DI SISTEMA");
    */
    rtc.adjust(DateTime(year() ,month() ,day() ,hour() ,minute() ,second() ));
    timestamp(payload);
    Serial.println("ORA RTC");  
    cur_day=adesso.day();
  }
  Serial.println("FINELOOP");
}//------------------------- FINELOOP -----------------
