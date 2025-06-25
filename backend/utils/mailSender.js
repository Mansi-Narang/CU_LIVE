const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAILER_KEY);

async function mailSender({ receiverMail, subject, textContent, htmlContent, attachments }) {

  const msg = {
    to: receiverMail, // Change to your recipient
    from: process.env.SENDER_MAIL, // Change to your verified sender
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  if(attachments) {
    msg.attachments = attachments;
  }
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = mailSender;
