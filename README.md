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

- Create a database named "pathwise_prototype" with a username of 'root' and password ''. A copy of these details can be found in validate/index.php, lines 32-35. (Please reach out to Anis for a demo database that can be imported and has some dummy data ready.)
- Update the Misty robot IP here: https://pathwi.se/robot-ip.htm (Note: This step makes the robot play generated audio from Google TTS or speak on the go. You may also need to configure the speech parameters to make it sound more human-like if you want to use "speak on the go" inside the assets/robot-play.js file, lines 197-203)
- That completes the system setup with all dependencies. You may now open the teacher's side of the editor (i.e., https://pathwi.se/index-working.htm or the other virtual host URL from Step 2 if you choose so), make annotations as you see fit, and save them. The student-facing versions (https://pathwi.se/student-robot.htm & https://pathwi.se/student-computer.htm) fetch the latest data from your most recent saves.
