const fs = require('fs');
const { simpleParser } = require('mailparser');
const EmailReplyParser = require("email-reply-parser");

const main = async () => {
  const filestream = fs.createReadStream('emails/outlook-large-text-with-pdf.eml', { encoding: 'utf-8', highWaterMark: 1000 });

  const emailContent = await new Promise((resolve, reject) => {
    let filedata = '';
    let i = 0;
    filestream.on('data', (data) => {
        filedata += data
        console.log(data)
        i++;
        console.log('Email text chunk ' + i + ' was received!!\n\n\n\n')
        if (filedata.length > 1_000_000) {
          filestream.destroy()
          return;
        }

    })

    filestream.on('error', (err) => {
      console.error(err)
      reject(err)
    })

    filestream.on('end', () => {
      console.info('Email stream ended');
      resolve(filedata);
    })
    filestream.on('close', () => {
      console.info('Email stream closed')
      resolve(filedata);
    })
  })


  const parsedEmail = await simpleParser(emailContent, { skipHtmlToText: true, skipTextToHtml: true, skipImageLinks: true })

  const email = new EmailReplyParser().read(parsedEmail.text);

  console.log(email.getVisibleText())

  fs.writeFileSync('results/outlook-large-text-with-pdf.txt', email.getVisibleText())
}


main()
