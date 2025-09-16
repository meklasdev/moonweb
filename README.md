skinview3d

use it for show skin 

use it to desain 
https://www.figma.com/design/aiEXKnAkK9NIQ5sjuQ9bva/asd?node-id=68-2&t=Zbe4uflaihIaSkUu-4

create me this web site and for a skin render use https://www.npmjs.com/package/skinview3d 

for rednering skin data off user becose here mus be more user not one make in .json kolene maja byc wykresy pod stonie serwera czyli ile graze brali czegos na stornie formularze maja bny zrobione w traki sposob


Masz to przepisane jasno i schludnie w formie dokumentacji .md dla Discorda:

# MoonCode API – Integracja z Botem

## Flow zamówienia

1. **Pobranie oczekujących zamówień**

GET https://Mooncode.pl/API/whaitorder

- Bot pobiera listę ID zamówień oczekujących.

2. **Pobranie danych o zamówieniu**

GET https://Mooncode.pl/API/order/{id}

- Zwraca dane zamówienia w formacie JSON.  
- Bot zapisuje je w bazie.

3. **Oznaczenie zamówienia jako przeczytane**

POST https://Mooncode.pl/API/read/{id}

- Oznacza zamówienie jako odczytane.

4. **Zmiana statusu zamówienia**

POST https://Mooncode.pl/API/order/{id}/(take | denile | moreinfo)

- `take` – przyjęcie zamówienia.  
- `denile` – odrzucenie zamówienia.  
- `moreinfo` – prośba o dodatkowe informacje.  

5. **Wyświetlanie zamówień w bocie**
- Komenda `/order` pokazuje listę zamówień.  
- Lista podzielona na strony.  
- Po wybraniu konkretnego zamówienia bot wysyła akcję do API.

6. **Zakończenie zamówienia**

POST https://Mooncode.pl/API/complete/{id}/{link}/{notatka}

- `link` – link do pobrania.  
- `notatka` – opcjonalna wiadomość końcowa.

7. **Rejestracja nowego zamówienia**

POST https://Mooncode.pl/API/registerorder/{dane}

- Możliwość zarejestrowania zamówienia przez bota.  
- `{dane}` – wszystkie wymagane informacje.

---

## Widok w panelu
- W panelu/stronie widać statusy zamówień.  
- Aktualizują się po każdej akcji bota.


masz zrobic by bylo ladnie wyztko pieknie i dorob panel gracza logujac sie przez discora i autorayzacje discor i stona ma zczyytwac dane usera z dsicora kuamsz no oganij to ladnie i nie rob bazy danych maja byc .json

## Local demo — quick start

This repository includes a small Next.js demo that:

- Renders Minecraft skins using `skinview3d` in `src/components/SkinViewer.tsx`.
- Provides a demo player panel with a Discord OAuth stub at `src/app/player/page.tsx`.
- Exposes simple file-based API endpoints under `src/app/api/` that read/write JSON files in the `data/` folder.

Setup:

1. Install dependencies:

	npm install

2. Install skinview3d (if not installed):

	npm install skinview3d

3. Run the dev server:

	npm run dev

Notes and next steps:

- The Discord login in this demo is a stub. For real OAuth2 you must register an application in the Discord Developer Portal, configure CLIENT_ID and CLIENT_SECRET, and implement the Authorization Code flow on the server side.
- Data is stored as JSON files under `data/`. This is intentional (no DB) per project request, but ensure proper backups and atomic writes for production.
- The `docs/MoonCode_API.md` file contains the API flow for the Discord bot integration.

- Optional Redis sessions: the app can use Redis for session storage when `REDIS_URL` is set. `ioredis` is included in `package.json`; run `npm install` to fetch it. When `REDIS_URL` is present the app stores sessions as `session:{id}` keys with expirations.

Smoke test:

- Run `npm run smoke` to execute a small smoke test that writes and reads a session using Redis (when `REDIS_URL` is set) or the file fallback.
