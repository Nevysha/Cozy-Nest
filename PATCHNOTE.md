## Compatibility

- Automatic1111's webui 1.3.2 release.
- SD Next (Vlad's fork) Version: 4867dafa Fri Jun 23. (Not compatible with latest!)

## Minor changes & fixes in 2.4.3
- [x]  fix CozyNest=No not properly disabling stylesheets injection
- [x]  Lots of fixes for SD Next compatibility

## Minor changes & fixes in 2.4.2
- [x]  Sort folder tree by name
- [x]  Allow for preview in those format '.png', '.jpg', '.jpeg', '.webp' (it will take the most recent available)
- [x]  Choose between full or deferred loading for Extra Network (default to full as you need a LOT of items to see a difference)
- [x]  Small bug fix

## Minor changes & fixes in 2.4.1
- [x]  Small various fix

## New features in 2.4.0
- [x]  Dedicated Extra Network component more stable and faster.
  - [x]  Compatible with Civitai Helper (and hard requirement to generate civitai.info file)
  - [x]  Search field
  - [x]  NSFW filter
  - [x]  Mark as NSFW
  - [x]  Folder tree view (toggleable)
- [x]  Multithread image indexer for image browser

## Minor changes & fixes in 2.3.4
- [x]  Compatibility with https://github.com/DominikDoom/a1111-sd-webui-tagcomplete (ctrl+space to autocomplete tags in Cozy Prompt)
- [x]  Synthax color in prompt for wildcard (ie: '\_\_devilkkw/body-1/eyes_iris_colors\_\_')
- [x]  Synthax color in prompt for attention value (':1.1', ':2.3', ...)
- [x]  Keybinding to increase or decrease attention value (ctrl+up, ctrl+down)

## Minor changes & fixes in 2.3.3
- [x]  Do not preload Extra Network tab but wait for a user click

## Minor changes & fixes in 2.3.2
- [x]  Fix Cozy Prompt for SD.Next compatibility

## Minor changes & fixes in 2.3.1
- [x]  May work in SD.Next. Cozy Prompt is disabled in SD.Next.

## New features in 2.3.0
- [x]  Civitai Helper and its 4 button on thumbnails should work properly.
- [x]  Add a "clear" button to extras gallery
- [x]  press escape key to close right panels
- [x]  Color mode (light, dark) from Cozy Nest settings
- [x]  Add clear button in prompt
- [x]  Customize caret size for prompt
- [x]  Color for lycoris and hypernetworks in prompt
- [x]  Move prompt tools button ("redo last prompt", ...)
- [x]  Add a secondary accent color in settings, applied to some elements (open scripts...)
- [x]  Reworked a lots of padding for a cleaner and more compact view
