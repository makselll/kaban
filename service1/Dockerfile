FROM python:3.11-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy only necessary files
COPY pyproject.toml .
COPY protos ./protos
COPY generate_grpc.py .
COPY service1 ./service1

# Install dependencies
RUN pip install --no-cache-dir -e .

# Generate gRPC code
RUN python generate_grpc.py

# Move service files to the correct location
RUN mv service1/* . && rm -rf service1

CMD ["python", "main.py"] 