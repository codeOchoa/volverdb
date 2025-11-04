## 🛠 Instalación y configuración

1. Instalar librerías y dependencias

   ```sh
   npm install
   ```

2. Descarga el instalador desde aqui https://dev.mysql.com/downloads/installer/

   a. MySQL Installer for Windows (Community) — el más liviano es el de ~2.5 MB (web installer)

   b. Durante la instalación, seleccioná MySQL Server y MySQL Workbench.

3. Durante el asistente:

   a. Setup Type: “Developer Default”.

   b. Authentication Method: “Use Strong Password Encryption”.

   c. Root Password: elegí una clave segura.

   d. Windows Service:

      ✅ “Configure MySQL Server as a Windows Service”.

      ✅ “Start MySQL Server at System Startup”.

6. Abrir el MySQL Workbench e iniciar la "MySQL Connections" ya creada

   a. Selecciona la opcion "Server", luego "Data Import" y carga el archivo "/public/Dump20251104.sql"

5. Iniciar el servidor de desarrollo

   ```sh
   npm run dev
   ```

6. En otra ventana ejecuta este script para crear el usuario
   ```sh
   node scripts/createAdmin.js
   ```

## 🚀 Construyendo y ejecutando para producción

1. Generar una compilación de producción estática completa

   ```sh
   npm run build
   ```

2. Obtenga una vista previa del sitio tal como aparecerá una vez implementado

   ```sh
   npm run start
   ```