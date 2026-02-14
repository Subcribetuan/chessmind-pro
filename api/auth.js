export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) {
    // No password set — allow access
    return res.status(200).json({ ok: true });
  }

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password === appPassword) {
    return res.status(200).json({ ok: true });
  } else {
    return res.status(401).json({ ok: false, error: 'Wrong password' });
  }
}
