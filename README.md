# tera-api

API implementation for the TERA Online retail server (patch 92) on Node.js. The API consists of two independent servers running on different ports (for the needs of the portal/launcher, and separately for the needs of the Arbiter server).

### Installation

1. Copy the files to the your directory.
2. Run the `npm install` command.
3. Copy the `.env.example` file to `.env`.
4. Configure the parameters in the `.env` file.
5. Execute the `node index` command, or run the file `tera-api.bat`.

#### Important!

The account database structure used differs from that used in the leaked retail version of the server. The supported database structure is located in the `share` folder.

### Requirements

* Node.js v18.1.0
* MySQL Server v5.7.38
* Microsoft SQL Server 2014 v12.0.2000.8 (not needed yet)

### API Architecture

#### Arbiter Server API

Method | Endpoint | Description
--- | --- | ---
GET | `/systemApi/RequestAPIServerStatusAvailable` | API status request
POST | `/authApi/GameAuthenticationLogin` | Authorization request via Arbiter server
GET | `/api/ServiceTest` | API and database status request
POST | `/api/GetUserInfo` | User information event
POST | `/api/EnterGame` | Game enter event
POST | `/api/LeaveGame` | Game leave event
POST | `/api/CreateChar` | Character creation event
POST | `/api/ModifyChar` | Character modify event (not used)
POST | `/api/DeleteChar` | Character delete event
POST | `/api/UseChronoScroll` | VIP item usage event (not implemented yet)
POST | `/api/report_cheater` | The event of sending a cheater report

#### Portal/Launcher API

Method | Endpoint | Description
--- | --- | ---
GET | `/tera/ServerList?lang=%lang` | Server List request
POST | `/tera/LauncherLoginAction` | Authorization request via Launcher
POST | `/tera/GetAccountInfoByUserNo` | User data request
