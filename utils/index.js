export function validateArrayOfObject(keys, data) {
  if (!Array.isArray(data)) return false
  let check = true
  data.forEach((obj) => {
    if (typeof obj !== 'object') {
      check = false
      return
    }
    const keysObj = Object.keys(obj)
    if (!keys.every((el) => keysObj.includes(el))) {
      check = false
    }
  })
  return check
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function validateForm(inputs, models, requiredLabel, invalidEmailLabel) {
  const errors = {}
  inputs.forEach((el) => {
    const value = models[el.id]
    if (el.required && (!value || value.length === 0)) {
      errors[el.id] = requiredLabel
      return
    }
    if (el.type === 'email' && !validateEmail(value)) {
      errors[el.id] = invalidEmailLabel
    }
  })
  return errors
}

export function handleSlug(locale, type, slug) {
  const routes = {
    product: {
      it: ['it', 'prodotti'],
      en: ['en', 'products'],
    },
    line: {
      it: ['it', 'prodotti', 'linee'],
      en: ['en', 'products', 'lines'],
    },
    origin: {
      it: ['it', 'prodotti', 'origine'],
      en: ['en', 'products', 'origin'],
    },
    aging: {
      it: ['it', 'prodotti', 'stagionatura'],
      en: ['en', 'products', 'aging'],
    },
    lineLanding: {
      it: ['it', 'scopri'],
      en: ['en', 'discover'],
    },
    subHomeProducts: {
      it: ['it', 'scopri', 'prodotti'],
      en: ['en', 'discover', 'products'],
    },
    subHomeRecipes: {
      it: ['it', 'scopri', 'ricette'],
      en: ['en', 'discover', 'recipes'],
    },
    recipe: {
      it: ['it', 'ricette'],
      en: ['en', 'recipes'],
    },
    recipeCategory: {
      it: ['it', 'ricette', 'categorie'],
      en: ['en', 'recipes', 'categories'],
    },
    recipeDish: {
      it: ['it', 'ricette', 'pietanze'],
      en: ['en', 'recipes', 'dishes'],
    },
    recipeWizard: {
      it: ['it', 'ricette', 'ricerca-guidata'],
      en: ['en', 'recipes', 'recipes-wizard'],
    },
    recipeWizardResults: {
      it: ['it', 'ricette', 'ricerca-guidata', 'risultati'],
      en: ['en', 'recipes', 'recipes-wizard', 'results'],
    },
    values: {
      it: ['it', 'azienda', 'i-nostri-valori'],
      en: ['en', 'company', 'our-values'],
    },
    story: {
      it: ['it', 'azienda', 'storia'],
      en: ['en', 'company', 'story'],
    },
    contacts: {
      it: ['it', 'contatti'],
      en: ['en', 'contacts'],
    },
    search: {
      it: ['it', 'ricerca'],
      en: ['en', 'search'],
    },
    termsAndConditions: {
      it: ['it', 'termini-e-condizioni'],
      en: ['en', 'terms-and-conditions'],
    },
    privacyPolicy: {
      it: ['it', 'privacy-policy'],
      en: ['en', 'privacy-policy'],
    },
    cookiePolicy: {
      it: ['it', 'cookie-policy'],
      en: ['en', 'cookie-policy'],
    },
  }
  switch (type) {
    case 'product':
      return `/${routes.product[locale].join('/')}/${slug}/`
    case 'products':
    case 'products_page':
      return `/${routes.product[locale].join('/')}/`
    case 'recipes':
    case 'recipes_page':
      return `/${routes.recipe[locale].join('/')}/`
    case 'recipeWizard':
    case 'recipe_wizard':
      return `/${routes.recipeWizard[locale].join('/')}/`
    case 'recipeWizardResults':
    case 'recipe_wizard_results':
      return `/${routes.recipeWizardResults[locale].join('/')}/`
    case 'recipe':
      return `/${routes.recipe[locale].join('/')}/${slug}/`
    case 'recipeCategory':
    case 'recipe_category':
      return `/${routes.recipeCategory[locale].join('/')}/${slug}/`
    case 'recipeDish':
    case 'recipe_dish':
      return `/${routes.recipeDish[locale].join('/')}/${slug}/`
    case 'lineLanding':
    case 'product_line_landing':
      return `/${routes.lineLanding[locale].join('/')}/${slug}/`
    case 'line':
    case 'product_line':
      return `/${routes.line[locale].join('/')}/${slug}/`
    case 'lines':
    case 'lines_page':
      return `/${routes.line[locale].join('/')}/`
    case 'aging':
      return `/${routes.aging[locale].join('/')}/${slug}/`
    case 'agings':
    case 'agings_page':
      return `/${routes.aging[locale].join('/')}/`
    case 'origin':
      return `/${routes.origin[locale].join('/')}/${slug}/`
    case 'origins':
    case 'origins_page':
      return `/${routes.origin[locale].join('/')}/`
    case 'subHomeProducts':
      return `/${routes.subHomeProducts[locale].join('/')}/`
    case 'subHomeRecipes':
      return `/${routes.subHomeRecipes[locale].join('/')}/`
    case 'company_values_page':
    case 'values':
      return `/${routes.values[locale].join('/')}/`
    case 'company_story_page':
    case 'story':
      return `/${routes.story[locale].join('/')}/`
    case 'contacts':
    case 'contacts_page':
      return `/${routes.contacts[locale].join('/')}/`
    case 'search':
      return `/${routes.search[locale].join('/')}/`
    case 'termsAndConditions':
      return `/${routes.termsAndConditions[locale].join('/')}/`
    case 'privacyPolicy':
      return `/${routes.privacyPolicy[locale].join('/')}/`
    case 'cookiePolicy':
      return `/${routes.cookiePolicy[locale].join('/')}/`
  }
}

export function handleSlugLocales(slugLocales) {
  const routeParams = {}
  slugLocales.forEach((slugLocale) => {
    routeParams[slugLocale.locale] = { slug: slugLocale.value }
  })
  return routeParams
}

export function debounce(func, wait = 10, immediate = true) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export function elementInViewport(el) {
  if (!el) return false
  let top = el.offsetTop
  let left = el.offsetLeft
  const width = el.offsetWidth
  const height = el.offsetHeight

  while (el.offsetParent) {
    el = el.offsetParent
    top += el.offsetTop
    left += el.offsetLeft
  }

  return (
    top < window.pageYOffset + window.innerHeight &&
    left < window.pageXOffset + window.innerWidth &&
    top + height > window.pageYOffset &&
    left + width > window.pageXOffset
  )
}

export function handleAltText(img) {
  if (img.url && img.filename && !img.alt) {
    const altText = img.filename.split('.')[0].replace('-', ' ')
    return {
      ...img,
      alt: altText.charAt(0).toUpperCase() + altText.slice(1),
    }
  }
  return img
}

export function chunk(array, chunk = 10) {
  const temp = []
  for (let i = 0, j = array.length; i < j; i += chunk) {
    temp.push(array.slice(i, i + chunk))
  }
  return temp
}

export function makeid(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}
