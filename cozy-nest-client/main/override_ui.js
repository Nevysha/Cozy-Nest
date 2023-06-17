export function overrideUiJs() {

  window.confirm_clear_prompt = function (prompt, negative_prompt) {
    prompt = "";
    negative_prompt = "";

    return [prompt, negative_prompt];
  }

}