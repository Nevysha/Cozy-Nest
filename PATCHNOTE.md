## New features in 2.0.0

- [x]  Fully integrated Image Browser **IN BETA**. Lots of bugs and missing features. Please be kind with Github issues.
    - [x]  Send to txt2img / img2img / …
    - [x]  Clean memory for image not visible (unload them / replace with dummy div) clean filteredImages and loadedImage Array
    - [x]  manage new image generated
    - [x]  Automatically get image output folder (without grid folder)

## Issues fixed

- [x]  Laggy Extra Network tab opening (still a bit laggy, but better)
- 

## Known Issue

- [ ]  Partial compatibility with Firefox and Opera GX
- [ ]  Most tweak will not support a live window resize
- [ ]  Some user report a missing scrollbar in Extra network tab
- [ ]  Some user report an issue when having to many script "block" in txt2img or img2img
- [ ]  If setting are saved and user refresh, it will revert to old setting (only visually) because webui load them at gradio launch]
