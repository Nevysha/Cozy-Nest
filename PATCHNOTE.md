## Minor changes in 1.2.3
- [x]  Fix selected image border color when generating multiple images
- [x]  Fix right arrow hidden by "Extra Network" button in full screen img view
- [x]  Add external lib into the Cozy Nest extension folder
- [x]  Fix download image link not visible
- [x]  Hide the 'x' button on fullscreen inpainting

## New features in 1.2.0

- [x]  Bypass Cozy Nest by adding `CozyNest=No` in URL param (ie: http://localhost:8501/?CozyNest=No) - useful for mobile
- [x]  Close Extra Network tab with escape key
- [x]  Drag and Drop tab button inside or outside a “tab container” to bring them or move them from/out main menu
- [x]  add a btn "Extra Networks" like the "vertical close" on the same place of the "close”
- [x]  Fetch version from a desicated json file hosted directly in the repo. This file should contains version number as well as feature list. As it’s from github there is no risk of tracking from me.
- [x]  Put settings panel button of prompt pan always under positive/negative prompt
- [x]  Add small accent color to the selected Main Menu
- [x]  Added a link to my Ko-Fi page :3

## Issues fixed

- [x]  Show/Hide Generation Info broken on img2img
- [x]  Setting not effective during loading

## Known Issue

- [ ]  Partial compatibility with Firefox and Opera GX
- [ ]  Most tweak will not support a live window resize
- [ ]  Some user report a missing scrollbar in Extra network tab
- [ ]  Some user report an issue when having to many script "block" in txt2img or img2img
- [ ]  If setting are saved and user refresh, it will revert to old setting (only visually) because webui load them at gradio launch]
