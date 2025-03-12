FROM python:3.11-slim

WORKDIR /app

COPY ../pyproject.toml .
COPY ../protos ./protos
COPY ../generate_grpc.py .
COPY . .

RUN pip install uv
RUN uv pip compile pyproject.toml > requirements.txt && \
    uv pip install --system -r requirements.txt 

CMD ["python", "main.py"] 