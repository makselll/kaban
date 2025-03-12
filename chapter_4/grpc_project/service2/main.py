import grpc
import service_pb2
import service_pb2_grpc
from fastapi import FastAPI

app = FastAPI()

# Create a gRPC channel
channel = grpc.insecure_channel('service1:50051')
stub = service_pb2_grpc.DataServiceStub(channel)

@app.get("/")
async def root():
    return {"message": "Service 2 is running"}

@app.post("/send-message")
async def send_message(message: str):
    try:
        # Create a request
        request = service_pb2.DataRequest(message=message)
        # Make the gRPC call
        response = stub.ProcessData(request)
        return {
            "status": "success",
            "response_message": response.message,
            "success": response.success
        }
    except grpc.RpcError as e:
        return {
            "status": "error",
            "message": f"gRPC error: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 