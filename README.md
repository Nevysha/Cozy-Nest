# Nevysha's Cozy Nest

_Find your cozy spot on Auto1111's webui_

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G2L55CD)

**![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) WARNING : This extension has been renamed to Cozy Nest to avoid confusion with an other tool. If you had installed it through the old repo URL, please update to the latest version by following [these instructions](https://github.com/Nevysha/Cozy-Nest/wiki/How-to-switch-to-renamed-repository-Cozy-Nest)**

![](https://nevysha.art/wp-content/uploads/2023/01/nevy-icon-1-256-round.png)

Cozy Nest is a UI extension for Automatic's sd-webui. Inspired by [anapnoe](https://github.com/anapnoe/stable-diffusion-webui-ux)'s work

**![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) I won't support mobile usage. Although you can use Cozy Nest on your desktop and add `CozyNest=No` in the URL when using webui from your mobile.**

Tested in Chrome, should work in Firefox with minor bug. I plan to fix it later. 

User reported that it works on Vlad's fork of sd-webui, although I haven't tested it myself.

Features:
- [x]  Resizable panels
- [x]  Full Screen Inpainting
- [x]  Customizable tab menu position (top, left, centered)
- [x]  Cozy look with dark or light theme (add `?__theme=light` in url or set `--theme=light` in Auto1111 start arguments to switch to light theme)
- [x]  Bypass Cozy Nest by adding `CozyNest=No` in URL param (ie: http://localhost:8501/?CozyNest=No) - useful for mobile
- [x]  Save resize bar position / panel ratio in local storage
- [x]  Customize accent color
- [x]  Add or remove accent to the generate buttons
- [x]  Customize font size
- [x]  Move settings in a dedicated collapsible and movable tab
- [x]  Smaller bottom padding bar to get a bit more screen space
- [x]  Setting to center the top menu tabs
- [x]  Setting to remove the gap between checkpoint and other quicksetting
- [x]  Setting to center quicksetting
- [x]  Loading screen with estimated percentage based on previous loading time
- [x]  make settings tab movable
- [x]  Extra network in a dedicated tab:
   - [x]  Resizable side panel
   - [x]  Customizable card size
- [x]  Drag and Drop tab button inside or outside a “tab container” to bring them or move them from/out main menu
- [x]  Extra Networks left sided tab.
- [x]  Close Extra Network tab with escape key
- [x]  Fetch version from a desicated json file hosted directly in the repo to an easier view of update of Cozy Nest.

It's made by being a bit hacky on the DOM to tweaks Gradio default features and existing css of Auto1111. It will probably break with each update of auto1111, but I'll try to keep it up to date.


# Installation
1) Open your SD-Webui
2) Goto Extension Tab
3) add Extenion by pasting this URL, since this extension is not public in the repository, yet
   https://github.com/Nevysha/Cozy-Nest

# Looks

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

My roadmap is available here : [Notion Roadmap](https://exclusive-drink-8c5.notion.site/Nevysha-Cozy-Nest-f95f333908f0406f990ed603b424780c).
Please note that this is the draft I use to keep track of suggestions, issue, or idea that I get. I'm not sure I'll implement everything.

Feel free to contribute to this project. I'm sure there are a lot of things that can be improved. 
I'll try to keep this extension up to date with the latest version of auto1111.

# Credits
* [anapnoe](https://github.com/anapnoe/stable-diffusion-webui-ux)'s incredible work on its fork of sd-webui
* [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)'s work on sd-webui
