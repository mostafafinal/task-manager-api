import { faker } from "@faker-js/faker";
import { transporter } from "../../src/configs/nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import * as mail from "../../src/utils/mail";

jest.mock("../../src/configs/nodemailer");

describe("Mail until suite", () => {
  afterEach(() => jest.clearAllMocks());

  test("reset password email", async () => {
    const senderMock: string = faker.internet.email();
    const receiverMock: string = faker.internet.email();
    const domailMock: string = "https://domain-mock";
    const mailMessageMock: MailOptions = {
      from: `"ToTasky" <${senderMock}>`,
      to: receiverMock,
      subject: "Reset Password",
      text: `Hello,\nPlease reset yout password from going there:\n${domailMock}\nNote that this url is only valid for 5 minutes!\nSincerely,\nToTasky Support`,
    };

    await mail.resetPasswordEmail(senderMock, receiverMock, domailMock);

    expect(transporter.sendMail).toHaveBeenCalledWith(
      mailMessageMock,
      expect.any(Function)
    );
  });
});
