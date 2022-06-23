const axios = require("axios");
const crypto = require("crypto");
const core = require("@actions/core");
const hmacSecret = core.getInput("hmacSecret");

if (!hmacSecret || hmacSecret === "" || hmacSecret.trim() === "") {
  core.setFailed(
    "The hmac secret seems empty. This doesn't seem like what you want."
  );
  return;
}
if (hmacSecret.length < 32) {
  core.setFailed(
    "The hmac secret seems week. You should use at least 32 secure random hex chars."
  );
  return;
}

const createHmacSignature = (body, sha = "sha256") => {
  const hmac = crypto.createHmac(sha, hmacSecret);
  if (body === "") {
    return sha + "=" + hmac.digest("hex");
  } else {
    return sha + "=" + hmac.update(JSON.stringify(body)).digest("hex");
  }
};

function isJsonString(str) {
  try {
    const json = JSON.parse(str);
    return typeof json === "object";
  } catch (e) {
    return false;
  }
}

const url = core.getInput("url");
const timeout = parseInt(core.getInput("timeout"));
const dataInput = core.getInput("data");
const data = isJsonString(dataInput) ? JSON.parse(dataInput) : dataInput;
const signature_sha1 = createHmacSignature(data, "sha1");
const signature_sha256 = createHmacSignature(data, "sha256");

axios
  .post(url, data, {
    timeout: timeout,
    headers: {
      "X-Hub-Signature": signature_sha1,
      "X-Hub-Signature-256": signature_sha256,
      "X-Hub-SHA": process.env.GITHUB_SHA,
    },
  })
  .then(() => {
    core.info(`Webhook sent sucessfully`);
  })
  .catch((error) => {
    if (error.response == undefined || error.response.status == undefined)
      core.setFailed(error);
    else
      core.setFailed(
        `Request failed with status code ${error.response.status}`
      );
  });
