import { Client } from "ssh2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_FRONTEND_DIST = path.join(__dirname, "dist");
const LOCAL_BACKEND_DIR = path.resolve(__dirname, "../Xeno_Backend");

const conn = new Client();

console.log("🚀 Connecting to Hostinger via SSH...");

conn.on("ready", () => {
  console.log("✅ SSH Connection established.");

  // Check remote directories for backend
  conn.exec("ls -la /home/u785368181/domains/", (err, stream) => {
    if (err) {
      console.error("Exec error:", err);
      conn.end();
      return;
    }
    let output = "";
    stream.on("data", (d) => { output += d.toString(); });
    stream.on("close", () => {
      console.log("Domains on Hostinger:\n", output);

      conn.sftp((err, sftp) => {
        if (err) {
          console.error("SFTP error:", err);
          conn.end();
          return;
        }

        // Backend files to upload
        const BACKEND_REMOTE = "/home/u785368181/domains/snow-rat-734925.hostingersite.com";
        const backendFiles = [
          {
            local: path.join(LOCAL_BACKEND_DIR, "database/migrations/2026_09_29_000001_add_external_url_to_products_table.php"),
            remote: `${BACKEND_REMOTE}/database/migrations/2026_09_29_000001_add_external_url_to_products_table.php`
          },
          {
            local: path.join(LOCAL_BACKEND_DIR, "database/seeders/StickersSeeder.php"),
            remote: `${BACKEND_REMOTE}/database/seeders/StickersSeeder.php`
          },
          {
            local: path.join(LOCAL_BACKEND_DIR, "database/seeders/DatabaseSeeder.php"),
            remote: `${BACKEND_REMOTE}/database/seeders/DatabaseSeeder.php`
          },
          {
            local: path.join(LOCAL_BACKEND_DIR, "app/Models/Product.php"),
            remote: `${BACKEND_REMOTE}/app/Models/Product.php`
          },
          {
            local: path.join(LOCAL_BACKEND_DIR, "app/Http/Resources/ProductResource.php"),
            remote: `${BACKEND_REMOTE}/app/Http/Resources/ProductResource.php`
          },
          {
            local: path.join(LOCAL_BACKEND_DIR, "app/Http/Controllers/Api/V1/Admin/ProductAdminController.php"),
            remote: `${BACKEND_REMOTE}/app/Http/Controllers/Api/V1/Admin/ProductAdminController.php`
          }
        ];

        function uploadNextBackend(index) {
          if (index >= backendFiles.length) {
            console.log("✅ All backend files transferred!");
            runArtisanCommands();
            return;
          }

          const file = backendFiles[index];
          console.log(`Uploading ${path.basename(file.local)} -> ${file.remote}`);
          sftp.fastPut(file.local, file.remote, (err) => {
            if (err) {
              console.error(`Error uploading ${path.basename(file.local)}:`, err.message);
            }
            uploadNextBackend(index + 1);
          });
        }

        uploadNextBackend(0);

        function runArtisanCommands() {
          console.log("⚙️ Running database migration and seeders on Hostinger...");
          const cmd = `
            cd /home/u785368181/domains/snow-rat-734925.hostingersite.com
            /opt/alt/php84/usr/bin/php artisan migrate --force
            /opt/alt/php84/usr/bin/php artisan db:seed --class=StickersSeeder --force
            /opt/alt/php84/usr/bin/php artisan optimize:clear
          `;

          conn.exec(cmd, (err, stream) => {
            if (err) {
              console.error("Artisan error:", err);
              uploadFrontend();
              return;
            }

            stream.on("data", (data) => console.log("Artisan:", data.toString().trim()));
            stream.stderr.on("data", (data) => console.warn("Artisan STDERR:", data.toString().trim()));
            stream.on("close", () => {
              console.log("✅ Database migration & StickersSeeder completed successfully!");
              uploadFrontend();
            });
          });
        }

        function uploadFrontend() {
          const REMOTE_FRONTEND = "/home/u785368181/domains/xenocraft.in/public_html";
          console.log(`📁 Uploading frontend dist/ to ${REMOTE_FRONTEND}...`);

          function ensureRemoteDir(remoteDir, callback) {
            sftp.mkdir(remoteDir, () => callback());
          }

          function uploadDirectory(localDir, remoteDir, done) {
            fs.readdir(localDir, (err, files) => {
              if (err) return done(err);

              let pending = files.length;
              if (!pending) return done();

              files.forEach((file) => {
                const localFilePath = path.join(localDir, file);
                const remoteFilePath = `${remoteDir}/${file}`;

                fs.stat(localFilePath, (err, stat) => {
                  if (err) return done(err);

                  if (stat.isDirectory()) {
                    ensureRemoteDir(remoteFilePath, () => {
                      uploadDirectory(localFilePath, remoteFilePath, (err) => {
                        if (err) return done(err);
                        if (!--pending) done();
                      });
                    });
                  } else {
                    sftp.fastPut(localFilePath, remoteFilePath, (err) => {
                      if (err) console.error(`Failed ${file}:`, err.message);
                      else process.stdout.write(".");
                      if (!--pending) done();
                    });
                  }
                });
              });
            });
          }

          uploadDirectory(LOCAL_FRONTEND_DIST, REMOTE_FRONTEND, (err) => {
            if (err) {
              console.error("\n❌ Frontend upload failed:", err);
            } else {
              console.log("\n✨ Frontend & Backend successfully deployed to Hostinger!");
            }
            conn.end();
          });
        }
      });
    });
  });
}).on("error", (err) => {
  console.error("❌ SSH Connection error:", err.message);
}).connect({
  host: "92.249.46.30",
  port: 65002,
  username: "u785368181",
  password: "h9Wtwh.Gcx3k2Aa",
});
