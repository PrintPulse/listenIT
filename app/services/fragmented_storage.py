import os
import tempfile
from pathlib import Path

import acoustid
import ffmpeg

DIR = Path(Path.cwd() / "fragments")


def fragmented(stream_url: str):
    try:
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=".wav", dir=DIR
        ) as temp_audio:
            temp_path = temp_audio.name

            ffmpeg.input(stream_url, t=14).output(
                temp_path, format="wav", acodec="pcm_s16le", ar="44100", ac=2
            ).run(overwrite_output=True)

            duration, fingerprint = acoustid.fingerprint_file(temp_path)

    except Exception as e:
        print(f"Error occurred: {e}")
        duration, fingerprint = None, None

    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)

    return duration, fingerprint
