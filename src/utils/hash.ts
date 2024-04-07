import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(
  password: string
): Promise<{ hash: string; salt: string }> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
}

export async function verifyPassword({
  candidatePassword,
  salt,
  hash,
}: {
  candidatePassword: string;
  salt: string;
  hash: string;
}) {
  const candidateHash = await bcrypt.hash(candidatePassword, salt);
  return candidateHash === hash;
}
