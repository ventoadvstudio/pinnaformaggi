import ApiService from './api.service'

function subRoutes(items, prefixRoutes = {}) {
  const routes = []
  items.forEach((el) => {
    el._allSlugLocales.forEach((el) => {
      const prefix = prefixRoutes[el.locale].join('/')
      if (el.value) {
        routes.push(`/${prefix}/${el.value}/`)
      }
    })
  })
  return routes
}

export function getStaticRoutes() {
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
  return Object.keys(routes)
    .map((key) => [
      `/${routes[key].it.join('/')}/`,
      `/${routes[key].en.join('/')}/`,
    ])
    .reduce((prev, current) => [...prev, ...current], [])
}

export async function getRoutes() {
  const routes = []
  const { allProductLines } = await ApiService.getProductLines('it')
  const { allProductAgings } = await ApiService.getProductAgings('it')
  const { allProductOrigins } = await ApiService.getProductOrigins('it')
  const { allProductLineLandings } = await ApiService.getLandings()
  const { allProducts } = await ApiService.getAllProducts('it')
  const { allRecipes } = await ApiService.getAllRecipes('it')
  const { allRecipeCategories } = await ApiService.getRecipeCategories('it')
  const { allRecipeDishes } = await ApiService.getRecipeDishes('it')
  routes.push(
    ...subRoutes(allProductLines, {
      it: ['it', 'prodotti', 'linee'],
      en: ['en', 'products', 'lines'],
    })
  )
  routes.push(
    ...subRoutes(allProductLineLandings, {
      it: ['it', 'scopri'],
      en: ['en', 'discover'],
    })
  )
  routes.push(
    ...subRoutes(allProductOrigins, {
      it: ['it', 'prodotti', 'origine'],
      en: ['en', 'products', 'origin'],
    })
  )
  routes.push(
    ...subRoutes(allProductAgings, {
      it: ['it', 'prodotti', 'stagionatura'],
      en: ['en', 'products', 'aging'],
    })
  )
  routes.push(
    ...subRoutes(allProducts, {
      it: ['it', 'prodotti'],
      en: ['en', 'products'],
    })
  )
  routes.push(
    ...subRoutes(allRecipes, {
      it: ['it', 'ricette'],
      en: ['en', 'recipes'],
    })
  )
  routes.push(
    ...subRoutes(allRecipeCategories, {
      it: ['it', 'ricette', 'categorie'],
      en: ['en', 'recipes', 'categories'],
    })
  )
  routes.push(
    ...subRoutes(allRecipeDishes, {
      it: ['it', 'ricette', 'pietanze'],
      en: ['en', 'recipes', 'dishes'],
    })
  )

  return routes
}
