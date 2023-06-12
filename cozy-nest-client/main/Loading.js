import {getTheme} from "./cozy-utils.js";
import SimpleTimer from "./SimpleTimer.js";
import {COZY_NEST_GRADIO_LOAD_DURATION} from "./Constants.js";
import {waves, loading_ellipsis} from "./svg.js";
import {applyAccentColor, applyBgGradiantColor, applyWavesColor, applyFontColor} from "./tweaks/various-tweaks.js";

export default class Loading {

  static _instance = null;

  static start() {
    if (!Loading._instance) {
      Loading._instance = new Loading();
    }
    Loading._instance.pushLoading();
    Loading._instance.setupObserver();
  }
  static stop() {
    if (Loading._instance) {
      Loading._instance.observer.disconnect();
    }

    document.querySelector("#nevysha-loading-wrap").remove();
  }

  constructor() {
    this.observer = null;
  }

  setupObserver() {
    // Create a new observer instance
    let step = 0;
    //get last loaded time. If null or zero, set it to 15000ms
    //since last update, I have to click on extra network button to load the HTML. That's why I add 2000ms (:
    //the clean way would be to set a small timeout before removing the mutation observer but, eh, I'm lazy atm
    const lastLoadingTimeSaved = SimpleTimer.last(COZY_NEST_GRADIO_LOAD_DURATION) + 2000
    const lastLoadingTime = lastLoadingTimeSaved ? lastLoadingTimeSaved : 15000
    //observer to update loading percentage
    this.observer = new MutationObserver((mutations) => {
      if (mutations[0].target.id !== 'loading_step_estimator') {

        //current elapsed loading time
        const currentLoadingTime = SimpleTimer.get(COZY_NEST_GRADIO_LOAD_DURATION)

        if (currentLoadingTime < lastLoadingTime + 1000) {
          //estimate the percentage of loading. Never go above 99%
          const percentage = Math.min(Math.round((currentLoadingTime / lastLoadingTime) * 100), 99)

          document.querySelector("#loading_step_estimator").innerText = `${percentage}%`
        }
        else {
          document.querySelector("#loading_step_estimator").innerText = `Woops, it's taking longer than expected...`
        }

        this.pushLoading();
      }
    });

    // Configure the observer to watch for changes to the body element and its descendants
    const config = { attributes: true, childList: true, subtree: true };
    this.observer.observe(document.body, config);
  }

  /**
   * add a full screen div hiding while the app is loading
   */
  pushLoading() {
    if (document.querySelector('#nevysha-loading')) return

    const maybeLightThemeClass = getTheme() === "light" ? "nevysha-light" : ""

    const loading =
      `<div id='nevysha-loading-wrap' class='nevysha ${maybeLightThemeClass}'>
          <div id='nevysha-loading' class='nevysha'>
            <div class="nevysha-loading-progress">
              <div class="nevysha-cozy-nest-app-name animate__animated animate__backInLeft">
                  Cozy Nest
              </div>
              ${loading_ellipsis}
              <div id="loading_step_estimator" class="subtext3 animate__animated animate__pulse animate__infinite">
                1
              </div>
              <div class="subtext1 animate__animated animate__pulse animate__infinite">
                  Loading The Magic
              </div>
              <div class="subtext2 animate__animated animate__pulse animate__infinite">
                (and gradio)
              </div>
            </div>
            ${waves}
            <div class="footer">Made by Nevysha with <span class="heart">❤</span> and <span class="coffee">☕</span></div>
          </div>
        </div>`
    document.querySelector('body').insertAdjacentHTML('beforeend', loading);

    //get config from local storage COZY_NEST_CONFIG
    let config = JSON.parse(localStorage.getItem("COZY_NEST_CONFIG"))
    //merge with dummy config to avoid warning
    config = {...{waves_color: "#ffffff", bg_gradiant_color: "#ffffff", accent_color: "#ffffff", font_color:"#ffffff", font_color_light:"#000000"}, ...config}

    applyWavesColor(config.waves_color)
    applyBgGradiantColor(config.bg_gradiant_color);
    applyAccentColor(config.accent_color, config.accent_color);
    applyFontColor(getTheme() === "light" ? config.font_color_light : config.font_color);
  }

}