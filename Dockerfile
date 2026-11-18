FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY index.html style.css app.js server.py ./
COPY avatars ./avatars

ENV HOST=0.0.0.0
ENV PORT=8090

EXPOSE 8090

CMD ["python", "server.py"]
