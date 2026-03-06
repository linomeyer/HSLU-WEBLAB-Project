# WEBLAB Technologie Radar

## Lokale Installation und Start

### Voraussetzungen

- Node.js (Version 24.x.x verwendet) und npm installiert
- Docker installiert

### Schritt-für-Schritt Anleitung

1. **Umgebungsvariablen konfigurieren**
   ```bash
   # Im server-Verzeichnis
   cd server
   cp .env.template .env
   ```
   > Das `.env.template` kann 1:1 verwendet werden.

2. **Abhängigkeiten installieren**

   ```bash
   # Im client-Verzeichnis
   cd client
   npm install
   
   # Im server-Verzeichnis
   cd ../server
   npm install
   ```

3. **Datenbank starten**

   ```bash
   # Im server-Verzeichnis
   docker compose up -d
   ```

   > Beim ersten Start wird automatisch ein Starter-Dataset in die MongoDB geladen.

4. **Applikationen starten**

   ```bash
   # Server starten (im server-Verzeichnis)
   cd server
   npm run start
   
   # Client starten (im client-Verzeichnis)
   cd client
   npm run start
   ```

5. **Applikation aufrufen**

    - **Tech Radar:** http://localhost:4200
    - **Swagger UI (API-Dokumentation):** http://localhost:3000/api

### Credentials

- **Admin-Benutzer (CTO / Tech Lead)**
    - E-Mail: `admin@hslu.ch`
    - Passwort: `Admin1234`

- **Mitarbeiter-Benutzer**
    - E-Mail: `employee@hslu.ch`
    - Passwort: `Employee1234`
