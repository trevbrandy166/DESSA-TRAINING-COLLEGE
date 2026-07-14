// const nodemailer = require("nodemailer");

// // Create transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Send approval email
// async function sendApprovalEmail(to, name, regNumber, program) {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: to,
//     subject: "Welcome to Dessa Training College - Application Approved!",
//     html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                 <div style="background: #1e3a5f; padding: 20px; text-align: center;">
//                     <h1 style="color: #d4a017; margin: 0;">DESSA TRAINING COLLEGE</h1>
//                     <p style="color: white; margin: 5px 0;">The Path to Knowledge</p>
//                 </div>

//                 <div style="padding: 30px; background: #f8fafc;">
//                     <h2 style="color: #1e3a5f;">Congratulations, ${name}!</h2>

//                     <p>Your application for <strong>${program}</strong> has been <span style="color: green; font-weight: bold;">APPROVED</span>.</p>

//                     <div style="background: #e8f4f8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
//                         <p style="margin: 0; color: #666;">Your Registration Number:</p>
//                         <h3 style="color: #1e3a5f; margin: 10px 0; font-size: 24px;">${regNumber}</h3>
//                     </div>

//                     <h3 style="color: #1e3a5f;">Next Steps:</h3>
//                     <ol style="line-height: 1.8;">
//                         <li>Visit the Student Portal: <a href="http://localhost:3000/portal/register" style="color: #d4a017;">Create Your Account</a></li>
//                         <li>Use your registration number: <strong>${regNumber}</strong></li>
//                         <li>Set your password and access your dashboard</li>
//                         <li>Pay your fees online or visit our campus</li>
//                     </ol>

//                     <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
//                         <p style="margin: 0;"><strong>Important:</strong> Please keep your registration number safe. You will need it for all portal access.</p>
//                     </div>

//                     <p>If you have any questions, please contact us:</p>
//                     <ul style="list-style: none; padding: 0;">
//                         <li>📞 Phone: +254 768 201 415</li>
//                         <li>📧 Email: dessatrainingcollege@gmail.com</li>
//                     </ul>
//                 </div>

//                 <div style="background: #1e3a5f; padding: 20px; text-align: center; color: white;">
//                     <p style="margin: 0; font-size: 12px;"> 2026 Dessa Training College. All rights reserved.</p>
//                 </div>
//             </div>
//         `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Approval email sent to:", to);
//     return true;
//   } catch (error) {
//     console.error("Email error:", error);
//     return false;
//   }
// }

// // Send rejection email
// async function sendRejectionEmail(to, name, reason) {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: to,
//     subject: "Dessa Training College - Application Update",
//     html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                 <div style="background: #1e3a5f; padding: 20px; text-align: center;">
//                     <h1 style="color: #d4a017; margin: 0;">DESSA TRAINING COLLEGE</h1>
//                 </div>

//                 <div style="padding: 30px; background: #f8fafc;">
//                     <h2 style="color: #1e3a5f;">Hello, ${name}</h2>

//                     <p>Thank you for your interest in Dessa Training College.</p>

//                     <p>After reviewing your application, we need you to <strong>resubmit your documents</strong> for the following reason:</p>

//                     <div style="background: #fff3cd; border-left: 4px solid #d4a017; padding: 15px; margin: 20px 0;">
//                         <p style="margin: 0; color: #856404;"><strong>${reason}</strong></p>
//                     </div>

//                     <h3 style="color: #1e3a5f;">What You Need to Do:</h3>
//                     <ul style="line-height: 1.8;">
//                         <li>Review the reason above carefully</li>
//                         <li>Prepare clear, high-quality documents</li>
//                         <li>Ensure all information is visible and readable</li>
//                         <li>Resubmit through the admissions portal</li>
//                     </ul>

//                     <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
//                         <p style="margin: 0;"><strong>Need Help?</strong></p>
//                         <p style="margin: 5px 0;">Call us: +254 768 201 415</p>
//                         <p style="margin: 5px 0;">Email: dessatrainingcollege@gmail.com</p>
//                         <p style="margin: 5px 0;">Visit our campus during office hours</p>
//                     </div>

//                     <p>We look forward to receiving your updated documents!</p>
//                 </div>

//                 <div style="background: #1e3a5f; padding: 20px; text-align: center; color: white;">
//                     <p style="margin: 0; font-size: 12px;"> 2026 Dessa Training College</p>
//                 </div>
//             </div>
//         `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Rejection email sent to:", to);
//     return true;
//   } catch (error) {
//     console.error("Email error:", error);
//     return false;
//   }
// }

// module.exports = { sendApprovalEmail, sendRejectionEmail };

const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send approval email — NO PORTAL, just Reg Number + Payment instructions
async function sendApprovalEmail(to, name, regNumber, program) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: "Welcome to Dessa Training College - Application Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <h1 style="color: #d4a017; margin: 0;">DESSA TRAINING COLLEGE</h1>
          <p style="color: white; margin: 5px 0;">The Path to Knowledge</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a5f;">Congratulations, ${name}!</h2>
          
          <p>Your application for <strong>${program}</strong> has been 
          <span style="color: green; font-weight: bold;">APPROVED</span>.</p>
          
          <div style="background: #e8f4f8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #666;">Your Registration Number:</p>
            <h3 style="color: #1e3a5f; margin: 10px 0; font-size: 24px;">${regNumber}</h3>
          </div>
          
          <h3 style="color: #1e3a5f;">Next Steps:</h3>
          <ol style="line-height: 1.8;">
            <li>Pay your registration fee to secure your spot</li>
            <li>Visit our campus with your ID and payment receipt</li>
            <li>Collect your student ID and class schedule</li>
            <li>Start your classes on the announced date</li>
          </ol>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Payment Options:</strong></p>
            <p style="margin: 5px 0;">💳 M-Pesa: Paybill 400222, Account: 1137985#, Account Name: Dessa Training College</p>
            <p style="margin: 5px 0;">🏦 Bank Transfer: CooperativeBank, Acc: 01102728878001, Account Name: Dessa Training College</p>
            <p style="margin: 5px 0;">💵 Cash: Visit our campus office</p>
          </div>
          
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Important:</strong> Please keep your registration number safe. You will need it for all college correspondence.</p>
          </div>
          
          <p>If you have any questions, please contact us:</p>
          <ul style="list-style: none; padding: 0;">
            <li>📞 Phone: +254 768 201 415</li>
            <li>📧 Email: dessatrainingcollege@gmail.com</li>
            <li>📍 Location: Muranga - Kenya</li>
          </ul>
        </div>
        
        <div style="background: #1e3a5f; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 12px;">© 2026 Dessa Training College. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Approval email sent to:", to);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}

// Send rejection email — unchanged
async function sendRejectionEmail(to, name, reason) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: "Dessa Training College - Application Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <h1 style="color: #d4a017; margin: 0;">DESSA TRAINING COLLEGE</h1>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a5f;">Hello, ${name}</h2>
          
          <p>Thank you for your interest in Dessa Training College.</p>
          
          <p>After reviewing your application, we need you to <strong>resubmit your documents</strong> for the following reason:</p>
          
          <div style="background: #fff3cd; border-left: 4px solid #d4a017; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>${reason}</strong></p>
          </div>
          
          <h3 style="color: #1e3a5f;">What You Need to Do:</h3>
          <ul style="line-height: 1.8;">
            <li>Review the reason above carefully</li>
            <li>Prepare clear, high-quality documents</li>
            <li>Ensure all information is visible and readable</li>
            <li>Resubmit through the admissions portal</li>
          </ul>
          
          <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Need Help?</strong></p>
            <p style="margin: 5px 0;">Call us: +254 768 201 415</p>
            <p style="margin: 5px 0;">Email: dessatrainingcollege@gmail.com</p>
            <p style="margin: 5px 0;">Visit our campus during office hours</p>
          </div>
          
          <p>We look forward to receiving your updated documents!</p>
        </div>
        
        <div style="background: #1e3a5f; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 12px;">© 2026 Dessa Training College</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Rejection email sent to:", to);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}

// Send inquiry notification to admin (school email)
async function sendInquiryNotification(inquiryData) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: "dessatrainingcollege@gmail.com",
    subject: `New Website Inquiry from ${inquiryData.full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <h1 style="color: #d4a017; margin: 0;">DESSA TRAINING COLLEGE</h1>
          <p style="color: white; margin: 5px 0;">New Website Inquiry</p>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a5f;">New Inquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1e3a5f;">Full Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${inquiryData.full_name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1e3a5f;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${inquiryData.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1e3a5f;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${inquiryData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1e3a5f;">Program Interest:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${inquiryData.program_interest || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #1e3a5f; vertical-align: top;">Message:</td>
              <td style="padding: 10px;">${inquiryData.message || "No message provided"}</td>
            </tr>
          </table>
          <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Action Required:</strong> Contact this prospect within 24 hours.</p>
          </div>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 12px;">© 2026 Dessa Training College. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Inquiry notification sent to admin");
    return true;
  } catch (error) {
    console.error("Failed to send inquiry notification:", error);
    return false;
  }
}

// module.exports = { sendApprovalEmail, sendRejectionEmail };

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
  sendInquiryNotification,
};
