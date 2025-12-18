
interface EmailTemplateProps {
  name: string;
  verificationCode: string;
}

export function EmailTemplate({ name, verificationCode }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Thank you for signing up. Here is your verification code: <strong>{verificationCode}</strong></p>
      <p>Please use this code to verify your email, This code will expire in 10 minutes.</p>
      <p>If you did not sign up for an account, please ignore this email.</p>
      <p>Thank you for using our service.</p>
      <p>Best regards, NearLy</p>
    </div>
  );
}