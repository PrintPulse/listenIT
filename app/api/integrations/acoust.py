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
            try:
                result = response_dict["results"][0]["recordings"][0]
            except IndexError:
                result = {
                    "message": "К сожалению, мы пока не знаем такого трека"
                }

    return result
