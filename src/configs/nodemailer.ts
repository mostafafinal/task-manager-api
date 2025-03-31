import { createTransport, Transporter } from "nodemailer";
import { Options } from "nodemailer/lib/smtp-transport";
import { config } from "dotenv";

config();

const transprotOpts: Options = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER_USERNAME,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
};

export const transporter: Transporter = createTransport(transprotOpts);
