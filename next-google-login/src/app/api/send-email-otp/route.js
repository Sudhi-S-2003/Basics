import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/user";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
}

export async function POST(request) {
  const { email } = await request.json();

  await dbConnect();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const otp = generateOTP();

  // Store OTP in DB (you can add expiration logic if you want)
  user.otp = otp;
  await user.save();

  // TODO: Send OTP to user's email with an email service (e.g., SendGrid, nodemailer)
  console.log(`Sending OTP ${otp} to email ${email}`);

  return NextResponse.json({ ok: true });
}
