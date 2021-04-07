export default function handler(lambda) {
  return async function (event, context) {
    return await lambda(event, context);
  };
}
