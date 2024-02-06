const fs = require('fs');
const util = require('util');
const { MailParser } = require('mailparser');
const EmailReplyParser = require("email-reply-parser");

let emailParser = new MailParser({
  // skipTextLinks: true,
  skipHtmlToText: true, skipTextToHtml: true, skipImageLinks: true,
});

const main = async () => {
  const filestream = fs.createReadStream('emails/gmail-large-text-with-pdf.eml', { encoding: 'utf-8' });

  filestream.pipe(emailParser);

  const emailText = await new Promise((resolve, reject) => {
    emailParser.on('headers', headers => {
      console.log(util.inspect(headers, false, 22));
    });

    let filedata = '';
    let i = 0;
    emailParser.on('data', (data) => {
      if (data.type === 'text') {
        filedata += data.text
        console.log(data.text)
        i++;
        console.log('Email text chunk ' + i + ' was received!!\n\n\n\n')
        // if (filedata.length > 500) {
        //   filestream.destroy()
        //   return;
        // }
      }

    })

    emailParser.on('error', (err) => {
      console.error(err)
      reject(err)
    })

    emailParser.on('end', () => {
      console.info('Email stream ended');
      resolve(filedata);
    })
    emailParser.on('close', () => console.info('Email stream closed'))
  })

  // const parsedEmail = await new Promise((resolve, reject) => {
  //   fs.readFile('emails/gmail-large-text.eml', 'utf-8', (err, data) => {
  //     if (err) reject(err);
  //     simpleParser(data, { skipTextLinks: true, skipHtmlToText: true }, (err, parsedEmail) => {
  //       if (err) reject(err);
  //       resolve(parsedEmail);
  //     })
  //   })
  // })

  // const email = new EmailReplyParser().read(parsedEmail.text);

  console.log(emailText)
  const email = new EmailReplyParser().read(emailText);

  console.log(emailText)

  fs.writeFileSync('results/gmail-large-text-with-pdf.txt', email.getVisibleText())

}


main()
