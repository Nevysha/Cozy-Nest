import sys
from scripts.cozynest_image_browser import start_server, stop_server

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


    start_server(images_folders, port)

    # close the server on keyboard interrupt
    try:
        while True:
            pass
    except KeyboardInterrupt:
        stop_server()
        exit()
