export const emailTemplates = {
  newTicketEmail: (purchaser, code, purchase_datetime, ammount) => `
    <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <title>Order Confirmation</title>
      </head>
      <body>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
      <td align="center" bgcolor="#f7f7f7">
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse: collapse;">
      <tr>
      <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
        <img src="https://i.imgur.com/8BQPQDC.png" alt="Logo" width="150">
      </td>
      </tr>
      <tr>
      <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="color: #333333; font-family: Arial, sans-serif; font-size: 24px;">
              Order Confirmation
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0 30px 0; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">
              Dear ${purchaser},
              <br><br>
              Thank you for your purchase! We are pleased to inform you that your order has been successfully placed and is being processed.
              <br><br>
              Order Details:
              <ul>
                <li>Order Number: ${code}</li>
                <li>Order Date: ${purchase_datetime}</li>
                <li>Order Total: ${ammount}</li>
              </ul>
              <br>
              If you have any questions or need further assistance, please feel free to contact our customer support team.
              <br><br>
              Thank you for choosing our company.
              <br><br>
              Sincerely,
              <br>
              Ephemer Gaming
            </td>
          </tr>
        </table>
      </td>
      </tr>
      <tr>
      <td bgcolor="#f7f7f7" align="center" style="padding: 20px 0 20px 0; color: #888888; font-family: Arial, sans-serif; font-size: 12px;">
        This is an automated email. Please do not reply to this message.
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>
    `,
  newUserGreetingEmail: (name, role) => `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Welcome to Ephemer Gaming</title>
    </head>
    <body>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
    <td align="center" bgcolor="#f7f7f7">
    <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse: collapse;">
    <tr>
    <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
      <img src="https://i.imgur.com/8BQPQDC.png" alt="Logo" width="150">
    </td>
    </tr>
    <tr>
    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="color: #333333; font-family: Arial, sans-serif; font-size: 24px;">
            Welcome, ${name}!
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 0 30px 0; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">
            Dear ${name},
            <br><br>
            Welcome to our platform! We are thrilled to have you join our community.
            <br><br>
            Get ready to explore exciting features, connect with fellow users, and enjoy a fantastic experience.
            <br><br>
            You actually have a ${role} role.If you have any questions or need assistance, feel free to reach out to our support team.
            <br><br>
            Once again, welcome aboard!
            <br><br>
            Best regards,
            <br>
            Ephemer Gaming
          </td>
        </tr>
      </table>
    </td>
    </tr>
    <tr>
    <td bgcolor="#f7f7f7" align="center" style="padding: 20px 0 20px 0; color: #888888; font-family: Arial, sans-serif; font-size: 12px;">
      This is an automated email. Please do not reply to this message.
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>
  `,
  passwordRestoreEmail: (email, name, token) => `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Password Restore - Ephemer Gaming</title>
    </head>
    <body>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
    <td align="center" bgcolor="#f7f7f7">
    <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse: collapse;">
    <tr>
    <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
      <img src="https://i.imgur.com/8BQPQDC.png" alt="Logo" width="150">
    </td>
    </tr>
    <tr>
    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="color: #333333; font-family: Arial, sans-serif; font-size: 24px;">
            Password Restore for ${email}
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 0 30px 0; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">
            Dear ${name},
            <br><br>
            We received a request to reset your password. To proceed with the password restore process, please click on the link below:
            <br><br>
            <a href="http://localhost:8080/resetPassword?token=${token}" target="_blank">Reset Password</a>
            <br><br>
            This link will be valid for 1 hour. Please, remember to set a different password from the one you had before.
            <br><br>
            If you did not initiate this request, you can safely ignore this email. Your account remains secure.
            <br><br>
            Thank you for using Ephemer Gaming!
            <br><br>
            Best regards,
            <br>
            Ephemer Gaming
          </td>
        </tr>
      </table>
    </td>
    </tr>
    <tr>
    <td bgcolor="#f7f7f7" align="center" style="padding: 20px 0 20px 0; color: #888888; font-family: Arial, sans-serif; font-size: 12px;">
      This is an automated email. Please do not reply to this message.
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>
    `,
};
