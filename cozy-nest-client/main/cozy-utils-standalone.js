export const hasCozyNestNo = () => {
  //check if the param CozyNest=No is present in the url
  const urlParams = new URLSearchParams(window.location.search);
  const cozyNestParam = urlParams.get('CozyNest');
  //if the param is present and set to No,
  // or if url contains #CozyNest=No
  // disable Cozy Nest
  if (cozyNestParam === "No" || window.location.hash.includes("CozyNest=No")) {
    console.log("Cozy Nest disabled by url param")
    //remove the css with Cozy-Nest in the url
    document.querySelectorAll('link').forEach(link => {
      if (link.href.includes("Cozy-Nest")) link.remove()
    })
    return true;
  }
  return false;
}

export const isDevMode = () => {
  if (window.location.href.includes("cozy-nest-client")) {
    console.log("CozyNest: extension loader in dev mode")
    return true;
  }
  return false;
}

window.CozyUtils = {
  hasCozyNestNo,
  isDevMode
}