import os
import sys


parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# add the CozyNest extension to the sys.path.
sys.path.append(parent_dir)


from scripts.cozynest_image_browser import start_server, stop_server, start_server_in_dedicated_process

# call start_server()

# main

if __name__ == '__main__':
    port = 3333

    if len(sys.argv) < 1:
        print("CozyNest: No images folder specified")
        exit()

    # get the images folder from arguments
    # it can be any number of arguments, add all of them in the images_folders list
    images_folders = []
    for i in range(1, len(sys.argv)):
        images_folders.append(sys.argv[i])

    # start_server(images_folders, port)
    start_server_in_dedicated_process(images_folders, port)

    # close the server on keyboard interrupt
    try:
        while True:
            pass
    except KeyboardInterrupt:
        stop_server()
        exit()
