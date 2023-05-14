# Add to push this update a bit sooner than expected due to a1111 1.2.0 update. Enjoy the new image browser!

## Compatibility

From a1111 5ab7f213 commit to the 1.2.0 release (b08500ce atm).  

## Minor changes & fixes in 2.0.1

- [x] Fix: Some user report a missing scrollbar in Extra network tab
- [x] Fix: image browser spamming console
- [x] Fix: Image Browser socket do not always close properly when reloading the UI
- [x] disable image browser via settings (NOW DISABLED BY DEFAULT)
- [x] extra network tab fix and perf (a bit)


## New features in 2.0.0

- [x]  Fully integrated Image Browser **IN BETA**. Lots of bugs and missing features. Please be kind with Github issues.
    - [x]  Send to txt2img / img2img / …
    - [x]  Clean memory for image not visible (unload them / replace with dummy div) clean filteredImages and loadedImage Array
    - [x]  manage new image generated
    - [x]  Automatically get image output folder (without grid folder)
    - [x]  Drag and drop image

## Issues fixed

- [x]  Laggy Extra Network tab opening
- [x]  crash when loading without setting file saved
- [x]  Fix Drag and drop image

## Known Issue

- [ ]  Partial compatibility with Firefox and Opera GX
- [ ]  Most tweak will not support a live window resize
- [ ]  Some user report a missing scrollbar in Extra network tab
- [ ]  Some user report an crash when attempting to open Extra Network tab
