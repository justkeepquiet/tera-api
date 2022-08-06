# tera-api

API and In-game Shop implementation for the TERA Online retail server (patch 92/100) on Node.js. The API consists of four independent servers (Arbiter API, Portal API, Shop API and Admin Panel) running on different ports.

The Arbiter API intended for processing internal requests from the Arbiter Server, such as checking a token, receiving events about the character's behavior, etc. This API must be binded only on a local IP address and must not be accessed by external users!

The Portal API is a web server intended for the [Launcher](https://github.com/justkeepquiet/tera-launcher)/Shop. This API must be available from the outside (proxied by Nginx or binded on external IP) for use by server users: registration, authorization, login, update routines etc. Also, this API allows to process static elements (directory **public**).

Built-in admin panel for full control of all functionality and viewing API logs. There is also full integration with the Box Server and Steer Server (for setting permissions).

## Requirements

* [Node.js](https://nodejs.org/en/) v18.1.0
* [MySQL Server](https://dev.mysql.com/downloads/mysql/5.7.html) v5.7.38
* [TERA Retail Server](https://forum.ragezone.com/f797/) patch 92.03, 92.04 or 100.02
* [Steer Server](https://forum.ragezone.com/f797/tera-92-100-steer-server-1206086/)
* [Box Server](https://forum.ragezone.com/f797/tera-92-100-steer-server-1206086/)

## Deployment

### Basic Installation

1. Install latest node.js from [https://nodejs.org](https://nodejs.org/).
2. Copy the all tera-api files to any directory (e.g. **c:\tera-api**).
3. Execute the `npm install` command in your tera-api directory, or just run **install.bat**.
4. Import the [database files](share/db) in file names order to your MySQL server.
5. Unpack the [tera-icons.zip](share/data) archive to **tera-api\data\tera-icons** folder.
6. Copy or rename the **.env.example** file to **.env**.
7. Configure the parameters in the **.env** file.
8. Execute the `node src/app` command, or run the file **tera-api.bat** to start TERA API servers.

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

The Steer Server allows you to flexibly manage permissions to certain sections of the TERA API Admin Panel. For example, you can create a new user and connect it to user group **API_AdminPanel_Shop**. Users in this group will only have access to Shop management functions. You can also create your own function group.

### TERA Shop Integration

1. [Install and configure](https://forum.ragezone.com/f797/tera-92-100-steer-server-1206086/) the Steer Server, Box Server.
2. Go to your TERA Server **arb_gw** directory and open config **config_arb_gw.txt**.
3. Modify the patamerer `web_shop_url` value as `http://YOUR_API_HOST/tera/ShopAuth?authKey=%s`, where `YOUR_API_HOST` specify your TERA API (Portal API) host.
4. Go to your TERA Server **Bin** directory and open **DeploymentConfig.xml**.
5. Remove or comment the line like this `<Shop url="..." />`.
6. Open your **.env** and set the `API_PORTAL_SHOP_ENABLE` parameter to `true`.

TERA Shop products are configured through the TERA API Admin Panel. The creation of a Service Item in the Box System occurs automatically when a product is added (using the Platform Hub).
