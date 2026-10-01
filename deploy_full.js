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

  const BACKEND_REMOTE = "/home/u785368181/domains/snow-rat-734925.hostingersite.com";
  const FRONTEND_REMOTE = "/home/u785368181/domains/xenocraft.in/public_html";

  // Step 1: Check git repos or backend state
  conn.exec(`
    echo "=== PULLING REPOS ==="
    if [ -d "$HOME/repos/Xeno_Frontend" ]; then
      cd $HOME/repos/Xeno_Frontend && git pull origin main || true
    fi
    if [ -d "$HOME/repos/Xeno_Backend" ]; then
      cd $HOME/repos/Xeno_Backend && git pull origin main || true
    fi
    if [ -d "${BACKEND_REMOTE}/.git" ]; then
      cd ${BACKEND_REMOTE} && git pull origin main || true
    fi
  `, (err, stream) => {
    if (err) {
      console.warn("Git pull exec warning:", err.message);
    } else {
      stream.on("data", (d) => console.log(d.toString().trim()));
    }

    stream.on("close", () => {
      // Step 2: SFTP Sync backend files and delete obsolete seeders on remote
      conn.sftp((err, sftp) => {
        if (err) {
          console.error("SFTP error:", err);
          conn.end();
          return;
        }

        const backendFilesToSync = [
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
          },
          {
            local: path.join(LOCAL_BACKEND_DIR, "app/Http/Requests/Api/V1/Cart/UpdateCartItemRequest.php"),
            remote: `${BACKEND_REMOTE}/app/Http/Requests/Api/V1/Cart/UpdateCartItemRequest.php`
          }
        ];

        function uploadNextBackend(index) {
          if (index >= backendFilesToSync.length) {
            console.log("✅ Backend modified files synced to remote!");
            cleanupRemoteSeeders();
            return;
          }

          const file = backendFilesToSync[index];
          if (fs.existsSync(file.local)) {
            console.log(`Uploading ${path.basename(file.local)} -> ${file.remote}`);
            sftp.fastPut(file.local, file.remote, (err) => {
              if (err) console.warn(`Notice uploading ${path.basename(file.local)}:`, err.message);
              uploadNextBackend(index + 1);
            });
          } else {
            uploadNextBackend(index + 1);
          }
        }

        uploadNextBackend(0);

        function cleanupRemoteSeeders() {
          console.log("🧹 Removing obsolete seeders from remote backend...");
          const cleanupCmd = `
            rm -f ${BACKEND_REMOTE}/database/seeders/ProductCatalogSeeder.php
            rm -f ${BACKEND_REMOTE}/database/seeders/WeddingCardsSeeder.php
            rm -f ${BACKEND_REMOTE}/database/seeders/StickersSeeder.php
            cd ${BACKEND_REMOTE}
            /opt/alt/php84/usr/bin/php artisan optimize:clear
          `;

          conn.exec(cleanupCmd, (err, stream) => {
            if (err) {
              console.warn("Cleanup warning:", err);
            } else {
              stream.on("data", (d) => console.log("Artisan:", d.toString().trim()));
            }
            stream.on("close", () => {
              uploadFrontendDist();
            });
          });
        }

        function uploadFrontendDist() {
          console.log(`\n📁 Uploading compiled frontend to ${FRONTEND_REMOTE}...`);

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

          // Upload to frontend remote, and also sync products to backend remote public/products
          uploadDirectory(LOCAL_FRONTEND_DIST, FRONTEND_REMOTE, (err) => {
            if (err) {
              console.error("\n❌ Frontend upload failed:", err);
            } else {
              console.log("\n📁 Syncing product images to Backend public storage...");
              const localProductsDir = path.join(__dirname, "public/products");
              const remoteBackendProducts = `${BACKEND_REMOTE}/public/products`;
              ensureRemoteDir(remoteBackendProducts, () => {
                uploadDirectory(localProductsDir, remoteBackendProducts, (bErr) => {
                  if (bErr) console.warn("Notice syncing backend products:", bErr.message);
                  console.log("\n\n🎉 Full deployment and image update to Hostinger completed successfully!");
                  console.log("🌐 Frontend: https://xenocraft.in");
                  console.log("⚡ Backend API: https://snow-rat-734925.hostingersite.com/api/v1");
                  conn.end();
                });
              });
            }
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
