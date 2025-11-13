const CALLBACK_NAME = 'datoCmsCallback'

function init() {
  if (window) {
    let initialized = !!window.DatoCmsSearch
    let resolveInitPromise
    let rejectInitPromise
    // This promise handles the initialization
    // status of the DatoCMS script.
    const initPromise = new Promise((resolve, reject) => {
      resolveInitPromise = resolve
      rejectInitPromise = reject
    })
    // If DatoCMS already is initialized
    // the `initPromise` should get resolved
    // eventually.
    if (initialized) return initPromise

    initialized = true
    // The callback function is called by
    // the DatoCMS script if it is
    // successfully loaded.
    window[CALLBACK_NAME] = () => {
      window.DatoCmsSearchClient = new window.DatoCmsSearch(
        process.env.NUXT_ENV_CMS_DATOCMS_API_TOKEN,
        'production'
      )
      resolveInitPromise(window.DatoCmsSearch)
    }

    // We inject a new script tag into
    // the `<head>` of our HTML to load
    // the DatoCMS script script.
    const script = document.createElement('script')
    script.src = `https://unpkg.com/datocms-search@0.1.8/dist/datocms-search.base.js`
    script.onerror = rejectInitPromise
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (
          script.readyState === 'loaded' ||
          script.readyState === 'complete'
        ) {
          script.onreadystatechange = null
          window[CALLBACK_NAME]()
        }
      }
    } else {
      script.onload = window[CALLBACK_NAME]
    }
    const head = document.querySelector('head')
    head.appendChild(script)

    return initPromise
  }
}

export default init
