const fs = require('fs');
const { simpleParser } = require('mailparser');
const EmailReplyParser = require("email-reply-parser");

const main = async () => {
  const filestream = fs.createReadStream('emails/gmail-large-text-with-pdf.eml', { encoding: 'utf-8', highWaterMark: 1000 });
  const parsedEmail = await simpleParser(filestream, { skipHtmlToText: true, skipTextToHtml: true, skipImageLinks: true })

  const email = new EmailReplyParser().read(parsedEmail.text);

  console.log(email.getVisibleText())

  fs.writeFileSync('results/gmail-large-text-with-pdf.txt', email.getVisibleText())
}


main()
