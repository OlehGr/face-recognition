FROM python:3.9
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN apt-get update && apt-get install -y libboost-dev libboost-program-options-dev libgtest-dev cmake
COPY ../../banch/face-recognition/requirements.txt .
COPY ../../banch/face-recognition/server.py .
COPY ../../banch/face-recognition/db ./db
RUN pip install -r requirements.txt
ENV PATH="/opt/venv/bin:$PATH"
CMD ["uvicorn", "server:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8002"]
