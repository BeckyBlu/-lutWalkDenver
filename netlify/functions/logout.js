exports.handler = async function handler() {
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': 'sw_auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};