const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

const RAZORPAY_SECRET = "shopisnap123";

app.post("/api/payment-hook", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(403).send("Invalid signature");
  }

  const payment = req.body.payload.payment.entity;
  const email = payment.email;
  const amount = payment.amount / 100; // Convert from paise to rupees

  let message = "";

  if (amount === 1) {
    message = `
🧪 TEST MODE EMAIL

Your payment of ₹1 was successful (for testing purposes).

If you were testing your setup — it worked! ✅

Email: ${email}
Amount Paid: ₹${amount}

Team ShopiSnap 💚
    `;
  } else if (amount === 249) {
    message = `
🎉 Congratulations for making this wonderful purchase with us!

Download 500+ Shopify Themes:
👉 THEME BUNDLE: https://drive.google.com/drive/folders/15slJTHPRfD6bj0Cc3chCe_6d9TOfrAw6
📋 CHECKLIST: https://docs.google.com/spreadsheets/d/1dYJMxnHkp7oKZnabL4L2kvaysHi059X_

If you have any problems accessing it, please contact our support at:
📧 Email - shoya3247@gmail.com

Love & Regards,  
Team ShopiSnap 💚
    `;
  } else if (amount === 398) {
    message = `
🎉 Congratulations for making this wonderful purchase with us!

Download 500+ Shopify Themes:
👉 THEME BUNDLE: https://drive.google.com/drive/folders/15slJTHPRfD6bj0Cc3chCe_6d9TOfrAw6
🔍 SEO CHECKLIST: https://docs.google.com/spreadsheets/d/1dYJMxnHkp7oKZnabL4L2kvaysHi059X_

If you have any problems accessing it, please contact our support at:
📧 Email - shoya3247@gmail.com

Love & Regards,  
Team ShopiSnap 💚
    `;
  } else {
    message = `
We received your payment of ₹${amount}, but couldn't match it to a known product tier.

Please contact support at 📧 shoya3247@gmail.com for assistance.
    `;
  }

  try {
    await sendEmail(email, message);
    res.send("Email sent!");
  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).send("Email sending failed.");
  }
});

async function sendEmail(to, bodyText) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shoya3247@gmail.com",
      pass: "svtmokqdgsunfeic", // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: "ShopiSnap <shoya3247@gmail.com>",
    to,
    subject: "Your Shopify Templates 🎁",
    text: bodyText,
  });
}

app.get("/", (req, res) => {
  res.send("Webhook server running!");
});

app.listen(3000, () => console.log("Running on port 3000"));
