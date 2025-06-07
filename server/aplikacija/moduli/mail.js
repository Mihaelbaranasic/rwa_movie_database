const nodemailer = require("nodemailer");

let mailer = nodemailer.createTransport({
    host: 'mail.foi.hr',
    port: 456,  
    secure: false,
    requireTLS: true,
    // auth: {
    //     user: "user",
    //     pass: "pass"
    // },
    tls: {
        rejectUnauthorized: false
    }
});

exports.posaljiMail = async function (salje, prima, predmet, poruka) {
    const message = {
        from: salje,
        to: prima,
        subject: predmet,
        text: poruka,
    };

    try {
        let odgovor = await mailer.sendMail(message);
        console.log("Poruka uspješno poslana:", odgovor);
        return odgovor;
    } catch (error) {
        console.error("Greška prilikom slanja e-pošte:", error);
        throw error;
    }
};
