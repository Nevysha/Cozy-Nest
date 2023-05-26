import $ from "jquery";

export function setupPopupInstanceInfo() {
  const dialogHtml =
    `
    <div id="dialog-message-wrap" title="🥺 Woops - Cozy Nest Error ?" style="display:none;">
      <div id="dialog-message">
        <div class="header">
          <h1>🥺 Woops - Cozy Nest Error ?</h1>
          <button class="lg primary gradio-button svelte-1ipelgc nevysha" onClick="hideInstanceInfoDialog();return false;">Close</button>
        </div>
        
        <p class="cozynest-error-tips">Want to report an issue ? Screenshot me and post me on <a href="https://github.com/Nevysha/Cozy-Nest">Github</a></p>
        <fieldset>
          <legend>Instance info</legend>
          <div class="versions cozyerror" id="cozynest-error-instance-info"></div>
        </fieldset>
        <fieldset class="extensions-list">
          <legend>Extensions</legend>
          <div class="cozyerror" id="cozynest-error-extentions"></div>
        </fieldset>
        <div id="cozy_nest_error_handling_display"></div>
        <div id="cozy_nest_error_handling_display_stack" /></div>
      </div>
    </div>
    `
  document.querySelector('body').insertAdjacentHTML('beforeend', dialogHtml);
}

export function populateInstanceInfoDialog() {
  ///reset those
  document.querySelector('#cozy_nest_error_handling_display').innerHTML = '';
  document.querySelector('#cozy_nest_error_handling_display_stack').innerHTML = '';
  document.querySelector('#cozy_nest_error_handling_display_stack').setAttribute('style', 'display: none;');

  //gather instance info
  document.querySelector('#cozynest-error-instance-info').innerHTML = document.querySelector('.versions').innerHTML
    //add browser info
    + `<br><br>Browser: <span>${navigator.userAgent}</span>`
    //add window size
    + `<br><br>Window size: <span>${window.innerWidth}x${window.innerHeight}</span>`
    //add webui
    + `<br><br>WebUI: <span>${COZY_NEST_CONFIG.webui}</span>`
  document.querySelector('#cozynest-error-extentions').innerHTML = document.querySelector('#tabs_extensions').querySelector('#extensions').parentElement.innerHTML;
  //for each tab row, check the first td input and hide the row if it's not checked
  document.querySelector('#cozynest-error-extentions > table').querySelectorAll('tr').forEach(row => {
    if (!row.querySelector('td')) return;

    let checkbox = row.querySelector('td').querySelector('label > input');
    if (!checkbox) {
      //Vlad's fork
      checkbox = row.querySelector('td').querySelector('input')
      row.querySelector('button')?.setAttribute('disabled', 'disabled')
    }

    if (!checkbox.checked) {
      row.setAttribute('style', 'display: none;')
    }
    //disable input
    else {
      checkbox.setAttribute('disabled', 'disabled')
    }
  })
}

export function showInstanceInfoDialog() {
  $("#dialog-message-wrap").css('display', 'flex');
}
export function hideInstanceInfoDialog() {
  $("#dialog-message-wrap").css('display', 'none');
}
window.hideInstanceInfoDialog = hideInstanceInfoDialog;

/**
 * Called from gradio generated code
 */
export function gatherInfoAndShowDialog() {
  populateInstanceInfoDialog();
  showInstanceInfoDialog();
}
window.gatherInfoAndShowDialog = gatherInfoAndShowDialog;