FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY index.html style.css app.js rae_topics.js server.py marker_sound.mp3 ./
COPY avatars ./avatars
COPY assets ./assets
COPY backgrounds ./backgrounds

ENV HOST=0.0.0.0
ENV PORT=8090

EXPOSE 8090

CMD ["python", "server.py"]
