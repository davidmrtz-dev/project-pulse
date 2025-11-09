/**
 * Custom error class that includes a translation key
 */
export class TranslatableError extends Error {
  constructor(
    public translationKey: string,
    message?: string
  ) {
    super(message || translationKey);
    this.name = 'TranslatableError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TranslatableError);
    }
  }
}

/**
 * Helper function to create a translatable error
 */
export function createError(key: string, message?: string): TranslatableError {
  return new TranslatableError(key, message);
}

/**
 * Helper function to get error message, translating if it's a TranslatableError
 */
export function getErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof TranslatableError) {
    return t(error.translationKey);
  }
  if (error instanceof Error) {
    // Check if the error message is a translation key (starts with "errors." or "validation.")
    if (error.message.startsWith('errors.') || error.message.startsWith('validation.')) {
      return t(error.message);
    }
    return error.message;
  }
  return t('common.unknownError');
}

