export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'Content-Type, Authorization'
    }
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('u') || '';
  if (!target) return Response.json({ error: 'Lipsește parametrul ?u=' }, { status: 400 });

  let urlObj;
  try { urlObj = new URL(target); } catch { return Response.json({ error: 'URL invalid' }, { status: 400 }); }
  if (urlObj.hostname !== 'api.sofascore.com') return Response.json({ error: 'Host nepermis' }, { status: 403 });

  try {
    const r = await fetch(target, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Referer': 'https://www.sofascore.com/',
        'Origin': 'https://www.sofascore.com'
      },
      redirect: 'follow',
      cache: 'no-store'
    });
    const text = await r.text();
    return new Response(text, {
      status: r.status,
      headers: {
        'content-type': r.headers.get('content-type') || 'application/json',
        'access-control-allow-origin': '*',
        'cache-control': 's-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (e) {
    return Response.json({ error: 'Eroare la fetch', details: String(e) }, { status: 500 });
  }
}
