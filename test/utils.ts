export const values_falsies = [undefined, null, false, ""];

export function getDelayPromise(delayMs = 1, success = true): Promise<void> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      success ? res() : rej(new Error());
    }, delayMs);
  });
}
