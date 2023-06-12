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

    let bracketLevel = 0;

    this.$rules = {
      start: [
        {
          token: () => {
            bracketLevel++;
            return `open-bracket.open-bracket-${(bracketLevel) % 4}`;
          },
          next: "inner",
          regex: openBracket
        },
        {
          token: () => {
            bracketLevel--;
            return `close-bracket.close-bracket-${(bracketLevel+1) % 4}`;
          },
          regex: closeBracket,
          next: "start"
        },
        { regex: /<lora:/, token: "lora-begin", next: "lora" },
        { regex: /[,|:]/, token: "token" },
        { regex: /\w+/, token: "text" },
      ],
      lora: [
        { regex: '>', token: "lora-end", next: "start" },
        { regex: /\w+/, token: "lora-inner" },
      ],
      inner: [
        {
          token: () => {
            bracketLevel++;
            return `open-bracket.open-bracket-${(bracketLevel) % 4}`;
          },
          regex: openBracket,
          next: "inner"
        },
        { regex: /[,|:]/, token: "token" },
        { regex: /\w+/, token: "inner-bracket" },
        {
          token: () => {
            bracketLevel--;
            return `close-bracket.close-bracket-${(bracketLevel+1) % 4}`;
          },
          regex: closeBracket,
          next: "start"
        },
      ]
    };
  }

  // Inherit from the base TextHighlightRules
  oop.inherits(CustomHighlightRules, TextHighlightRules);

  // Export the highlight rules
  exports.CustomHighlightRules = CustomHighlightRules;
});
