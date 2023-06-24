ace.define("ace/mode/prompt", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text"], function (require, exports, module) {
  const oop = require("ace/lib/oop");
  const TextMode = require("ace/mode/text").Mode;
  const CustomHighlightRules = require("ace/mode/prompt_highlight_rules").CustomHighlightRules;

  // Define the CustomMode constructor
  function CustomMode() {
    this.HighlightRules = CustomHighlightRules;
  }

  // Inherit from the base TextMode
  oop.inherits(CustomMode, TextMode);

  // Set the mode's name
  CustomMode.prototype.$id = "ace/mode/prompt";

  (function() {
  }).call(CustomMode.prototype);

  // Export the mode
  exports.Mode = CustomMode;
});