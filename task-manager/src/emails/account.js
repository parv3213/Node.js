const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const myEmail = "parv3213@gmail.com";

const sendWelcomeMail = (email, name) => {
	try {
		sgMail.send({
			to: email,
			from: myEmail,
			subject: "Thanks for joining in!",
			text: `Welcome to the app, ${name}. Let me know how you got along with the app.`,
		});
	} catch (e) {
		throw new Error("Some problem with email");
	}
};

const sendFeedbackMail = (email, name) => {
	try {
		sgMail.send({
			to: email,
			from: myEmail,
			subject: "Sad to see you go 😔",
			text: `We are sad to see you go, ${name}. We can deleted your account. Please provide us a feedback about our service`,
		});
	} catch (e) {
		throw new Error("Some problem with email");
	}
};

module.exports = {
	sendWelcomeMail,
	sendFeedbackMail,
};
