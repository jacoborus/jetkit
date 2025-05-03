import sendMail from "./drivers/mailer-driver-file";

export interface MailerMessage {
  from?: string;
  to: string;
  subject: string;
  body: { text: string } | { html: string } | { text: string; html: string };
}

// TODO get this from the environment
const defaultEmailAddress = "admin@example.com";

export default async function (message: MailerMessage): Promise<void> {
  const messageWithDefaults = {
    ...message,
    from: message.from || defaultEmailAddress,
  };

  sendMail(messageWithDefaults)
    .then((msg) => {
      console.log(msg);
    })
    .catch((err) => {
      console.log(err);
    });
}
