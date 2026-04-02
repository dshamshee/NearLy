interface ForgotPasswordEmailTemplateProps {
  name: string;
  resetUrl: string;
}

export function ForgotPasswordEmailTemplate({
  name,
  resetUrl,
}: ForgotPasswordEmailTemplateProps) {
  return (
    <div>
      <h1>Password reset — NearLy</h1>
      <p>Hi {name},</p>
      <p>
        We received a request to reset your password. Click the link below to
        choose a new password. This link expires in 10 minutes.
      </p>
      <p>
        <a href={resetUrl}>Reset your password</a>
      </p>
      <p>
        If you did not request this, you can ignore this email. Your password
        will stay the same.
      </p>
      <p>Best regards,<br />NearLy</p>
    </div>
  );
}
