# HERO NEWS 3D (`noti.appzplay.online`)

Estudio 3D de noticias estilo videojuego construido con **Three.js + Voz Neural IA (`edge-tts`)**.

## Características
- Avatares humanos 3D realistas (`.glb`) con **lip-sync facial real** y soporte para subir tus propios avatares.
- Galería responsiva para **hasta 5 imágenes reales** detrás del presentador (*Carrusel Elegante*, *Mosaico* y *Cine Fade*).
- **Voces Neurales IA en español** con efectos de audio de estudio / comunicador y subtítulos sincronizados palabra por palabra.
- Formatos **9:16 (TikTok / Reels / Shorts)** y **16:9 (YouTube)** con grabación directa a `.webm`.

## Despliegue en Coolify
- **Build Pack:** Dockerfile
- **Puerto expuesto:** `8090`
- **Healthcheck:** `/health`
- **Dominio:** `https://noti.appzplay.online`

## Uso local
```bash
pip install -r requirements.txt
python server.py
```
Abrir `http://localhost:8090`.
