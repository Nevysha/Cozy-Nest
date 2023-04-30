console.log("nevysha-ui.js")

const onload = () => {

  if (typeof gradioApp !== "function") {
    console.log("not ready")
    setTimeout(onload, 2000);
    return
  }


  const quicksettings = gradioApp().getElementById("quicksettings")

  if (!quicksettings) {
    console.log("not ready")
    setTimeout(onload, 2000);
    return
  }

  //add refreshBtn to the top of the page, pulled right
  const refreshBtn = "<button id='refreshBtn' class='nevysha btn refresh'>Refresh UI</button>"
  const flex1 = "<div class='nevysha flex1' />"
  quicksettings.insertAdjacentHTML("beforeend", flex1)
  quicksettings.insertAdjacentHTML("beforeend", refreshBtn)
  document.getElementById("refreshBtn").addEventListener("click", () => {
    gradioApp().querySelector("#extensions_installed_top > button.lg.primary").click()
  })

  //get body from DOM
  const body = document.querySelector("body")

  //remove default body style
  body.style = ""

  //add triple wave div to the end of body for uwuness
  const waves = "<div><div class='wave'></div> <div class='wave'></div><div class='wave'></div></div>"
  body.insertAdjacentHTML('beforeend', waves);

  const tabs = document.querySelectorAll('#tabs > .tabitem')
  //add nevysha css class to each main tab
  tabs.forEach(tab => tab.setAttribute('class', `${tab.getAttribute('class')} nevysha`))

  console.log("nevysha-ui.js: DOMContentLoaded")
};

document.addEventListener("DOMContentLoaded", () => {
  onload();
});