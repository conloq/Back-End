import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const required = ["DB_HOST", "DB_USERNAME", "DB_DATABASE", "JWT_SECRET_KEY", "CLOUD_NAME", "API_KEY_CLOUDINARY", "API_SECRET_KEY_CLOUDINARY"];
const example = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
assert.match(example, /^JWT_SECRET_KEY=$/m);
for (const name of required) assert.match(example, new RegExp(`^${name}=`, "m"));
for (const omitted of [["JWT_SECRET_KEY"], required]) {
    const env = { PATH: process.env.PATH, DOTENV_CONFIG_PATH: "/dev/null" };
    for (const name of required) if (!omitted.includes(name)) env[name] = "ephemeral-test-value";
    const result = spawnSync(process.execPath, ["app.js"], { cwd: new URL("..", import.meta.url), env, encoding: "utf8", timeout: 10000 });
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stderr);
    for (const name of omitted) assert.ok(result.stderr.includes(name), result.stderr);
    assert.ok(!result.stderr.includes("ephemeral-test-value"));
    assert.ok(!result.stdout.includes("Servidor iniciado"));
    console.log(`PASS boot sem ${omitted.join(", ")}: exit 1; apenas nomes, sem valores`);
}
for (const args of [["ls-files", ".env"], ["check-ignore", ".env"]]) {
    const result = spawnSync("git", args, { encoding: "utf8" });
    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), args[0] === "ls-files" ? "" : ".env");
}
console.log("PASS .env ignorado e não rastreado; exemplo com JWT vazio");
