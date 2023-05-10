import asyncio
import websockets


async def handle_client(websocket, path):
    print(f"New connection: {websocket.remote_address}")

    try:
        while True:
            # Receive data from the client
            data = await websocket.recv()
            print(f"Received data from {websocket.remote_address}: {data}")

            # Process the received data

            # Send a response back to the client
            response = f"Server received: {data}"
            await websocket.send(response)

    except websockets.exceptions.ConnectionClosed:
        print(f"Connection closed: {websocket.remote_address}")


def start_server():

    # check if the server is already running
    if 'serv_server' in globals():
        print("Server already running")
        return

    port = 3333
    print(f"Starting server on localhost:{port}...")
    # Configure the WebSocket server
    serv_server = websockets.serve(handle_client, 'localhost', port, ssl=None)

    # Start the server and run forever
    asyncio.get_event_loop().run_until_complete(serv_server)
    asyncio.get_event_loop().run_forever()
