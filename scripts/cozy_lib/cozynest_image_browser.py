import asyncio
import json

import websockets
from websockets.server import serve

from scripts.cozy_lib import tools
from scripts.cozy_lib.CozyLogger import CozyLoggerImageBrowser as CozyLogger


async def start_server(images_folders, server_port, stopper):
    CozyLogger.info(f"CozyNestSocket: Starting socket server on localhost:{server_port}...")

    CLIENTS = set()

    async def handle_client(websocket, path):
        try:
            CLIENTS.add(websocket)
            while True:
                if stopper.is_set():
                    CozyLogger.info(f"CozyNestSocket: Stopping socket server on localhost:{server_port}...")
                    break

                # Receive data from the client
                data = await websocket.recv()

                # decode the received data as json
                data = json.loads(data)
                try:
                    res = await process(data)
                except Exception as e:
                    CozyLogger.error(f"CozyNestSocket: Error while processing data: {data}", e)
                    res = json.dumps({
                        'what': 'error',
                        'data': 'None',
                        'error': str(e)
                    })

                # Send a response back to the client
                if res:
                    await websocket.send(res)

        except websockets.exceptions.ConnectionClosed:
            pass

    async def process(data):
        what = data['what']
        if what == 'images':
            data = tools.scrap_image_folders(images_folders)
            return json.dumps(data)

        if what == 'image_saved':
            await on_image_saved(data['data'])
            return json.dumps({
                'what': 'success',
                'data': 'None'
            })

        if what == 'index_built':
            await on_index_built(data['data'])
            return json.dumps({
                'what': 'success',
                'data': 'None'
            })

        else:
            CozyLogger.info(f"CozyNestSocket: Unknown data: {data}")
            return json.dumps({
                'what': 'error',
                'data': 'None',
                'error': 'Unknown data'
            })

    async def on_image_saved(data):

        CLIENTS_COPY = CLIENTS.copy()
        CLIENTS.clear()

        for websocket in CLIENTS_COPY.copy():
            await websocket_send('dispatch_on_image_saved', data, websocket)

    async def on_index_built(data):

        CLIENTS_COPY = CLIENTS.copy()
        CLIENTS.clear()

        for websocket in CLIENTS_COPY.copy():
            await websocket_send('dispatch_on_index_built', data, websocket)

    async def websocket_send(what, data, websocket):
        try:
            await websocket.send(json.dumps({
                'what': what,
                'data': data
            }))
            CLIENTS.add(websocket)
        except websockets.ConnectionClosed:
            pass

    # Configure the WebSocket server
    stop = asyncio.Future()  # set this future to exit the server
    async with serve(handle_client, 'localhost', server_port, ssl=None):
        while True:
            await asyncio.sleep(1)
            if stopper.is_set():
                CozyLogger.info(f"CozyNestSocket: Stopping socket server on localhost:{server_port}...")
                stop.set_result(True)
                break
