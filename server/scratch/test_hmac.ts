import crypto from "node:crypto";

const CLIENT_SECRET = "test_secret";
const timestamp = Date.now().toString();
const method = "POST";
const uri = "http://localhost:3001/webhooks/hubspot";
const body = JSON.stringify([{ objectId: 123, propertyName: "email", propertyValue: "test@example.com" }]);

const sourceString = method + uri + body + timestamp;
const signature = crypto
	.createHmac("sha256", CLIENT_SECRET)
	.update(sourceString)
	.digest("base64");

console.log("Timestamp:", timestamp);
console.log("Signature (base64):", signature);

// Simulated verification
const hash = crypto
	.createHmac("sha256", CLIENT_SECRET)
	.update(sourceString)
	.digest("base64");

if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))) {
	console.log("Verification Success!");
} else {
	console.log("Verification Failed!");
}
