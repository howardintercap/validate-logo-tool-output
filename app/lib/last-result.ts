const resultStore = new Map<string, any[]>();

export function enqueueResult(
  traceId: string,
  payload: Record<string, unknown>
) {
  const existing = resultStore.get(traceId) ?? [];
  existing.push(payload);
  resultStore.set(traceId, existing);
}

export function dequeueResult(traceId: string) {
  const results = resultStore.get(traceId) ?? [];
  resultStore.delete(traceId);
  return results.length > 0 ? results : null;
}

export function getResultsForTrace(traceId: string) {
  return resultStore.get(traceId) ?? [];
}
