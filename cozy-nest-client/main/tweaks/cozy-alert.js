let alertDiv;
let alertTitle;
let alertMsg;
export function createAlertDiv() {
  const dialogHtml =
    `
    <div id="cozy-alert-wrap" title="🥺 Woops - Cozy Nest Error ?" style="display:none;">
        <div>
          <div class="header">
            <h1 id="cozy-alert-title"></h1>
          </div>
          <p id="cozy-alert-msg"></p>
          <button class="lg primary gradio-button svelte-1ipelgc nevysha" id="cozy-alert-close">Close</button>
        </div>
    </div>
    `
  document.querySelector('body').insertAdjacentHTML('beforeend', dialogHtml);
  alertDiv = document.querySelector('#cozy-alert-wrap');
  alertTitle = document.querySelector('#cozy-alert-title');
  alertMsg = document.querySelector('#cozy-alert-msg');
  document.querySelector('#cozy-alert-close').addEventListener('click', () => {
    alertDiv.setAttribute('style', 'display: none;');
  });
}

export function showAlert(title, msg) {
  alertTitle.innerHTML = title;
  alertMsg.innerHTML = msg;
  alertDiv.setAttribute('style', 'display: flex;');
}
window.showAlert = showAlert;