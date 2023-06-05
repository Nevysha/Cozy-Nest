## Compatibility

- Automatic1111's webui 1.3.1 release.
- SD.Next (Vlad's fork) from commit `beff89ba`
- Will work best on latest version of both as I'm only testing on latest version.

## New features in 2.2.0

- [x]  Enhanced prompt editor with color (in txt2img and img2img)
- [x]  Tag system for image browser : you can now add tag to your images and filter them by tag. Tags are saved in exif metadata.
- [x]  Exif metadata editor : you can now edit exif metadata of your images
- [x]  You can move img into a separated archive folder (set through settings)
- [x]  You can hide image from image browser (a tag is added to the image exif)
- [x]  You can delete images from image browser
- [x]  Image browser now build a cache of its index to speed up loading time

## Minor changes & fixes in 2.1.7

- [x]  Quick fix to be able to save settings despite the new ui-config.json save ui system. (pruning the file from Cozy Nest entry on startup)

## Minor changes & fixes in 2.1.6

- [x]  Some settings were not saved properly

## Minor changes & fixes in 2.1.5

- [x]  Font color settings added (and auto calculate subdued color)
- [x]  Cozy Nest should detect more easily if it is running on Automatic1111's webui or SD Next (Vlad's fork)
- [x]  Few tweaks for SD Next

## Minor changes & fixes in 2.1.4

- [x]  Add a "clear" button to txt2img and img2img gallery
- [x]  When background and waves animation are disabled they now remain visible but static
- [x]  Settings to enable/disable extra networks tweaks
- [x]  Settings to enable/disable clear gallery button tweaks
- [x]  Fix CozyNest=No not working

## Minor changes & fixes in 2.1.3

- [x]  Fix for default "send to" button
- [x]  Fix image browser search
- [x]  SFW settings to blur all images in the UI 👀
- [x]  Removed console spam from image browser
- [x]  Faster animation for settings, update and side panels
- [x]  Fix for troubleshot dialog with Vlad's fork

## Minor changes & fixes in 2.1.2

- [x]  Fix for Vlad's fork compatibility

## Minor changes & fixes in 2.1.1

- [x]  Fix bug for image with special characters in their name (like "+")

## New features in 2.1.0

- [x]  Settings panel for image browser
    - [x]  Chose default socket port
    - [x]  Enable/disable auto search for free port
    - [x]  Enable/disable auto fetch for output folder from a1111 settings
    - [x]  Add/Remove custom output folder
   
- [x]  Code has been refactored to use a module builder (Vite). Refactoring is still in progress in the long run. But it should help to stabilize the code base.

## Minor changes & fixes in 2.0.9

- [x] Using the builtin png info to get image generation data in image browser
- [x] Add error handling and display for image browser
- [x] Fix : prevent error if a tab button made by an extension does not have inner text
- [x] Add close button to Cozy Nest update panel

## Minor changes & fixes in 2.0.8

- [x] Remove the "click outside to close" behavior of the settings panel. It was causing some issue with others extensions. 

## Minor changes & fixes in 2.0.7

- [x] Fix : small fix

## Minor changes & fixes in 2.0.5

- [x] Fix for menu and quicksettings size. Should be more consistent now, but still buggy with too many quicksettings.

## Minor changes & fixes in 2.0.4

- [x] Simplify extra network cards/thumb display - should work better. I know that a lots of work still remain to be done on this part but code need a cleanup before.

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
