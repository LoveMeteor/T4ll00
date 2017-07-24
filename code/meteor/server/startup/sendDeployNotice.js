// function sendDeployNotice (element, index, array) {
//   var accountSID = 'AC5d7534e8c98bab6d49b3b2b60fe3cd95';
//   var authToken = '0c8b44b4f96ca08901bc4fb48f5425f8';
//   var client = Twilio(accountSID, authToken);
//     client.sendMessage({
//     to: '+1' + element, // Any number Twilio can deliver to
//     from: '+12089146732', // A number you bought from Twilio and can use for outbound communication
//     body: 'Don\'t get to excited, but a minor update has been deployed to Talloo - Talloo Engineering'
//       }, function(err, responseData) { //this function is executed when a response is received from Twilio
//             if (!err) { // "err" is an error received during the request, if any

//               // "responseData" is a JavaScript object containing data received from Twilio.
//               // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
//               // http://www.twilio.com/docs/api/rest/sending-sms#example-1

//               // console.log(responseData.from); // outputs "+14506667788"
//               // console.log(responseData.body); // outputs "word to your mother."

//             } else {
//               console.log(err);
//             }
//           });
// }


// Meteor.startup(function () {
// var numbers = ['2082498911', '2089953436'];
// numbers.forEach(sendDeployNotice);

// });


Meteor.startup(function () {
  process.env.MAIL_URL = "smtp://postmaster@app.talloo.com:6463d538e5f3c09b728345a36a54e6e2@smtp.mailgun.org:587";
});