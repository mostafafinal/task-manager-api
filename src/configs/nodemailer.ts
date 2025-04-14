import { createTransport, Transporter } from "nodemailer";
import { Options } from "nodemailer/lib/smtp-transport";
import { ENV_VARS } from "./envs";

const transprotOpts: Options = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: ENV_VARS.EMAIL_SENDER_USERNAME,
    pass: ENV_VARS.EMAIL_SENDER_PASSWORD,
  },
};

export const transporter: Transporter = createTransport(transprotOpts);
