import asyncio
import json
import multiprocessing
import os
from PIL import Image
from PIL.ExifTags import TAGS
from modules import script_callbacks
import websockets

serv_server = None
images_folders = []


def stop_server():
    global serv_server
    print("CozyNest: Stopping server...")
    serv_server.close()
    asyncio.get_event_loop().stop()
    print("CozyNest: Server stopped")


def on_image_saved(gen_params: script_callbacks.ImageSaveParams):

    print(f"CozyNest: on_image_saved{gen_params}")

    for websocket in CLIENTS.copy():
        websocket_send(gen_params, websocket)


async def websocket_send(gen_params, websocket):
    try:
        await websocket.send(json.dumps({
            'what': 'image_saved',
            'data': {
                'filename': gen_params.filename,
                'pnginfo': gen_params.pnginfo,
            }
        }))
    except websockets.ConnectionClosed:
        pass


script_callbacks.on_image_saved(on_image_saved)
# script_callbacks.on_before_reload(stop_server)

CLIENTS = set()


async def handle_client(websocket, path):
    print(f"CozyNest: New connection: {websocket.remote_address}")

    try:
        CLIENTS.add(websocket)
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


def start_server_in_dedicated_process(_images_folders, server_port, dedicated_process=False):
    if not dedicated_process:
        # call start_server() in the current process
        start_server(_images_folders, server_port)
        return

    # call start_server() in a new process
    # Create a new process
    serv_process = multiprocessing.Process(target=start_server,
                                           args=(_images_folders, server_port))

    try:
        # Start the process
        serv_process.start()
    except KeyboardInterrupt:
        print("CozyNest: terminating server process")
        serv_process.terminate()


def start_server(_images_folders, server_port=3333):
    global serv_server, images_folders
    images_folders = _images_folders

    print(f"CozyNest: Starting socket server on localhost:{server_port}...")
    # Configure the WebSocket server
    serv_server = websockets.serve(handle_client, 'localhost', server_port, ssl=None)

    try:
        # Start the server and run forever
        asyncio.get_event_loop().run_until_complete(serv_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        print("CozyNest: Stopping server")
        asyncio.get_event_loop().stop()
