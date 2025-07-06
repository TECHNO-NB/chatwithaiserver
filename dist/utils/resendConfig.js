import { Resend } from "resend";
import ApiError from "./ApiError.js";
import { emailTemplateHtml } from "../helpers/emailHtml.js";
const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail = async (toEmail, subject, code) => {
    const { data, error } = await resend.emails.send({
        from: "MoneyHub  <noreply@moneyhub.store>",
        to: [toEmail],
        subject: subject,
        html: emailTemplateHtml(code),
    });
    if (error) {
        throw new ApiError(false, 500, "Email is not send");
    }
    return data;
};
export { sendEmail };
