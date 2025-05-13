- After Study: https://uic.ca1.qualtrics.com/jfe/form/SV_8nRwUWCMwRV2JEO
- Clone/download this project on your computer. Using Git or GitHub desktop will help syncing with regualr updates. Keep a note of the path of this folder, you will need to use this path inside the virtual hosts below.
- Install any Apache and MySQL server. (Note: For Windows please use Wampserver: https://www.wampserver.com/en/ Otherwise XAMPP is a good option that comes as a bundle and is compatible with all major OS: https://www.apachefriends.org/download.html) Install all necessary prequisites if asked. For Wampserver this will be helpful: https://wampserver.aviatechno.net/?lang=en&prerequis=afficher When you land on this page, click on "VC++ Packges" and then "All VC Redistributable Packages". Install them all.
- Create a virtual host and run it on SSL. You may use self-signed local certificates for the dev setups. Optionally, You may also configure the host to auto-redirect from HTTP to HTTPS. Example URL with SSL: https://pathwi.se Step by step guide is given below:

## **Part 1: Create a Virtual Host**

1. **Access WAMPServer Virtual Host Manager**:
   - Open your browser and navigate to `http://localhost`.
   - Click on the "Add a Virtual Host" option in the WAMPServer interface.

2. **Specify Virtual Host Details**:
   - Enter the name of the virtual host as `pathwi.se`.
   - Provide the full path to your project folder (e.g., `D:/github-desktop/pathwise`). Use the path of your project from the git clone/download
   - Click "Start the creation of the virtual host".

3. **Restart WAMPServer**:
   - Restart WAMPServer and ensure its icon turns green, indicating all services are running properly.

4. **Verify Virtual Host**:
   - Open your browser and navigate to `http://pathwi.se`. If correctly configured, your project should load.

## **Part 2: Enable SSL for HTTPS**

1. **Install OpenSSL (if required)**:
   - If OpenSSL is not already installed, download it from an official source (e.g., gnuwin32: http://gnuwin32.sourceforge.net/packages/openssl.htm) and install it using default settings.
   - Note: WAMPServer often comes with OpenSSL pre-installed.

2. **Generate Private Key and SSL Certificate**:
   - Open Command Prompt as Administrator.
   - Navigate to the directory where OpenSSL is installed (e.g., `C:\wamp64\bin\apache\apache2.x.x\bin`).
   - Run the following commands one after another:
     ```
     .\openssl genrsa -aes256 -out private.key 2048
     .\openssl rsa -in private.key -out private.key
     .\openssl req -new -x509 -nodes -sha1 -key private.key -out certificate.crt -days 36500
     ```
   - When prompted, you must specify the value for Common Name as `pathwi.se`. Other fields are optional.
   - If you see an error at the last command, find the openssl.cnf file (usually inside the `C:\wamp64\bin\apache\apache2.x.x\conf` folder) path and use that for the config like below:
     ```
     .\openssl req -new -x509 -nodes -sha1 -key private.key -out certificate.crt -days 36500 -config "C:\wamp64\bin\apache\apache2.x.x\conf\openssl.cnf"
     ```

3. **Move Key and Certificate Files**:
   - Create a folder named `key` in `C:\wamp64\bin\apache\apache2.x.x\conf`.
   - Move `private.key` and `certificate.crt` into this folder.

4. **Configure Apache for SSL**:
   - Turn on "ssl_module" from wampserver > Apache > Apache Modules. (Usuallay found in the last column of the list of modules)
   - Open the Apache configuration file (`httpd.conf`) located in `C:\wamp64\bin\apache\apache2.x.x\conf`.
   - Uncomment these lines one by one, by removing the # from the beginning of each lines, if not already:
     ```
     LoadModule ssl_module modules/mod_ssl.so
     Include conf/extra/httpd-ssl.conf
     LoadModule socache_shmcb_module modules/mod_socache_shmcb.so
     ```
   - Save and close the file.

6. **Update Virtual Host Configuration**:
   - Open `httpd-vhosts.conf` located in `C:\wamp64\bin\apache\apache2.x.x\conf\extra`.
   - Add or update your virtual host configuration for HTTPS:
     ```
         <VirtualHost *:80>
           DocumentRoot "D:/github-desktop/pathwise"
           ServerName pathwi.se
           ErrorLog "logs/pathwi.se-error.log"
           CustomLog "logs/pathwi.se-access.log" common

           RewriteEngine on
           RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
        </VirtualHost>

        <VirtualHost *:443>
           DocumentRoot "D:/github-desktop/pathwise"
           ServerName pathwi.se
           ErrorLog "logs/pathwi.se-ssl-error.log"
           CustomLog "logs/pathwi.se-ssl-access.log" common

           SSLEngine on
           SSLCertificateFile "C:/wamp64/bin/apache/apache2.4.x/conf/key/certificate.crt"
           SSLCertificateKeyFile "C:/wamp64/bin/apache/apache2.4.x/conf/key/private.key"

           <Directory "D:/github-desktop/pathwise">
              Options Indexes FollowSymLinks
              AllowOverride All
              Require all granted
           </Directory>
        </VirtualHost>
     ```
   - Save the file.

7. **Update SSL Configuration**:
   - Open `httpd-ssl.conf` located in `C:\wamp64\bin\apache\apache2.x.x\conf\extra`.
   - Add or update the following configuration for HTTPS:
     ```
         SSLCertificateFile "${SRVROOT}/conf/key/certificate.crt"
     ```
     and
      
     ```
         SSLCertificateKeyFile "${SRVROOT}/conf/key/private.key"
     ```
   - Save the file.
8. **Restart WAMPServer and install/add the certificates to the system manually**:
   - Restart WAMPServer to apply changes.
   - Right click on the certificate.crt file and install certificate to the local system

9. **Verify HTTPS Configuration**:
   - Open your browser and navigate to `https://pathwi.se`.
   - You may encounter a security warning because the certificate is self-signed; proceed and add exception or accept risk to view the site. 

## **Part 3: Prepare the Browser (Student side only)**

1. **Use 'Google Chrome' only & Allow some permissions**:
   - Open your browser and navigate to this URL: chrome://settings/content/siteDetails?site=https%3A%2F%2Fpathwi.se to "Allow" some permissions for `https://pathwi.se`or change the site settings using this tutorial: https://support.google.com/chrome/answer/114662
   - You mast add "Allow" for the following permissions if not already: 'Microphone', 'Pop-ups and redirects', 'Sound', 'Automatic downloads' and 'Insecure content' 

## **Part 4: Prepare the database (Teacher side only)**

1. **Create a database**:
   - Click on the wampserver icon from the action tray and go to PhpMyAdmin and from the dropdown menu choose the latest version one: 'PhpMyAdmin 5.x.x'. It should take you to a browser page similar to this URL: http://localhost/phpmyadmin5.x.x/
   - Default username should be 'root' and password '', if this is your first time visiting this page unless you have setup a custom login details during wampserver setup.
   - Create a database named "pathwise_prototype" by clicking on 'new' from the left sidebar. The details from this step like the database name, username and passsword should be updated on this file: validate/index.php, lines 32-35 or keep the deafult settings we have used so far and we're good.
   - Select the database name: "pathwise_prototype" from the left hand menu and then click on 'SQL' menu at the top of the page and then run the following command:
    ```
         SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
         START TRANSACTION;
         SET time_zone = "+00:00";
         
         DROP TABLE IF EXISTS `saved_responses`;
         CREATE TABLE IF NOT EXISTS `saved_responses` (
           `tiemstamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
           `pins` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
           `redactors` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
           `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
           `uid` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
           `group` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
           `article` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
         
         INSERT INTO `saved_responses` (`tiemstamp`, `pins`, `redactors`, `meta`, `uid`, `group`, `article`) VALUES
         ('2024-11-07 03:55:09', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":1815,\"left\":505,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":2799,\"left\":419,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":565,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 02:27:36', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":245,\"left\":322,\"id\":\"c1\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":565,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 02:28:17', '[{\"text\":\"I\'m a little confused, can you explain that to me? Test\",\"emotion\":\"1\",\"type\":\"1\",\"top\":245,\"left\":322,\"id\":\"c1\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":565,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 02:28:17', '[{\"text\":\"I\'m a little confused, can you explain that to me? Test\",\"emotion\":\"1\",\"type\":\"1\",\"top\":245,\"left\":322,\"id\":\"c1\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":565,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 02:49:19', '[{\"text\":\"I\'m a little confused, can you explain that to me? \",\"emotion\":\"6\",\"type\":\"1\",\"top\":245,\"left\":322,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"4\",\"type\":\"2\",\"top\":460,\"left\":276,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 10:58:37', '[{\"text\":\"I\'m a little confused, can you explain that to me? Test\",\"emotion\":\"1\",\"type\":\"1\",\"top\":841,\"left\":177,\"id\":\"c1\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 10:58:38', '[{\"text\":\"I\'m a little confused, can you explain that to me? Test\",\"emotion\":\"1\",\"type\":\"1\",\"top\":841,\"left\":177,\"id\":\"c1\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 14:17:30', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"5\",\"type\":\"1\",\"top\":457,\"left\":400,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  vesicles means?\",\"emotion\":\"8\",\"type\":\"2\",\"top\":487,\"left\":829,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"6\",\"type\":\"3\",\"top\":812,\"left\":491,\"id\":\"c3\"},{\"text\":\"How fascinating that something as simple as changing the temperature of nasal tissue can reveal so much about how viruses affect our bodies!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":1602,\"left\":840,\"id\":\"c4\"},{\"text\":\"What did the researchers want to find out about the nose and viruses?\",\"emotion\":\"7\",\"type\":\"2\",\"top\":1016,\"left\":464,\"id\":\"c5\"},{\"text\":\"I am feeling happy \",\"emotion\":\"8\",\"type\":\"0\",\"top\":119,\"left\":145,\"id\":\"c6\"},{\"text\":\"I am feeling sad\",\"emotion\":\"1\",\"type\":\"4\",\"top\":222,\"left\":181,\"id\":\"c7\"},{\"text\":\"Wow, it\'s amazing to learn how our body has built-in mechanisms to protect us from infections!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":328,\"left\":215,\"id\":\"c8\"}]', '[]', '{\"pageWidth\":1280,\"pageHeight\":587,\"editorWidth\":754.667,\"editorHeight\":2761.9,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 14:17:31', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"5\",\"type\":\"1\",\"top\":457,\"left\":400,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  vesicles means?\",\"emotion\":\"8\",\"type\":\"2\",\"top\":487,\"left\":829,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"6\",\"type\":\"3\",\"top\":812,\"left\":491,\"id\":\"c3\"},{\"text\":\"How fascinating that something as simple as changing the temperature of nasal tissue can reveal so much about how viruses affect our bodies!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":1602,\"left\":840,\"id\":\"c4\"},{\"text\":\"What did the researchers want to find out about the nose and viruses?\",\"emotion\":\"7\",\"type\":\"2\",\"top\":1016,\"left\":464,\"id\":\"c5\"},{\"text\":\"I am feeling happy \",\"emotion\":\"8\",\"type\":\"0\",\"top\":119,\"left\":145,\"id\":\"c6\"},{\"text\":\"I am feeling sad\",\"emotion\":\"1\",\"type\":\"4\",\"top\":222,\"left\":181,\"id\":\"c7\"},{\"text\":\"Wow, it\'s amazing to learn how our body has built-in mechanisms to protect us from infections!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":328,\"left\":215,\"id\":\"c8\"}]', '[]', '{\"pageWidth\":1280,\"pageHeight\":587,\"editorWidth\":754.667,\"editorHeight\":2761.9,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 14:17:31', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"5\",\"type\":\"1\",\"top\":457,\"left\":400,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  vesicles means?\",\"emotion\":\"8\",\"type\":\"2\",\"top\":487,\"left\":829,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"6\",\"type\":\"3\",\"top\":812,\"left\":491,\"id\":\"c3\"},{\"text\":\"How fascinating that something as simple as changing the temperature of nasal tissue can reveal so much about how viruses affect our bodies!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":1602,\"left\":840,\"id\":\"c4\"},{\"text\":\"What did the researchers want to find out about the nose and viruses?\",\"emotion\":\"7\",\"type\":\"2\",\"top\":1016,\"left\":464,\"id\":\"c5\"},{\"text\":\"I am feeling happy \",\"emotion\":\"8\",\"type\":\"0\",\"top\":119,\"left\":145,\"id\":\"c6\"},{\"text\":\"I am feeling sad\",\"emotion\":\"1\",\"type\":\"4\",\"top\":222,\"left\":181,\"id\":\"c7\"},{\"text\":\"Wow, it\'s amazing to learn how our body has built-in mechanisms to protect us from infections!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":328,\"left\":215,\"id\":\"c8\"}]', '[]', '{\"pageWidth\":1280,\"pageHeight\":587,\"editorWidth\":754.667,\"editorHeight\":2761.9,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-11-08 14:17:32', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"5\",\"type\":\"1\",\"top\":457,\"left\":400,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  vesicles means?\",\"emotion\":\"8\",\"type\":\"2\",\"top\":487,\"left\":829,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"6\",\"type\":\"3\",\"top\":812,\"left\":491,\"id\":\"c3\"},{\"text\":\"How fascinating that something as simple as changing the temperature of nasal tissue can reveal so much about how viruses affect our bodies!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":1602,\"left\":840,\"id\":\"c4\"},{\"text\":\"What did the researchers want to find out about the nose and viruses?\",\"emotion\":\"7\",\"type\":\"2\",\"top\":1016,\"left\":464,\"id\":\"c5\"},{\"text\":\"I am feeling happy \",\"emotion\":\"8\",\"type\":\"0\",\"top\":119,\"left\":145,\"id\":\"c6\"},{\"text\":\"I am feeling sad\",\"emotion\":\"1\",\"type\":\"4\",\"top\":222,\"left\":181,\"id\":\"c7\"},{\"text\":\"Wow, it\'s amazing to learn how our body has built-in mechanisms to protect us from infections!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":328,\"left\":215,\"id\":\"c8\"}]', '[]', '{\"pageWidth\":1280,\"pageHeight\":587,\"editorWidth\":754.667,\"editorHeight\":2761.9,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2024-12-20 16:08:18', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-3252720041221955', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 04:18:36', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 04:58:23', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 04:58:25', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 04:58:26', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 04:58:27', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:00:44', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:00:51', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:02:15', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:02:29', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:03:12', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:29:56', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:29:58', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:30:00', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:33:07', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:33:26', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:43:10', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:44:01', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-13 05:44:11', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-9550862531182333', 'group-1', 'Cold Nose Article'),
         ('2025-02-21 10:44:54', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":201,\"left\":398,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"1\",\"type\":\"3\",\"top\":2277,\"left\":486,\"id\":\"c3\"},{\"text\":\"That\'s so surpising to me!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":3190,\"left\":600,\"id\":\"c4\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-2514575945556341', 'group-1', 'Cold Nose Article'),
         ('2025-02-21 10:45:21', '[{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"2\",\"type\":\"2\",\"top\":1061,\"left\":930,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"1\",\"type\":\"3\",\"top\":2277,\"left\":486,\"id\":\"c3\"},{\"text\":\"That\'s so surpising to me!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":3190,\"left\":600,\"id\":\"c4\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"1\",\"type\":\"3\",\"top\":2582,\"left\":620,\"id\":\"c5\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-2514575945556341', 'group-1', 'Cold Nose Article'),
         ('2025-02-25 09:10:32', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":298,\"left\":420,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":438,\"left\":804,\"id\":\"c2\"},{\"text\":\"That\'s so surpising to me!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":723,\"left\":619,\"id\":\"c3\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-2706165940864145', 'group-2', 'Cold Nose Article'),
         ('2025-02-25 09:13:02', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"4\",\"type\":\"1\",\"top\":298,\"left\":420,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":438,\"left\":804,\"id\":\"c2\"},{\"text\":\"That\'s so surpising to me!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":723,\"left\":619,\"id\":\"c3\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":275,\"left\":784,\"id\":\"c4\"},{\"text\":\"I am feeling sad\",\"emotion\":\"5\",\"type\":\"4\",\"top\":325,\"left\":784,\"id\":\"c5\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-2706165940864145', 'group-2', 'Cold Nose Article'),
         ('2025-02-25 09:18:29', '[{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":438,\"left\":804,\"id\":\"c2\"},{\"text\":\"That\'s so surpising to me!\",\"emotion\":\"6\",\"type\":\"4\",\"top\":723,\"left\":619,\"id\":\"c3\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":275,\"left\":784,\"id\":\"c4\"},{\"text\":\"I am feeling sad\",\"emotion\":\"5\",\"type\":\"4\",\"top\":325,\"left\":784,\"id\":\"c5\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":648,\"editorWidth\":1394,\"editorHeight\":3946,\"title\":\"Cold Nose Article\"}', 'Windows-Firefox-2706165940864145', 'group-2', 'Cold Nose Article'),
         ('2025-02-26 07:22:29', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":2045,\"left\":448,\"id\":\"c1\"},{\"text\":\"Hoooold on. Can you tell me what  ______ means?\",\"emotion\":\"1\",\"type\":\"2\",\"top\":2302,\"left\":736,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"1\",\"type\":\"3\",\"top\":2984,\"left\":429,\"id\":\"c3\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":947,\"editorWidth\":1394,\"editorHeight\":13137,\"title\":\"Meet the Microbes and Meningitis\"}', 'Windows-Firefox-2706165940864145', 'group-1', 'Meet the Microbes and Meningitis'),
         ('2025-02-27 07:50:55', '[{\"text\":\"I\'m a little confused, can you explain that to me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":249,\"left\":528,\"id\":\"c1\"},{\"text\":\"I THINK I understood, but could you summarize what that means for me?\",\"emotion\":\"1\",\"type\":\"1\",\"top\":884,\"left\":651,\"id\":\"c2\"},{\"text\":\"Is there something in your home that works this way?\",\"emotion\":\"1\",\"type\":\"3\",\"top\":1907,\"left\":565,\"id\":\"c3\"}]', '[]', '{\"pageWidth\":1920,\"pageHeight\":593,\"editorWidth\":1394,\"editorHeight\":13137,\"title\":\"Meet the Microbes and Meningitis\"}', 'Windows-Firefox-24254267834014442', 'group-1', 'Meet the Microbes and Meningitis');
         COMMIT;
     ```

## **Part 5: Additional steps/notes**
- Update the Misty robot IP here: https://pathwi.se/set-ip.htm (Note: This step makes the robot play generated audio from "Google TTS" or "speak on the go". You may also need to configure the speech parameters to make it sound more human-like if you want to use "speak on the go" inside the assets/robot-play.js file, lines 197-203)
- Upload the audio files from "assets/audios/" to the robot. Use https://pathwi.se/tools/files.htm to upload, play or delete files from the robots. (alternatively can also be done via the robot SDK dashboard in some robots, by using the robot IP in the browser URL, under "Explore > Expression")
- Upload all the custom interaction images i.e. speaking, listening etc from the "assets/images/interactions/" to the robot using the robot default SDK dashboard (can be accessed by using the robot IP in the browser URL, under "Explore > Expression")
- Optional: Use https://pathwi.se/tools/tts.htm to genrate audios from the homeworks comments or other prompts (found is the articles.js)
- That completes the system setup with all dependencies. You may now open the teacher's side of the editor (i.e., https://pathwi.se/index-working.htm or the other virtual host URL from Step 2 if you choose so), make annotations as you see fit, and save them. The student-facing versions (https://pathwi.se/student-robot.htm & https://pathwi.se/student-computer.htm) fetch the latest data from your most recent saves.

## **Part 6: Common issues/scenarios found in the FPMS study**
- Browser Requirement: The system works on Google Chrome only (until we launch to an online server like evl VM etc)
- Roatted PDF: use "SHIFT+R" to rotate it multiple times and bring back to the default orientation
- Unclickable Comment Pins: Remove "audio-playing" class from "body" using inspect element.

## **Part 7: Things to improve**
- Listening state eyes of the robot
- Update the audio files according to the new promopts based on chnaged eye color logic
- Send the robot back to normal state after each comment

