# tera-api

API and In-game Shop implementation for the TERA Online retail server on Node.js. The API consists of four independent servers (Arbiter API, Portal API, Shop API and Admin Panel) running on different ports. The API requires the retail server to be running using the **arb_gw** (ArbiterServer Gateway) process supplied with the TW localization patches.

The Arbiter API intended for processing internal requests from the Arbiter Server, such as checking a token, receiving events about the character's behavior, etc. This API must be binded only on a local IP address and must not be accessed by external users!

The Portal API is a web server intended for the [Launcher](https://github.com/justkeepquiet/tera-launcher)/TERA Shop. This API must be available from the outside (proxied by Nginx or binded on external IP) for use by server users: registration, authorization, login, update routines etc. Also, this API allows to process static elements (directory **public**).

Built-in admin panel for full control of all functionality and viewing API logs. There is also full integration with the Box Server and Steer Server (for setting permissions).

## Requirements

* [Node.js](https://nodejs.org/en/) >= v18.0.0
* [MySQL Server](https://dev.mysql.com/downloads/windows/installer/5.7.html) v5.7
* [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) >= v12.0.2000 (optional, if you need characters sync)
* [TERA Retail Server](https://forum.ragezone.com/f797/) (any patch)
* [Steer Server](https://forum.ragezone.com/f797/tera-92-100-steer-server-1206086/) v3.3.1
* [Box Server](https://forum.ragezone.com/f797/tera-92-100-steer-server-1206086/) v2.16.1 (14738)

## Deployment

### Basic Installation

1. Install latest node.js from [https://nodejs.org](https://nodejs.org/).
2. Copy the all tera-api files to any directory (e.g. **c:\tera-api**).
3. Execute the `npm install` command in your tera-api directory, or just run **install.bat**.
4. Unpack the [tera-icons.zip](share/data) archive to **data\tera-icons** folder.
5. Copy the **DataCenter_Final_XXX.dat** files from your game client to the **data\datasheets** directory.
6. Copy or rename the **.env.example** file to **.env**.
7. Configure the parameters in the **.env** file.
8. Execute the `npm run start_all` command, or run the file **start__all.bat** to start TERA API components.
9. Import the [database files](share/db) in file names order to your MySQL database of TERA API.

If you don't plan to use [tera-client-packer](https://github.com/justkeepquiet/tera-client-packer) to automatically update the client through the launcher, set parameter `API_PORTAL_CLIENT_PATCH_NO_CHECK` to `true` in your **.env** config file.

### Admin Panel

By default, the admin panel is available on all IP addresses on port 8050, like [http://127.0.0.1:8050](http://127.0.0.1:8050/). You can change this in the **.env** settings. To enter the admin panel, use login `apiadmin` and password `password`. These credentials should be used **only for tests**, and in production you need to set up integration with the Steer Server.

### Integration with Steer Server

1. [Install and configure](https://forum.ragezone.com/f797/tera-92-100-steer-server-1206086/) the Steer Server.
2. Open Steer Web admin panel.
3. Go to **Import/export** section and select **Import**.
4. Select the file [ExportSteerData_steeradmin_API.sef](share/steer) and confirm import.
5. Go to **Manage user** section and select **Add user**.
6. Create new user named like **imsadmin**.
7. Go to **Authority connect** section and select **Connect user - user group**.
8. Select your user on left and click **Add user group connection** on right section.
9. In new window select group **API_AdminPanel_Admin** and click add.
10. Open your **.env** file and set `STEER_ENABLE` parameter to `true`.

The Steer Server allows you to flexibly manage permissions to certain sections of the TERA API Admin Panel. For example, you can create a new user and connect it to user group **API_AdminPanel_Shop**. Users in this group will only have access to TERA Shop management functions. You can also create your own function group.

### TERA Shop Integration

1. [Install and configure](https://forum.ragezone.com/f797/tera-92-100-steer-server-1206086/) the Steer Server, Box Server.
2. Go to your TERA Server **arb_gw** directory and open config **config_arb_gw.txt**.
3. Modify the patamerer `web_shop_url` value as `http://YOUR_API_HOST/tera/ShopAuth?authKey=%s`, where `YOUR_API_HOST` specify your TERA API (Portal API) host.
4. Go to your TERA Server **Bin** directory and open **DeploymentConfig.xml**.
5. Remove or comment the line like this `<Shop url="..." />`.
6. Open your **.env** and set the `API_PORTAL_SHOP_ENABLE` parameter to `true`.

TERA Shop products are configured through the TERA API Admin Panel. The creation of a Service Item in the Box System occurs automatically when a product is added (using the Platform Hub).

### Additional Settings

You can further setting of SLS override, Promo codes, Chronoscrolls (Premium Items), Admin Panel and TERA Shop by editing the files in the **config** directory. To edit the configuration, copy the **\*.default.js** file as **\*.js**, for example **admin.default.js** as **admin.js**. Never edit **\*.default.js** files.

### Separate Launch

It is possible to separately launch components used by TERA API. To do this, use the `--component` parameter, in which you specify the name of the component (the parameter can be repeated multiple times to launch multiple components).

Command example: `node --expose-gc --max_old_space_size=8192 src/app --component arbiter_api`.

There are also npm scripts to run the necessary components:

Command | Comment
--- | ---
`npm run start_admin_panel` | Starts Admin Panel component.
`npm run start_arbiter_api` | Starts Arbiter API component.
`npm run start_gateway_api` | Starts Gateway API component.
`npm run start_portal_api` | Starts Portal API component.
`npm run start_all` | Starts all components.

In addition, components can be launched using pre-created bat files: **start_admin_panel.bat**, **start_arbiter_api.bat**, **start_gateway_api.bat** and **start_portal_api.bat**. To run all components use the **start__all.bat**.

## TERA Client Data (Datasheets)

The API and the TERA Shop require data of item templates, item conversions, item strings etc. The API also requires of some client datasheets placed into directory **data\datasheets**.

The loader supports direct data loading from TERA DataCenter **.dat** files, which can be placed in the **data\datasheets** directory, for example: **data\datasheets\DataCenter_Final_EUR.dat** and **data\datasheets\DataCenter_Final_RUS.dat**. After that, configure KEY, IV, padding and compression parameters in the **.env** file.

If you don't know what KEY and IV your game client's DataCenter uses, use [TeraDataTools](https://github.com/Gl0/TeraDataTools) utility ([download](https://drive.google.com/file/d/1cBvP6OCcUbHO8dgtXOnuHOhZNJ9UJ67j/view?usp=sharing)).

## Gateway API Server

The API includes one more server (Gateway API Server) designed for remote access to data managed by the API and performing certain actions, such as requesting the server online monitoring, TERA Shop balance, funding the TERA Shop balance, etc.

If you need to implement a TERA Shop balance change using your external billing site, please use this API instead of directly changing the database.

### Available endpoints

Endpoint | Method | Arguments | Description
--- | --- | --- | ---
/serverApi/GetServerInfoByServerId | GET | serverId | Request the server information of specified server ID.
/accountApi/GetAccountInfoByUserNo | GET | userNo | Request the account information of specified account ID.
/accountApi/GetAccountBanByUserNo | GET | userNo, clientIP | Request the account banned status of specified account ID and client IP.
/shopApi/GetAccountInfoByUserNo | GET | userNo | Request the TERA Shop balance of the specified account ID.
/shopApi/FundByUserNo | POST | userNo, transactionId, amount | Fund the TERA Shop balance of the specified account ID.
