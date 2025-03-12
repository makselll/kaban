from grpc_tools import protoc

# Generate gRPC code for both services
protoc.main([
    'grpc_tools.protoc',
    '-I./protos',
    '--python_out=service1',
    '--grpc_python_out=service1',
    './protos/service.proto'
])

protoc.main([
    'grpc_tools.protoc',
    '-I./protos',
    '--python_out=service2',
    '--grpc_python_out=service2',
    './protos/service.proto'
]) 