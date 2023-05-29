# Tripster

## Vizija
Spletna aplikacija za organizacijo in načrtovanje potovanj, ki priporoča najboljše destinacije, letalske karte, hotele in aktivnosti glede na želje uporabnika.

### Ključne funkcionalnosti:
- Registracija in prijava: Uporabniki se morajo registrirati in prijaviti v spletno aplikacijo, da lahko prejmejo priporočila, primerjajo možnosti in rezervirajo svoje potovanje. Pri registraciji morajo vpisati svoje osebne podatke, kot so ime, priimek, e-pošta, telefonska številka in naslov. Pri prijavi morajo vpisati svoje uporabniško ime in geslo.
- Prejemanje priporočil: Popotniki lahko prejmejo priporočila za najboljše destinacije, letalske karte, hotele in aktivnosti glede na svoje želje. Pri tem lahko uporabijo spletno aplikacijo, ki uporablja različne spletne vire, kot so AirBnB, Tequila flights API itd. Spletna aplikacija lahko oceni ustreznost in privlačnost različnih možnosti ter jih razvrsti po kakovosti in ceni.
- Rezervacija potovanja: Popotniki lahko rezervirajo svoje potovanje preko spletne aplikacije. Pri tem lahko izberejo svojo najljubšo možnost za destinacijo, letalsko karto, hotel in
aktivnosti ter potrdijo svojo rezervacijo. 

## Tehnologije
|**Baza**|**Avtentikacija**|**Počelje**|**Gostovanje**|**Zaledje**|
|----|-------------|-------|----------|-------|
|<img src="slike/firestore.png" alt="Firebase firestore" width="100" height="100">|<img src="slike/auth.png" alt="Firebase auth" width="100" height="100">|<img src="slike/react.png" alt="React.js" width="100" height="100">|<img src="slike/hosting.png" alt="Firebase hosting" width="100" height="100">|<img src="slike/function.png" alt="Firebase functions" width="100" height="100"> <img src="slike/node.png" alt="Node.js" width="100" height="100">|

## Zagon

### Firebase projekt
1. Ustvarite nov Firebase projekt: [Firebase konzola](https://console.firebase.google.com/u/0/) in mu dajte ime
2. Spremenite plan iz spark v blaze (Pay as you go)
3. Usposobite naslednje Firebase funkcionalnosti:
  - Authentication: Build -> Authentication -> Get started -> Native providers: Email/Password in Additional providers: Google (kjer tudi daste Project support email)
  - Firestore: Build -> Firestore Database -> Create database -> Start in **test mode** -> Izberete lokacijo in potrdite
  - Functions: Build -> Functions -> Get started -> Potrdite
4. Registrirajte spletno apikacijo:
  - Project Overview -> Add app -> Web app in ga poimenujte -> prekopirajte vsebnost firebaseConfig za 7. točko pri naslednjem delu

### Lokalni projekt
Predhodno potrebujete že naložen [Node.js](https://nodejs.org/en/download).

1. Nalozite ali klonirajte projekt v izbrano mapo in zaženite Terminal
2. Naložite si Firebase globalno: ```$ npm install -g firebase-tools```
3. Prijavite se v vaš račun z: ```$ firebase login```
4. Zaženite: ```$ firebase init``` in uporabite **le** Firebase functions in firestore
5. Vzpostavite funkije na Firebase strežnikih z ```firebase deploy --only functions```
6. Uporabite ```$ cd .\frontend\``` in zaženite ```$ firebase init``` tokrat izberete Firebase firestore in auth
7. V mapi ./frontend/src ustvarite novo datoteko "secret-keys.js":
  - `export const firebaseKey = { sem prekopirate dobljen text iz 4. točke v prejšnem delu }`
  - `export const globalApiFlights = "http://naslov.do.vasih/funkcij/app/flights";`
  - `export const globalApiStays = "http://naslov.do.vasih/funkcij/app/stays";`
8. V mapi ./functions ustvarito novo datoteko "secret-keys.js":
  Za pridobitev API ključa je potrebna registracija pri vsakem ponudniku posebaj.
  - `module.exports.airbnbAPIkey = "";` API ključ dobite [Rapid API - AirBnB](https://rapidapi.com/3b-data-3b-data-default/api/airbnb13) 
  - `module.exports.flightsAPIkey = "";` API ključ dobite [Tequila by Kiwi.com](https://tequila.kiwi.com/portal/login) 
  - `module.exports.chatGPTAPIkey = "";` API ključ dobite [OpenAI API](https://platform.openai.com/account/api-keys)
9. Naložite Node modules s `npm install` v:
  - ./functions 
  - ./frontend
10. Zaženite react projekt s `npm start` v mapi ./frontend


## Avtorji
Primož Jurič, Vito Zupanič, Sašo Krepek
