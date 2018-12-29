const nodemailer = require("nodemailer");
// const smtpTransport = require("nodemailer-smtp-transport");

const myMail = "welcometomyshop2018@gmail.com";

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth:{
		user: myMail,
		pass: "******"
	}
});


module.exports = {
	sendSignupConfirmedMail: (newUser) => {
		console.log("-----");
		console.log(newUser);
		console.log("-----");
		const options = {
			from: myMail,
			to: "a98703003@gmail.com",
			cc: "",
			subject: "Please confirm your acoount.",
			text: "Welcome to MyShop.",
			html: "<a href=\"http://localhost:3000/\">Confirm your account.</a>"
		};

		transporter.sendMail(options, (err, info) => {
			if(err){
				console.log(err);
			}
			else{
				console.log("Send Mail to " + info.response);
			}
		});
	},
	sendResetPassword: (userEmail, myToken) => {
		console.log("-----");
		console.log(myMail);
		console.log("-----");
		const options = {
			from: myMail,
			to: "a98703003@gmail.com",
			cc: "",
			subject: "Please reset your password.",
			text: "Welcome to MyShop.",
			html: `<a href="http://localhost:3000/reset/${myToken}">Change your password.</a>`
		};

		transporter.sendMail(options, (err, info) => {
			if(err){
				console.log(err);
			}
			else{
				console.log("Send Mail to " + info.response);
			}
		});
	}
};