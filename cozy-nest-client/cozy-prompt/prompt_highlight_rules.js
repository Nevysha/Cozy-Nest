ace.define("ace/mode/prompt_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
  const oop = require("ace/lib/oop");
  const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

  // Define the CustomHighlightRules constructor
  function CustomHighlightRules() {
    // Create an instance of the base TextHighlightRules
    TextHighlightRules.call(this);

    // Define the regex patterns for different token types

    const openBracket = /[\(\[\{]/;
    const closeBracket = /[\)\]\}]/;

    this.$rules = {
      start: [
        { regex: openBracket, token: "open-bracket", next: "inner" },
        { regex: closeBracket, token: "close-bracket", next: "start" },
        { regex: /[,|:]/, token: "token" },
        { regex: /\w+/, token: "text" },
      ],
      inner: [
        { regex: openBracket, token: "open-bracket", next: "inner" },
        { regex: /[,|:]/, token: "token" },
        { regex: /\w+/, token: "inner-bracket" },
        { regex: closeBracket, token: "close-bracket", next: "start" },
      ]
    };
  }

  // Inherit from the base TextHighlightRules
  oop.inherits(CustomHighlightRules, TextHighlightRules);

  // Export the highlight rules
  exports.CustomHighlightRules = CustomHighlightRules;
});
