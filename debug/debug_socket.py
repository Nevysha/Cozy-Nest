import asyncio
import json
import socket

import websockets


async def connect_to_socket():
    async with websockets.connect('ws://localhost:3333') as websocket:
        try:
            while True:
                # Send data to the server
                data = json.dumps({
                    'what': 'image_saved',
                    'data': {
                        'filename': "filename",
                        'pnginfo': "gen_params.pnginfo",
                    }
                }).encode('utf-8')
                await websocket.send(data)

                # Receive response from the server
                response = await websocket.recv()
                print("Received response:", response)
                websocket.close()
                break

        except websockets.exceptions.ConnectionClosed:
            print("Connection to socket closed")


if __name__ == '__main__':
    # Run the connection coroutine
    asyncio.run(connect_to_socket())
