const cors = require('cors');
const express = require("express");
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(bodyParser());
app.use(morgan());

let usernames = '';
let userProfiles = '';
let usernameList = [];

request('https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json', { json: true }, (err, res, body) => {
  userProfiles = body;
})

request('https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json', { json: true }, (err, res, body) => {
  usernames = body;
  usernames.map(user => {
    usernameList.push(user.username);
  })
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/sendlettertoSanta", (req, res) => {

  const username = req.body.username;
  const wish = req.body.wish;
  let birthdate = '';
  let age = '';
  let message = '';
  let uid = '';
  let data = '';


  const getAge = () => {
    usernames.map(user => {
      uid = user.uid;
      if (user.username === username) {
        userProfiles.map(profile => {
          if (profile.userUid === uid) {
            birthdate = profile.birthdate.substring(8, 10) + '/' + profile.birthdate.substring(5, 7) + '/' + profile.birthdate.substring(0, 4);
            let d = new Date();
            const dateNow = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
            age = Math.ceil((Math.abs(new Date(dateNow) - new Date(birthdate)) / (1000 * 60 * 60 * 24) / 30) / 12);
            return age;
          }
        })
      }
    })
  }

  if (!usernameList.includes(username)) {
    message = 'Sorry your username is not yet registered';
  } else {
    getAge();
    const isBelowTen = age < 10;

    if (!isBelowTen) {
      message = 'Sorry, this is only for below ten year old.';
    } else {
      message = 'Wish granted. Enjoy ho ho ho...';
    }
  }

  data = { username: username, birthdate: birthdate, age: age, wish: wish, message: message };
  return res.json({ data: data });

});

app.post("/replyLetter", (req, res) => {
  sendEmail();
  
});

sendEmail = () => {
  setInterval(mapUsernames, 15 * 1000);
}
mapUsernames = () => {
  usernames.map(user => {
    userProfiles.map(profile => {
      const isUidMatch = profile.userUid === user.uid;
      if (isUidMatch) {
        return emailTemplate(user.username, profile.address);
      }
    })
  })
}

emailTemplate = (username, address) => {

  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'vicente.beer@ethereal.email',
        pass: 'PtMUBdxyq9qUSU5yhZ'
      }
    });

    // Message object
    let message = {
      from: 'do_not_reply@northpole.com',
      to: 'santa@northpole.com',
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Username: ' + username + '\nAddress: ' + address,
      html: '<p><b>Hello</b> ' + username + '!</p> ' + address
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }
      return message;

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));