const resultQueue: Record<string, unknown>[] = [];

export function enqueueResult(payload: Record<string, unknown>) {
  resultQueue.push(payload);
}

export function dequeueResult() {
  return resultQueue.shift() ?? null;
}
// use middleware and trace id
// events poll
// pool events together