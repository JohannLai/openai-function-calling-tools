// Mark not-as-node if in Supabase Edge Function
export const isNode = () => {
  return typeof process !== "undefined" &&
  typeof process.versions !== "undefined" &&
  typeof process.versions.node !== "undefined"
}
