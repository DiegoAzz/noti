import asyncio
import base64
import json
import mimetypes
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

import edge_tts

mimetypes.add_type("model/gltf-binary", ".glb")
mimetypes.add_type("model/gltf+json", ".gltf")

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8090"))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ALLOWED_VOICES = {
    "es-MX-JorgeNeural",
    "es-US-AlonsoNeural",
    "es-ES-AlvaroNeural",
    "es-CO-GonzaloNeural",
    "es-AR-TomasNeural",
    "es-CL-LorenzoNeural",
    "es-MX-DaliaNeural",
}


async def synthesize_neural_tts(text: str, voice: str, pitch_hz: int, rate_pct: int):
    pitch_str = f"{pitch_hz:+d}Hz"
    rate_str = f"{rate_pct:+d}%"

    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        pitch=pitch_str,
        rate=rate_str,
        boundary="WordBoundary",
    )

    audio_chunks = bytearray()
    words = []

    async for chunk in communicate.stream():
        ctype = chunk.get("type")
        if ctype == "audio":
            audio_chunks.extend(chunk["data"])
        elif ctype == "WordBoundary":
            words.append(
                {
                    "text": chunk["text"],
                    "start": chunk["offset"] / 10_000_000.0,
                    "duration": chunk["duration"] / 10_000_000.0,
                }
            )

    return bytes(audio_chunks), words


class HeroNewsHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path == "/health":
            self._send_json(200, {"status": "ok"})
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/tts":
            self.send_error(404, "Endpoint no encontrado")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(length)
            payload = json.loads(raw_body.decode("utf-8"))

            text = (payload.get("text") or "").strip()
            if not text:
                self._send_json(400, {"error": "El texto no puede estar vacío."})
                return

            voice = payload.get("voice") or "es-MX-JorgeNeural"
            if voice not in ALLOWED_VOICES:
                voice = "es-MX-JorgeNeural"

            pitch_hz = max(-25, min(15, int(payload.get("pitchHz", -10))))
            rate_pct = max(-30, min(40, int(payload.get("ratePct", 5))))

            audio_bytes, words = asyncio.run(
                synthesize_neural_tts(text, voice, pitch_hz, rate_pct)
            )

            self._send_json(
                200,
                {
                    "audioBase64": base64.b64encode(audio_bytes).decode("ascii"),
                    "words": words,
                },
            )
        except Exception as exc:
            self._send_json(500, {"error": str(exc)})

    def _send_json(self, status_code: int, data: dict):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    server = ThreadingHTTPServer((HOST, PORT), HeroNewsHandler)
    print(f"HERO NEWS 3D + Voz Neural IA listo en http://{HOST}:{PORT}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
