import asyncio
import json
import os
from PIL import Image
from PIL.ExifTags import TAGS

import websockets

serv_server = None
images_folders = []

def stop_server():
    print("CozyNest: Stopping server...")
    serv_server.close()
    asyncio.get_event_loop().stop()
    print("CozyNest: Server stopped")


async def handle_client(websocket, path):
    print(f"CozyNest: New connection: {websocket.remote_address}")

    try:
        while True:
            # Receive data from the client
            data = await websocket.recv()
            print(f"CozyNest: Received data from {websocket.remote_address}: {data}")

            # decode the received data as json
            data = json.loads(data)
            res = process(data)

            # Send a response back to the client
            await websocket.send(res)

    except websockets.exceptions.ConnectionClosed:
        print(f"CozyNest: Connection closed: {websocket.remote_address}")


def process(data):
    what = data['what']
    if what == 'images':
        # scrape the images folder recursively
        images = []
        for images_folder in images_folders:
            for root, dirs, files in os.walk(images_folder):
                for file in files:
                    if file.endswith(".png"):

                        # get exif data
                        exif = {}
                        try:
                            image = Image.open(os.path.join(root, file))
                            info = image.info
                            for tag, value in info.items():
                                decoded = TAGS.get(tag, tag)
                                exif[decoded] = value
                        except Exception as e:
                            print(f"CozyNest: Error while getting exif data: {e}")
                            pass

                        images.append({
                            'path': os.path.join(root, file),
                            'metadata': {
                                'date': os.path.getmtime(os.path.join(root, file)),
                                'exif': exif
                            }
                        })

        # sort the images by date (newest first) metadata.date
        images.sort(key=lambda x: x['metadata']['date'], reverse=True)

        # send the images to the client
        data = {
            'what': 'images',
            'images': images
        }
        return json.dumps(data)


def start_server(_images_folders, port=3333):

    global serv_server, images_folders
    images_folders = _images_folders

    # check if the server is already running
    if serv_server is not None:
        print("CozyNest: Server is already running")
        return

    print(f"CozyNest: Starting server on localhost:{port}...")
    # Configure the WebSocket server
    serv_server = websockets.serve(handle_client, 'localhost', port, ssl=None)

    # Start the server and run forever
    asyncio.get_event_loop().run_until_complete(serv_server)
    asyncio.get_event_loop().run_forever()
