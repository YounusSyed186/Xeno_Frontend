import { Client } from "ssh2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DIST = path.join(__dirname, "dist");
const REMOTE_PATH = "/home/u785368181/domains/xenocraft.in/public_html";

if (!fs.existsSync(LOCAL_DIST)) {
  console.error("Local dist/ folder does not exist! Please run npm run build first.");
  process.exit(1);
}

const conn = new Client();

console.log("🚀 Connecting to Hostinger via SSH...");

conn.on("ready", () => {
  console.log("✅ SSH Connection established.");

  // Step 1: Update remote git repo
  console.log("📦 Pulling latest changes in ~/repos/Xeno_Frontend...");
  conn.exec("cd ~/repos/Xeno_Frontend && git pull origin main", (err, stream) => {
    if (err) {
      console.warn("⚠️ Git pull error:", err.message);
    } else {
      stream.on("data", (data) => console.log("Git:", data.toString().trim()));
    }

    // Step 2: Open SFTP and upload dist/
    conn.sftp((err, sftp) => {
      if (err) {
        console.error("SFTP Error:", err);
        conn.end();
        return;
      }

      console.log("📁 Uploading built production bundle to", REMOTE_PATH);

      function ensureRemoteDir(remoteDir, callback) {
        sftp.mkdir(remoteDir, (err) => {
          // Ignore if directory already exists
          callback();
        });
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
                  if (err) {
                    console.error(`Failed to upload ${file}:`, err.message);
                  } else {
                    process.stdout.write(`.` );
                  }
                  if (!--pending) done();
                });
              }
            });
          });
        });
      }

      uploadDirectory(LOCAL_DIST, REMOTE_PATH, (err) => {
        if (err) {
          console.error("\n❌ Upload failed:", err);
        } else {
          console.log("\n✨ All production files uploaded successfully to Hostinger!");
        }
        conn.end();
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
