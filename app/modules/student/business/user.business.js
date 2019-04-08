const { msg } = require("../../../config/messages"),
{ Student } = require("../models/user.model"),
{ pickRegistrationResponse } = require("../../../helpers/pickResponse.helper"),
{ VerificationCode } = require("../models/verificationCode.model");

//xxxx xxxx xxx xxxx xxx xxx
const registration = async(req,res)=>{
  req.body.active = false;
  let body = req.body;
  let userExist = await Student.findOne({email:body.email});
  if(userExist && userExist.active) throw msg.duplicateEmail;
  else if(userExist && !userExist.active) throw msg.duplicateUnverifiedEmail;
  let stud = new Student(body);
  let response = await stud.save();
  // sendMail(req, res, response.id);
  if(response){
    return {
    result  : pickRegistrationResponse(response),
    status  : 200,
    message : msg.userRegistered
  };
};}
//xxxx xxxx xxx xxxx xxx xxx
sendMail = async (req, res, id) => {
    rand = Math.floor(Math.random() * 10000 + 4);
    var data = {
      code: `${rand}_${id}`,
      user: id
    };
    var verification = new VerificationCode(data);
    let response = await verification.save();
    host = req.get("host");
    link = `http://${req.get("host")}/api/user/verify?id=${rand}_${id}`;
    mailOptions = {
      to: req.body.email,
      from: "komal.b@parangat.com",
      subject: "Please confirm your Email account",
      html: `<h2>${rand}_${id}</h2><h3>Please Click on the link to verify your email.<br><a href=${link}>Click here to verify</a></h3>`
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }
    });
  };
//xxxx xxxx xxx xxxx xxx xxx




module.exports = {
  registration
  // login,
  // verify
}

