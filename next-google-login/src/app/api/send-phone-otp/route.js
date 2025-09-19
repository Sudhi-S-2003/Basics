import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/user";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
}

export async function POST(request) {
  const { phone } = await request.json();

  await dbConnect();

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  const otp = generateOTP();

  user.otp = otp;
  await user.save();

  // TODO: Send OTP to phone with SMS provider (Twilio, etc.)
  console.log(`Sending OTP ${otp} to phone ${phone}`);

  return NextResponse.json({ ok: true });
}
