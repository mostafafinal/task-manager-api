import { transporter } from "../configs/nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export const resetPasswordEmail = async (
  sender: string,
  receiver: string,
  domain: string
) => {
  try {
    const mailOptions: MailOptions = {
      from: `"ToTasky" <${sender}>`,
      to: receiver,
      subject: "Reset Password",
      text: `Hello,\nPlease reset yout password from going there:\n${domain}\nNote that this url is only valid for 5 minutes!\nSincerely,\nToTasky Support`,
    };

    const email = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) return false;

      return info.response;
    });

    return email;
  } catch (error) {
    console.error(error);
  }
};
