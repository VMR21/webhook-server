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
  const amount = payment.amount / 100;

  let message = "";

  if (amount === 1) {
    message = `
🧪 TEST MODE EMAIL

Your ₹1 test payment was successful.

This confirms that your webhook and email delivery are working perfectly. ✅

Email used: ${email}  
Amount Paid: ₹1

You’re all set to start selling!

With appreciation,  
💚 Team ShopiSnap
    `;
  } else if (amount === 249) {
    message = `
🎉 Thank you for your purchase, and welcome to the ShopiSnap family!

Your ₹249 plan was successfully activated. As promised, here is your exclusive bundle:

📦 500+ Shopify Themes  
👉 Download Link: https://drive.google.com/drive/folders/15slJTHPRfD6bj0Cc3chCe_6d9TOfrAw6

We hope these themes help you launch and grow your dream store effortlessly.

If you face any issues accessing the download, just reply to this email or contact us at:
📧 shoya3247@gmail.com

With appreciation,  
💚 Team ShopiSnap
    `;
  } else if (amount === 398) {
    message = `
🎉 You’ve unlocked the Premium Pack — thank you for your ₹398 purchase!

Here’s everything you need to build and grow your store like a pro:

📦 500+ Shopify Themes  
👉 Download Link: https://drive.google.com/drive/folders/15slJTHPRfD6bj0Cc3chCe_6d9TOfrAw6

🔍 Premium SEO Checklist  
👉 Access Link: https://docs.google.com/spreadsheets/d/1dYJMxnHkp7oKZnabL4L2kvaysHi059X_

If you need any help, we’re always here:
📧 Email: shoya3247@gmail.com

Wishing you success ahead!  
💚 Team ShopiSnap
    `;
  } else {
    message = `
We received your payment of ₹${amount}, but it doesn’t match any known product tier.

Please contact us for support:
📧 shoya3247@gmail.com

We're happy to assist you!

- Team ShopiSnap 💚
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
