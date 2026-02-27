const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

exports.sendCreativeMail = async ({
  to,
  partnerName,
  creativeName,
  creativeDescription,
  creativeImage,
  templateImage,
}) => {
  const transporter = createTransporter();

  const toTitleCase = (s) => {
    if (!s) return "";
    return String(s)
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const safePartnerName = toTitleCase(partnerName) || "Partner";
  const subject = `Hey! Your Creative Template is Ready`;

  const html = `
    <div style="max-width: 640px; margin: auto; padding: 28px; font-family: Arial, sans-serif; background-color: #ffffff; border-radius: 8px; border: 1px solid #eaeaea;">
      <div style="text-align:center; padding-bottom: 10px;">
        <h2 style="margin: 0; color:#111827;">Hello, ${safePartnerName}!</h2>
        <p style="margin: 8px 0 0; color:#6b7280; font-size: 14px;">We have prepared your creative template.</p>
      </div>

      <div style="background:#f9fafb; border: 1px solid #eef2f7; border-radius: 8px; padding: 16px; margin-top: 18px;">
        <h3 style="margin:0; color:#111827; text-transform: capitalize;">${creativeName || "Creative"}</h3>
        <p style="margin:10px 0 0; color:#374151; font-size: 14px; line-height: 1.6;">
          ${(creativeDescription || "").toString()}
        </p>
      </div>

      <div style="margin-top: 18px;">
        <p style="margin:0 0 8px; color:#6b7280; font-size: 13px;">Your Template Image</p>
        <div style="border: 1px solid #eef2f7; border-radius: 8px; overflow: hidden;">
          <img src="${templateImage}" alt="template" style="width:100%; display:block;" />
        </div>
      </div>

      <div style="margin-top: 22px; padding: 14px; background:#ecfeff; border:1px solid #cffafe; border-radius: 8px;">
        <p style="margin:0; color:#0f172a; font-size: 14px;">
          If you have any questions, reply to this email and we will help you.
        </p>
      </div>

      <hr style="margin: 24px 0; border: none; border-top: 1px solid #f0f0f0;" />
      <p style="margin:0; color:#9ca3af; font-size: 12px; text-align:center;">
        © ${new Date().getFullYear()} AKSHAR BHAGWATI VENTURES LLP. All rights reserved.
      </p>
    </div>
  `;
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    html,
  });
  return { success: true, message: info.response };
  //  ${
  //     creativeImage
  //       ? `<div style="margin-top: 18px;">
  //           <p style="margin:0 0 8px; color:#6b7280; font-size: 13px;">Creative Preview</p>
  //           <img src="${creativeImage}" alt="creative" style="width:100%; border-radius: 12px; border: 1px solid #eef2f7;" />
  //         </div>`
  //       : ""
  //   }
};
