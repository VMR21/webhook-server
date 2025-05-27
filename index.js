const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

const RAZORPAY_SECRET = "your_webhook_secret_here";

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

  // Replace with your product download link
  const productLink = "https://shopisnap.com/download/500-shopify-themes.zip";

  await sendEmail(email, productLink);
  res.send("Email sent!");
});

async function sendEmail(to, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@gmail.com",
      pass: "your_app_password", // Use Gmail app password
    },
  });

  await transporter.sendMail({
    from: "ShopiSnap <your@gmail.com>",
    to,
    subject: "Your Shopify Templates 🎁",
    text: `Thanks for your payment! Here's your download link: ${link}`,
  });
}

app.get("/", (req, res) => {
  res.send("Webhook server running!");
});

app.listen(3000, () => console.log("Running on port 3000"));
