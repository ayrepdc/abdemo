const AWS = require('aws-sdk'); 

AWS.config.update({region: 'us-east-1'});

const htmlTemplate = (data) => {
  console.log("Inside mailer.js");
  return `
    <h1>This is the Resillience output</h1>
    <p><strong>Selected Options:</strong> ${data.details}</p> 
    <img src=${data.result_image}></img>
    ${alert("Email sent successfully")}
    `;
};

module.exports.sendMail = (sender, receivers, data) => {

  console.log("Inside SendMail Mailer -> ",sender );
  
  const params = {
    Destination: {
      ToAddresses: receivers
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Resillience Scale Result'
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlTemplate(data)
        }
      }
    },
    Source: sender,
  };

  const sendPromise = new AWS.SES().sendEmail(params).promise();

  return sendPromise
    .then((data) => data)
    .catch((err) => {
      throw new Error(err);
    });
};