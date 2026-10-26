// its not rlly worth my time to se this all up myself so this is ai lol
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const { promisify } = require("node:util");

const bundlePath = path.join(__dirname, "main.bundle.js");
const baseUrl = "https://app-polytrack.kodub.com/0.6.3/tracks";
const concurrency = 8;

const lines = fs.readFileSync(bundlePath, "utf8").split(/\r?\n/);
const tracks = [];

for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/^\s*id:\s*"([a-f0-9]{64})",/);
    if (!idMatch) continue;

    const block = lines.slice(i, i + 12).join("\n");
    const nameMatch = block.match(/name:\s*"((?:\\.|[^"\\])*)"/);
    const urlMatch = block.match(/trackUrl:\s*"([^"]+\.track)"/);

    if (!nameMatch || !urlMatch) continue;

    const downloadUrl = urlMatch[1];

    if (!/^tracks\/(official|community)\/[^/]+\.track$/.test(downloadUrl)) {
        throw new Error(
            `Unexpected track URL for ${idMatch[1]}: ${downloadUrl}`
        );
    }

    // The base URL already ends in /tracks, so remove that
    // prefix from the relative URL before joining.
    const relativePath = downloadUrl.replace(/^tracks\//, "");

    tracks.push({
        id: idMatch[1],
        name: JSON.parse(`"${nameMatch[1]}"`),
        downloadUrl,
        url: `${baseUrl}/${relativePath}`,
        saveLocation: path.join(__dirname, downloadUrl)
    });
}

if (tracks.length === 0) {
    throw new Error(`No bundled tracks found in ${bundlePath}`);
}

function downloadFile(url, destination, redirects = 5) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            if (
                [301, 302, 303, 307, 308].includes(response.statusCode) &&
                response.headers.location
            ) {
                response.resume();

                if (redirects <= 0) {
                    return reject(new Error("Too many redirects"));
                }

                const nextUrl = new URL(response.headers.location, url);
                return resolve(
                    downloadFile(nextUrl.href, destination, redirects - 1)
                );
            }

            if (response.statusCode !== 200) {
                response.resume();
                return reject(
                    new Error(`HTTP ${response.statusCode}: ${url}`)
                );
            }

            fs.mkdirSync(path.dirname(destination), {
                recursive: true
            });

            const tempPath = `${destination}.part`;
            const output = fs.createWriteStream(tempPath);

            response.pipe(output);

            output.on("finish", () => {
                output.close(err => {
                    if (err) return reject(err);

                    fs.rename(tempPath, destination, err => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });

            output.on("error", err => {
                response.destroy();
                fs.rm(tempPath, { force: true }, () => reject(err));
            });

            response.on("error", err => {
                output.destroy();
                fs.rm(tempPath, { force: true }, () => reject(err));
            });
        }).on("error", reject);
    });
}

async function main() {
    let next = 0;
    let completed = 0;
    let failed = 0;

    console.log(`Found ${tracks.length} tracks.`);
    console.log(`Downloading from ${baseUrl}\n`);

    async function worker() {
        while (true) {
            const index = next++;
            if (index >= tracks.length) return;

            const track = tracks[index];

            try {
                await downloadFile(track.url, track.saveLocation);
                completed++;

                console.log(
                    `[${completed + failed}/${tracks.length}] Downloaded: ${track.name}`
                );
            } catch (err) {
                failed++;
                console.error(
                    `Failed: ${track.name} (${track.url})\n  ${err.message}`
                );
            }
        }
    }

    await Promise.all(
        Array.from(
            { length: Math.min(concurrency, tracks.length) },
            () => worker()
        )
    );

    console.log(`\nFinished. Success: ${completed}, Failed: ${failed}`);

    fs.writeFileSync(
        path.join(__dirname, "tracks-manifest.json"),
        JSON.stringify(tracks, null, 2)
    );

    if (failed > 0) process.exitCode = 1;
}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
