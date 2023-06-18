// Mark not-as-node if in Supabase Edge Function
export const isNode = () => {
  return typeof process !== "undefined" &&
  typeof process.versions !== "undefined" &&
  typeof process.versions.node !== "undefined"
}

export const getEnv = () => {
  let env: string;
  if (isBrowser()) {
    env = "browser";
  } else if (isNode()) {
    env = "node";
  } else if (isWebWorker()) {
    env = "webworker";
  } else if (isJsDom()) {
    env = "jsdom";
  } else if (isDeno()) {
    env = "deno";
  } else {
    env = "other";
  }

  return env;
};

export const isBrowser = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined";