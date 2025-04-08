import aiohttp

from app.core.constans import ACOUST_URL


async def match_fingerprint(duration: int, fingerprint: str):
    async with aiohttp.ClientSession() as session:
        fingerprint, duration = fingerprint.decode(), int(duration)
        QUERIES = {
            "client": "9yLVuXqZPL",
            "fingerprint": fingerprint,
            "duration": duration,
            "format": "json",
            "meta": "recordings",
        }
        async with session.get(ACOUST_URL, params=QUERIES) as response:
            response_dict = await response.json()
            result = response_dict["results"][0]["recordings"][0]

    return result
