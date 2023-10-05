**![](https://placehold.co/15x15/f03c15/f03c15.png) COZY NEST IS ON STANDBY UNTIL I MANAGE TO GET MORE FREE TIME TO WORK ON IT. FEEL FREE TO REACH ME ON DISCORD FOR MORE INFO IN THE FUTURE.**

# Nevysha's Cozy Nest

_Find your cozy spot on Auto1111's webui_

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G2L55CD)

![](https://nevysha.art/wp-content/uploads/2023/01/nevy-icon-1-256-round.png)

Cozy Nest is a UI extension for Automatic's sd-webui.

## Compatibility

- From Automatic1111's webui 1.4.0 release.
- SD Next on commit: 3bcca6f9 06/07/2023

- ![](https://placehold.co/15x15/f03c15/f03c15.png) SD Next compatibily is on standby for latest SD.Next version. But I'm in talk with Vlado for a better and deeper integration in SD.Next

## Requirements
Cozy Nest rely on two others popular extensions which HAVE to be installed : 
 - [Tag Complete](https://github.com/DominikDoom/a1111-sd-webui-tagcomplete)
 - [Civitai Helper](https://github.com/butaixianran/Stable-Diffusion-Webui-Civitai-Helper)

## Features:
- [x]  Fully integrated Image Browser. Lots of bugs and missing features. Please be kind with Github issues.
   - [x]  Send to txt2img / img2img / …
   - [x]  Search
   - [x]  Tag your images and filter by tag
   - [x]  Edit exif metadata
   - [x]  Archive, hide or delete images
   - [x]  Optimized web browser memory usage for image not visible (unload them / replace with dummy div)
   - [x]  manage new image generated
   - [x]  Automatically get image output folder (without grid folder)
   - [x]  Drag and drop image
   - [x]  Multithread image indexer for fast startup after first load (~20s for 2150 images on a stock i7-9700K)
- [x]  Dedicated Extra Network component more stable and faster.
  - [x]  Moved in a dedicated right slidable panel 
  - [x]  Compatible with Civitai Helper (and hard requirement to generate civitai.info file)
  - [x]  Search field
  - [x]  NSFW filter
  - [x]  Mark as NSFW
  - [x]  Folder tree view filter (toggleable)
- [x]  Enhanced prompt editor with color (in txt2img and img2img) - It can be disabled through settings
  - [x]  Compatibility with https://github.com/DominikDoom/a1111-sd-webui-tagcomplete (ctrl+space to autocomplete tags in Cozy Prompt)
  - [x]  Synthax color in prompt for wildcard (ie: '\_\_devilkkw/body-1/eyes_iris_colors\_\_')
  - [x]  Synthax color in prompt for attention value (':1.1', ':2.3', ...)
  - [x]  Keybinding to increase or decrease attention value (ctrl+up, ctrl+down)
- [x]  Resizable panels
- [x]  Full Screen Inpainting
- [x]  Enhanced Ui
  - [x]  Customizable tab menu position (top, left, centered)
  - [x]  Closable side panel with esc key
  - [x]  Dark or Light theme through Cozy Nest settings
  - [x]  Save resize bar position / panel ratio in local storage
  - [x]  Customize font color  
  - [x]  Customize accent color
  - [x]  Add or remove accent to the generate buttons
  - [x]  Customize font size
  - [x]  Setting to center the top menu tabs
  - [x]  Setting to remove the gap between checkpoint and other quicksetting
  - [x]  Setting to center quicksetting
  - [x]  Loading screen with estimated percentage based on previous loading time
  - [x]  Drag and Drop tab button inside or outside a “tab container” to bring them or move them from/out main menu
- [x]  Bypass Cozy Nest by adding `CozyNest=No` in URL param (ie: http://localhost:7860/?CozyNest=No) - useful for mobile
- [x]  Fetch version from a dedicated json file hosted directly in the repo to an easier view of update of Cozy Nest.

<hr>

![](https://placehold.co/15x15/f03c15/f03c15.png) **I won't support mobile usage. Although you can use Cozy Nest on your desktop and add `CozyNest=No` in the URL when using webui from your mobile.**

Tested in Chrome, should work in Firefox with minor bug. I plan to fix it later.

## Known Issue

- [ ]  Metadata display in image browser may display "Error parsing metadata"
- [ ]  Partial compatibility with Firefox and Opera GX
- [ ]  Most tweak will not support a live window resize (nor F11 to go fullscreen)

It's made by being a bit hacky on the DOM to tweaks Gradio default features and existing css of Auto1111. It will probably break with each update of auto1111, but I'll try to keep it up to date.


# Installation
1) Open your SD-Webui
2) Goto Extension Tab
3) add Extenion by pasting this URL
   https://github.com/Nevysha/Cozy-Nest

Or search for Cozy Nest in the extension tab 

# Looks

![Screenshot 2023-06-24 154827](https://github.com/Nevysha/Cozy-Nest/assets/122687716/7db13230-6a27-4f16-98fd-3df84e83c8ff)
![Cozy-Prompt-Demo](https://github.com/Nevysha/Cozy-Nest/assets/122687716/af97707e-d686-45bf-a28d-08584a2a067c)
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/chrome-capture-2023-4-2%20(1).png?raw=true)
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/Screenshot%202023-05-03%20100850.png?raw=true)

## Video
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/chrome-capture-2023-4-1.gif?raw=true)
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/chrome-capture-2023-4-2.gif?raw=true)

## Screenshots

### Main look
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/chrome-capture-2023-4-1.png?raw=true)
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/chrome-capture-2023-4-1%20(1).png?raw=true)

### Resizable Panels (txt2img and img2img)
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/chrome-capture-2023-4-2.png?raw=true)

### Full Screen Inpainting
![](https://github.com/Nevysha/Cozy-Nest/blob/main/screenshots/chrome-capture-2023-4-1%20(3).png?raw=true)


# Contribution

Not allowing contribution. Pull Request will be rejected.

# Licence
AGPLv3

Need a specific licence for integration in a commercial project ? 
Contact me on discord.

# Credits
* [DominikDoom](https://github.com/DominikDoom/a1111-sd-webui-tagcomplete) used part of is code to retrieve valid extra networks
* [anapnoe](https://github.com/anapnoe/stable-diffusion-webui-ux)'s incredible work on its fork of sd-webui
* [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)'s work on sd-webui
