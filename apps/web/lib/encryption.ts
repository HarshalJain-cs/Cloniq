/**
 * Encryption utilities for sensitive user data
 * Uses AES-256-GCM for authenticated encryption
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

// Get encryption key from environment (must be 32 bytes base64 encoded)
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY not set in environment');
  }
  return Buffer.from(key, 'base64');
}

/**
 * Encrypt sensitive text data
 * Returns: iv:authTag:encrypted (all hex encoded)
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt encrypted text data
 * Input format: iv:authTag:encrypted (all hex encoded)
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive data for analytics (one-way, non-reversible)
 * Returns first 16 chars of SHA-256 hash
 */
export function hashSensitiveData(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex').substring(0, 16);
}

/**
 * Anonymize wallet address for analytics
 * Returns first 8 chars of SHA-256 hash
 */
export function anonymizeWallet(wallet: string): string {
  return crypto.createHash('sha256')
    .update(wallet.toLowerCase())
    .digest('hex')
    .substring(0, 8);
}

/**
 * Generate cryptographically secure random API key
 */
export function generateSecureApiKey(): string {
  const randomBytes = crypto.randomBytes(32);
  const key = randomBytes.toString('base64url');
  return `sk-cloniq-${key}`;
}

/**
 * Check if text should be stored in full or hashed
 * Short queries OK to store, long ones should be hashed
 */
export function shouldStoreFullText(text: string): boolean {
  return text.length < 100; // Only store queries under 100 chars
}

/**
 * Sanitize user input for storage (remove sensitive patterns)
 */
export function sanitizeUserInput(text: string): string {
  // Remove potential credit card numbers
  let sanitized = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD REDACTED]');

  // Remove potential SSN patterns
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]');

  // Remove email addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');

  // Remove phone numbers
  sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REDACTED]');

  return sanitized;
}

/**
 * Generate encryption key (for initial setup)
 * Run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('base64');
}
