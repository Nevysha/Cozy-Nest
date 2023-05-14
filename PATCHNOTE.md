# Add to push this update a bit sooner than expected due to a1111 1.2.0 update. Enjoy the new image browser!

## Compatibility

From a1111 5ab7f213 commit to the 1.2.0 release (b08500ce atm).  

## Minor changes & fixes in 2.0.3

- [x] "Send to" buttons are opening right side drawer panels rather than swapping tabs #75
- [x] Fix: tweak of SDAtom-WebUi-client-queue-ext extension. To enable the tweak you have to add `"extensions": ["SDAtom-WebUi-client-queue-ext"]` to your nevyui_settings.json file

## Minor changes & fixes in 2.0.2

- [x] Cozy Nest error popup should now only be displayed if filename contains Cozy Nest
- [x] Fix image browser crash if metadata are not formatted as expected (although metadata display may display "Error parsing metadata")
- [x] Fix Download image link hidden on hover
- [x] Fix selectable options list passing under other elements
- [x] Fix: Grid image appear in Image browser after batch gen
- [x] Fix: Wave badly displayed
- [x] Add setting to disable waves and gradiant bg

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

- [ ]  Metadata display in image browser may display "Error parsing metadata"
- [ ]  Partial compatibility with Firefox and Opera GX
- [ ]  Most tweak will not support a live window resize
- [ ]  Some user report a missing scrollbar in Extra network tab
- [ ]  Some user report an crash when attempting to open Extra Network tab
