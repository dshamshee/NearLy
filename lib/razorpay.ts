import Razorpay from "razorpay";

let _razorpayInstance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!_razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables");
    }
    _razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _razorpayInstance;
}

export const razorpayInstance = new Proxy({} as Razorpay, {
  get(_, prop) {
    return (getRazorpayInstance() as unknown as Record<string, unknown>)[prop as string];
  },
});
