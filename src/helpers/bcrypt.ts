import bcrypt from "bcryptjs";

/**
 * Hashes a PIN using bcrypt
 * @param pin - The PIN to hash
 * @returns Promise<string> - The hashed PIN
 */
export async function hashPin(pin: string): Promise<string> {
  const saltRounds = 10;
  const hashedPin = await bcrypt.hash(pin, saltRounds);
  return hashedPin;
}

/**
 * Verifies a PIN against a hashed PIN
 * @param pin - The PIN to verify
 * @param hashedPin - The hashed PIN to compare against
 * @returns Promise<boolean> - True if PIN matches, false otherwise
 */
export async function verifyPin(
  pin: string,
  hashedPin: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(pin, hashedPin);
  return isMatch;
}
