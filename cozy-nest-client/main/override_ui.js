function override_confirm_clear_prompt() {
  window.confirm_clear_prompt = function (prompt, negative_prompt) {
    prompt = "";
    negative_prompt = "";

    return [prompt, negative_prompt];
  }
}

export const OverrideUiJs = {
  override_confirm_clear_prompt
}