import grpc
from concurrent import futures
import service_pb2
import service_pb2_grpc
from fastapi import FastAPI

app = FastAPI()

class DataServiceServicer(service_pb2_grpc.DataServiceServicer):
    def ProcessData(self, request, context):
        # Process the incoming message
        received_message = request.message + " from service 1 lololo"
        print(f"Received message: {received_message}", flush=1)
        # Create and return response
        return service_pb2.DataResponse(
            message=f"Processed: {received_message}",
            success=True
        )

# FastAPI endpoints
@app.get("/")
async def root():
    return {"message": "Service 1 is running"}

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    service_pb2_grpc.add_DataServiceServicer_to_server(
        DataServiceServicer(), server
    )

    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    import uvicorn
    import threading
    
    # Start gRPC server in a separate thread
    grpc_thread = threading.Thread(target=serve, daemon=True)
    grpc_thread.start()
    
    # Start FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000) 