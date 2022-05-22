# tera-api

API implementation for the TERA Online retail server (patch 92/100) on Node.js. The API consists of two independent servers running on different ports (for the needs of the [portal/launcher](https://github.com/justkeepquiet/tera-launcher), and separately for the needs of the Arbiter server).

### Requirements

* Node.js v18.1.0
* MySQL Server v5.7.38

### Installation

1. Install latest node.js from https://nodejs.org/.
2. Copy the all tera-api files to any directory (e.g. `c:\tera-api`).
3. Open windows console and go to directory (type `cd c:\tera-api`).
4. Run the `npm install` for install required node modules.
5. Copy or rename the `.env.example` file to `.env`.
6. Configure the parameters in the `.env` file.
7. Impport the [database structure](share/accountdb.sql) to your MySQL server.
8. Execute the `node src/app` command, or run the file `tera-api.bat` to start API servers.

#### Important!

The account database structure used differs from that used in the leaked retail version of the server. The supported database structure is located in the `share` folder.

### API Endpoints

#### Arbiter Server API

Method | Endpoint | Description
--- | --- | ---
GET | `/systemApi/RequestAPIServerStatusAvailable` | API status request.
POST | `/authApi/GameAuthenticationLogin` | Authorization request via Arbiter server.
GET | `/api/ServiceTest` | API and database status request.
POST | `/api/GetUserInfo` | User information event.
POST | `/api/EnterGame` | Game enter event.
POST | `/api/LeaveGame` | Game leave event.
POST | `/api/CreateChar` | Character creation event.
POST | `/api/ModifyChar` | Character modify event.
POST | `/api/DeleteChar` | Character delete event.
POST | `/api/UseChronoScroll` | VIP item usage event.
POST | `/api/report_cheater` | The event of sending a cheater report.

#### Portal/Launcher API

Method | Endpoint | Description
--- | --- | ---
GET | `/tera/ServerList?lang=%lang` | Server List request.
GET | `/tera/LauncherMaintenanceStatus` | Request server maintenance Status.
GET | `/tera/LauncherMain` | Get Launcher main HTML page.
GET | `/tera/LauncherLoginForm` | Get Launcher login HTML page (login form).
GET | `/tera/LauncherSignupForm` | Get Launcher registration HTML page (registration form).
POST | `/tera/LauncherLoginAction` | Authorization request via Launcher.
POST | `/tera/LauncherSignupAction` | Registration request via Launcher.
POST | `/tera/GetAccountInfoByUserNo` | User data request.
