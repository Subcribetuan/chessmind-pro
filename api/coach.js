export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { system, message, max_tokens = 300, model } = req.body;

    if (!system || !message) {
      return res.status(400).json({ error: 'Missing system or message' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-haiku-4-5-20251001',
        max_tokens: Math.min(max_tokens, 500),
        system,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', response.status, err);
      return res.status(response.status).json({ error: 'API error', details: err });
    }

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');

    return res.status(200).json({ text });
  } catch (e) {
    console.error('Coach API error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
