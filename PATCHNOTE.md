## New features in 2.0.0

- [x]  Fully integrated Image Browser **IN BETA**. Lots of bugs and missing features. Please be kind with Github issues.
    - [x]  Send to txt2img / img2img / …
    - [x]  Clean memory for image not visible (unload them / replace with dummy div) clean filteredImages and loadedImage Array
    - [x]  manage new image generated
    - [x]  Automatically get image output folder (without grid folder)
    - [x]  Drag and drop image

## Issues fixed

- [x]  Laggy Extra Network tab opening (still a bit laggy, but better)
- [x]  crash when loading without setting file saved
- [x]  Fix Drag and drop image

## Known Issue

- [ ]  Laggy Extra Network tab opening. a1111 changed the way Extra network are loaded and they can't be tweaked as before in the last update
- [ ]  Partial compatibility with Firefox and Opera GX
- [ ]  Most tweak will not support a live window resize
- [ ]  Some user report a missing scrollbar in Extra network tab
- [ ]  Some user report an crash when attempting to open Extra Network tab
