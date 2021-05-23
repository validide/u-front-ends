/**
 * Generate a v4 UUID/GUID
 *
 * @returns A random generated string
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    // eslint-disable-next-line no-bitwise
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate a random string
 *
 * @returns A random generated string
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getRandomString(): string { return Math.random().toString(36).substring(2); }

export { getUuidV4, getRandomString };
