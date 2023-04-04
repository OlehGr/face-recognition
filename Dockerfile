FROM python:3.9
WORKDIR /app
RUN apt-get update && apt-get install -y libboost-dev libboost-program-options-dev libgtest-dev cmake
COPY requirements.txt .
COPY server.py .
COPY db ./db
RUN pip install --upgrade pip && pip install -r requirements.txt
CMD ["uvicorn", "server:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8002"]
