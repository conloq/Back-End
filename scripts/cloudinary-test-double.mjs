// Teste HTTP local: substitui somente o provedor externo, nunca use no deploy.
import assert from "node:assert/strict";
import cloudinary from "../config/cloudinary.js";
assert.equal(process.env.NODE_ENV,"test");
assert.equal(process.env.CLOUD_NAME,"test-only");
cloudinary.uploader.upload_stream = (options, callback) => ({ end(buffer) {
    assert.ok(buffer.length > 0);
    callback(null, { secure_url: "https://example.test/profile.png" });
} });
