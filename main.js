const rp = require("request-promise");

function jsonOrString(str) {
  let json = null;
  try {
    json = JSON.parse(str);
  } catch {
    json = str;
  }

  return json;
}

function stringArrayFromInput(input) {
  if (!input) {
    return null;
  }

  if (Array.isArray(input)) {
    return input.map((e) => {
      return `${e}`;
    });
  } else {
    return [`${input}`];
  }
}

function checkParam(param, name) {
  if (!param) {
    console.log(`ERROR: ${name} has to be set.`);
    process.exit(1);
  }
}

const names = stringArrayFromInput(jsonOrString(process.env.INPUT_NAME));
const tags = stringArrayFromInput(jsonOrString(process.env.INPUT_TAG));

const keelWebhookUrl = process.env.INPUT_KEEL_WEBHOOK_URL;
const keelWebhookUsername = process.env.INPUT_KEEL_WEBHOOK_AUTH_USERNAME;
const keelWebhookPassword = process.env.INPUT_KEEL_WEBHOOK_AUTH_PASSWORD;

// Check required params
checkParam(names, "name");
checkParam(keelWebhookUrl, "keel_webhook_url");

async function main() {
  for (let name of names) {
    let repo = name.replace("https://", "").replace("http://", "");
    let repoArray = repo.split(":");

    let includedTag = null;
    if (repoArray.length > 1) {
      includedTag = repoArray[repoArray.length - 1];

      repoArray = repoArray.slice(0, -1);
    }
    repo = repoArray.join(":");

    const imageTags = tags ?? [];
    if (includedTag) {
      imageTags.push(includedTag);
    }

    // Call the webhook for repo plus all tags
    for (let tag of imageTags) {
      const options = {
        method: "POST",
        uri: keelWebhookUrl,
        body: JSON.stringify({
          name: repo,
          tag: tag,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (keelWebhookUsername && keelWebhookPassword) {
        options.auth = {
          user: keelWebhookUsername,
          pass: keelWebhookPassword,
        };
      }

      await rp(options)
        .then(function (res) {
          console.log(`Notified the server about ${repo}:${tag}`);
        })
        .catch(function (err) {
          console.log("ERROR: While sending a webhook to Keel.");
          console.log(err);
          process.exit(1);
        });
    }
  }
}

main();
