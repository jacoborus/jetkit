import { MailerMessage } from "../mailer-service";
import fs from "node:fs";

const folder = ".mails/";

export default async function sendMail(msg: MailerMessage) {
  const json = JSON.stringify(msg, null, 2);
  const datetime = new Date().toISOString().replace(/:/g, "-");

  return new Promise((resolve, reject) => {
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFile(folder + datetime + ".json", json, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("File is written successfully!");
      }
    });
  });
}
