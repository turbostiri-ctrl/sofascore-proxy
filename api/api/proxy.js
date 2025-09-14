export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const target = req.query.u || '';
  if (!target) {
    res.status(400).json({ error: 'Lipsește parametrul ?u=' });
    return;
  }

  let urlObj;
  try { urlObj = new URL(target); } catch { 
    res.status(400).json({ error: 'URL invalid' });
    return;
  }
  if (urlObj.hostname !== 'api.sofascore.com') {
    res.status(403).json({ error: 'Host nepermis' });
    return;
  }

  try {
    const r = await fetch(target, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Referer': 'https://www.sofascore.com/',
        'Origin': 'https://www.sofascore.com'
      },
      redirect: 'follow'
    });

    const text = await r.text();
    const ct = r.headers.get('content-type') || 'application/json';

    res
      .status(r.status)
      .setHeader('Content-Type', ct)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
      .send(text);
  } catch (e) {
    res.status(500).json({ error: 'Eroare la fetch', details: String(e) });
  }
}
