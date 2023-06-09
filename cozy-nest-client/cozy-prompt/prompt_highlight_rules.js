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
        { regex: /<hypernetwork:/, token: "hypernetwork-begin", next: "hypernetwork" },
        { regex: /<hypernet:/, token: "hypernet-begin", next: "hypernet" },
        { regex: /<lyco:/, token: "lyco-begin", next: "lyco" },
        { regex: /__.+__/, token: "wildcard" },
        { regex: /[,|:]/, token: "token" },
        { regex: /\w+/, token: "text" },
      ],
      // wildcard: [
      //   { regex: '__', token: "wildcard-end", next: "start" },
      //   { regex: /\w+/, token: "wildcard-inner" },
      // ],
      lora: [
        { regex: '>', token: "lora-end", next: "start" },
        { regex: /:\d+(\.\d+)?/, token: "attention" },
        { regex: /\w+/, token: "lora-inner" },
      ],
      hypernetwork: [
        { regex: '>', token: "hypernetwork-end", next: "start" },
        { regex: /:\d+(\.\d+)?/, token: "attention" },
        { regex: /\w+/, token: "hypernetwork-inner" },
      ],
      hypernet: [
        { regex: '>', token: "hypernet-end", next: "start" },
        { regex: /:\d+(\.\d+)?/, token: "attention" },
        { regex: /\w+/, token: "hypernet-inner" },
      ],
      lyco: [
        { regex: '>', token: "lyco-end", next: "start" },
        { regex: /:\d+(\.\d+)?/, token: "attention" },
        { regex: /\w+/, token: "lyco-inner" },
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
        { regex: /:\d+(\.\d+)?/, token: "attention" },
        { regex: /[,|:]/, token: "token" },
        { regex: /__.+__/, token: "wildcard" },
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
