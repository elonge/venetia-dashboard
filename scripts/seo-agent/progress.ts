const runStartedAt = Date.now();

export function progress(message: string) {
  const elapsedSeconds = Math.round((Date.now() - runStartedAt) / 1000);
  console.log(`[seo +${elapsedSeconds}s] ${message}`);
}
