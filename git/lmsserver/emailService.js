// Import nodemailer
const nodemailer = require('nodemailer');
const bccMail = process.env.BCC_MAIL;
const sendMailer = process.env.MAILER_USER;
const MailerPassword = process.env.MAILER_PASSWORD;
// Create a transporter using your email service details
const logger = require('./config/winston');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: sendMailer,
        pass: MailerPassword
    }
});

// Function to send confirmation email
async function sendUserCreationEmail(data) {
    try {
        return new Promise((resolve, reject) => {
            //console.log(data)
            const mailOptions = {
                from: sendMailer,
                to: data.eMail,
                bcc: bccMail,
                subject: 'LMS Details',
                html: `
                <html>
                    <table style="text-align:left;height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse">
                        <tbody>
                            <table>
                                <tr>
                                    <td>
                                        <span style="color:#1e2d7d;font-weight:bold">
                                            Dear ${data.fullName},
                                        </span> 
                                        <p>I am writing to inform you that we have successfully registered mail for our office.<br/>
                                        The details of the registered mail are as follows:</p>                                                                                           
                                        <p>EMail : ${data.eMail}<br/>
                                        Password : ${data.password}</p>
                                        <p>Please let me know if you require any further information or assistance regarding this matter.</p>  
                                        <p>Best Regards,<br/>                                                                                   
                                        Mavensoft Systems.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </tbody>
                    </table>
                </html>
                `
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject({ error: error.message })
                } else {
                    resolve({ message: info.response })
                }
            });
        })
    } catch (e) {
        logger.error("Error in catch block of sendUserCreationEmail", e)
    }
}


// Export the functions to make them accessible from other modules
module.exports = { sendUserCreationEmail };
