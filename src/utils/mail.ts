/**
 * @file mail.ts
 * @author Mostafa Hasan // (mostafafinal55@gmail.com)
 * @summary
 *  This file declares resetPasswordEmail util
 *  it's responsible for sending a reset password email
 *  to the user in order to reset their password
 * @version 1.0.0
 * @date 2025-03-31
 * @copyright Copyrights (c) 2025
 */

import { transporter } from "../configs/nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { logger } from "./logger";

/**
 *  Reset password email util sends a reset password email
 *  to the user who forgot or requested to reset, it would
 *  contain a URL to be used in order to reset user password
 * @param sender email that would send the reset password email
 * @param receiver email that would receive the reset password email
 * @param domain URL that would be used to reset password
 * @example resetPasswordEmail("sender@gmail.com", "receiver@gmail.com", "example.com")
 */

export const resetPasswordEmail = async (
  sender: string,
  receiver: string,
  domain: string
) => {
  try {
    if (
      !sender ||
      sender === "" ||
      !receiver ||
      receiver === "" ||
      !domain ||
      domain === ""
    )
      throw new Error("invlid parameters");

    const mailOptions: MailOptions = {
      from: `"ToTasky" <${sender}>`,
      to: receiver,
      subject: "Reset Password",
      text: `Hello,\nPlease reset yout password from going there:\n${domain}\nNote that this url is only valid for 5 minutes!\nSincerely,\nToTasky Support`,
    };

    await transporter.sendMail(mailOptions, (error) => {
      if (error) throw new Error("failed to send reset password email");
    });
  } catch (error) {
    logger.error(error, "RESET PASSWORD EMAIL UTIL EXCEPTION");
  }
};
