import { GraphQLClient } from 'graphql-request'
import 'cross-fetch/polyfill'

// =========================
// Ricettari – nuova pagina
// =========================
const RICETTARI_QUERY = `
  query RicettariPage($locale: SiteLocale) {
    ricettari(locale: $locale) {
      title
      heroBackground {
        responsiveImage(imgixParams: { auto: format, q: 80, fit: crop }) {
          src
          srcSet
          sizes
          width
          height
          alt
          title
          webpSrcSet
          base64
        }
        alt
      }
      # nuovi campi Body
      titlebody
      subtitlebody
      textbody(markdown: false)

      brevoForm
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`

// =========================
// RicettariDownload – pagina "scarica-ricettari"
// =========================
const RICETTARI_DOWNLOAD_QUERY = `
  query RicettariDownloadPage($locale: SiteLocale) {
    ricettaridownload(locale: $locale) {
      hero
      heroBackground {
        responsiveImage(imgixParams: { auto: format, q: 80, fit: crop }) {
          src
          srcSet
          sizes
          width
          height
          alt
          title
          webpSrcSet
          base64
        }
        alt
      }
      titlebody
      subtitlebody
      textbody
gallery: mokupricettari {
  __typename
  ... on RicettariGalleryRecord {
    id
    htmlRicettari
  }
}
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`

export async function getRicettariDownloadPage(locale = 'it') {
  const data = await request({
    query: RICETTARI_DOWNLOAD_QUERY,
    variables: { locale },
  })
  // niente optional chaining per compatibilità con Netlify
  return data && data.ricettaridownload ? data.ricettaridownload : null
}

export async function getRicettariPage(locale = 'it') {
  const data = await request({
    query: RICETTARI_QUERY,
    variables: { locale },
  })
  return data && data.ricettari ? data.ricettari : null
}

// global.Headers = global.Headers || Headers

function request({ query, variables, preview }) {
  const endpoint = preview
    ? `https://graphql.datocms.com/preview`
    : `https://graphql.datocms.com/`
  const token =
    process.env.NUXT_ENV_CMS_DATOCMS_API_TOKEN || process.env.DATOCMS_API_TOKEN // fallback a variabile Netlify

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
      ...(process.env.NUXT_ENV_DATOCMS_ENVIRONMENT && {
        'X-Environment': process.env.NUXT_ENV_DATOCMS_ENVIRONMENT,
      }),
    },
  })
  return client.request(query, variables)
}

function addPagination(page, limit = 100) {
  const skip = limit * page
  return `first: "${limit}", skip: "${skip}"`
}

async function paginatedRequest(key, query) {
  const data = {
    [key]: [],
  }
  let page = 0
  const limit = 100
  let result
  try {
    do {
      result = await request({ query: query(page, limit) })
      data[key].push(...result[key])
      page++
    } while (
      result &&
      Array.isArray(result[key]) &&
      result[key].length === limit
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('paginatedRequest error: ', e)
  }
  return data
}

/* Single instance models */
function getCommon(locale) {
  const query = `
    query Common {
      common(locale: ${locale}) {
        scrollIndicatorLabel
        discoverMoreLabel
        visitProductLabel
        visitRecipeLabel
        ingredientsLabel
        nutritionFactsLabel
        featuredProductTitle
        recipeIntroductionLabel
        watchVideoLabel
        servingsLabel
        methodLabel
        shareRecipeLabel
        relatedProductsTitle
        relatedProductsDescription
        minutesLabel
      }
      _site {
        globalSeo(locale: ${locale}) {
          fallbackSeo {
            description
            title
            image {
              url
              alt
              filename
            }
            twitterCard
          }
          siteName
          titleSuffix
          twitterAccount
          facebookPageUrl
        }
      }
    }
  `
  return request({ query })
}

function getHeader(locale) {
  const query = `
    query Header {
      menu(locale: ${locale}) {
        productsLabel
        recipesLabel
        contactsLabel
        companyLabel
        featuredLines {
          link {
            ... on ProductLineRecord {
              id
              _modelApiKey
              slug
            }
            ... on ProductLineLandingRecord {
              id
              _modelApiKey
              slug
            }
            ... on LinesPageRecord {
              id
              _modelApiKey
            }
            ... on OriginsPageRecord {
              id
              _modelApiKey
            }
            ... on AgingsPageRecord {
              id
              _modelApiKey
            }
            ... on ProductsPageRecord {
              id
              _modelApiKey
            }
          }
          label
        }
        featuredCompanyPages {
          label
          link {
            ... on CompanyStoryPageRecord {
              id
              _modelApiKey
            }
            ... on CompanyValuesPageRecord {
              id
              _modelApiKey
            }
          }
        }
        featuredCategories {
          link {
            ... on RecipeCategoryRecord {
              id
              slug
              _modelApiKey
            }
            ... on RecipeDishRecord {
              id
              _modelApiKey
              slug
            }
            ... on RecipesPageRecord {
              id
              _modelApiKey
            }
            ... on RecipeWizardRecord {
              id
              _modelApiKey
            }
          }
          button
          label
        }
        contactsLink {
          id
        }
      }
    }
  `
  return request({ query })
}

function getHome(locale) {
  const query = `
    query Homepage {
      homepage(locale: ${locale}) {
        titleSmall
        titleLarge
        subtitle
        description(markdown: false)
        discoverMore
        images {
          url
          alt
          filename
          responsiveImage(imgixParams: { w: 1920, fit: crop, auto: format }) {
            srcSet
            src
            width
            height
          }
        }
        imagesTimeout
        heroButtons {
          label
          background {
            url
            alt
            filename
            responsiveImage(imgixParams: { w: 200, fit: crop, auto: format }) {
              src
              srcSet
              width
              height
              alt
              title
            }
          }
        }
        overlayProductsLabel
        overlayRecipesLabel

        featuredLines {
          title
          description
          imagePrimary {
            url
            alt
            filename
            responsiveImage(imgixParams: { w: 600, fit: crop, auto: format }) {
              src
              srcSet
              width
              height
              alt
              title
            }
          }
          imageSecondary {
            url
            alt
            filename
            responsiveImage(imgixParams: { w: 600, fit: crop, auto: format }) {
              src
              srcSet
              width
              height
              alt
              title
            }
          }
          ctaLabel
          link { slug }
        }

        featuredRecipes {
          title
          description
          items {
            ... on RecipeRecord {
              id
              name
              slug
              picture {
                url
                alt
                filename
                responsiveImage(imgixParams: { w: 600, fit: crop }) {
                  srcSet
                  src
                }
              }
            }
          }
        }

        aboutUsTitle
        aboutUsDescription(markdown: false)
        aboutUsCtaLabel
        aboutUsBackgroundImage {
          url
          alt
          filename
        }

        featuredProducts {
          title
          description
          items {
            ... on ProductRecord {
              id
              name
              slug
              pictures {
                image {
                  url
                  alt
                  filename
                  responsiveImage(imgixParams: { w: 600, fit: crop }) {
                    srcSet
                    src
                  }
                }
              }
            }
          }
        }

        seo {
          description
          title
          twitterCard
          image { url alt filename }
        }
      }
    }
  `
  return request({ query })
}

function getProductsHome(locale) {
  const query = `
    query ProductsHome {
      productsHome(locale: ${locale}) {
        title
        description(markdown: false)
        subtitle
        discoverMore
        categories {
          label
          link {
            ... on LinesPageRecord {
              id
              _modelApiKey
            }
            ... on OriginsPageRecord {
              id
              _modelApiKey
            }
            ... on AgingsPageRecord {
              id
              _modelApiKey
            }
            ... on ProductsPageRecord {
              id
              _modelApiKey
            }
          }
          image {
            url
            alt
            filename
          }
        }
        heroImage {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 400, fit: crop}) {
            srcSet
            src
            alt
            title
          }
        }
        featuredProducts {
          title
          description
          buttonLabel
          image {
            url
            alt
            filename
            responsiveImage(imgixParams: {h: 780, fit: clip, auto: format}) {
              src
              alt
              title
              width
              height
            }
          }
          link {
            slug
          }
        }
      }
    }
  `
  return request({ query })
}

function getLinesPage(locale) {
  const query = `
    query LinesPage {
      linesPage(locale: ${locale}) {
        title
        discoverLine
        description
        seo {
          title
          description
          twitterCard
          image {
            url
            alt
            filename
          }
        }
      }
    }
  `
  return request({ query })
}

function getOriginsPage(locale) {
  const query = `
    query OriginsPage {
      originsPage(locale: ${locale}) {
        title
        description
        seo {
          title
          description
          twitterCard
          image {
            url
            alt
            filename
          }
        }
      }
    }
  `
  return request({ query })
}

function getAgingsPage(locale) {
  const query = `
    query AgingsPage {
      agingsPage(locale: ${locale}) {
        title
        description
        seo {
          title
          description
          twitterCard
          image {
            url
            alt
            filename
          }
        }
      }
    }
  `
  return request({ query })
}

function getProductsPage(locale) {
  const query = `
    query ProductsPage {
      productsPage(locale: ${locale}) {
        title
        description
        coverImage {
          url
          alt
          filename
        }
        seoText(markdown: true)
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
      }
    }
  `
  return request({ query })
}

function getRecipesPage(locale) {
  const query = `
    query RecipesPage {
      recipesPage(locale: ${locale}) {
        title
        description
        coverImage {
          url
          alt
          filename
        }
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        seoText(markdown: true)
      }
    }
  `
  return request({ query })
}

function getLanding(locale, slug) {
  const query = `
    query ProductLineLanding {
      productLineLanding(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        heroImage {
          url
          alt
          filename
          responsiveImage(
          imgixParams: { fit: clip, w: 1920, h: 700, auto: format }
          ) {
            src
            srcSet
            width
            height
          }
        }
        lineLogo {
          url
          alt
          filename
          responsiveImage( imgixParams: { fit: clip, w: 200, auto: format } ) {
            src
            srcSet
            width
            height
          }
        }
        presentationMarginTop
        slug
        title
        description(markdown: true)
        featuredLine {
          id
          name
          slug
        }
        features {
          items {
            title
            description(markdown: false)
          }
          mobileBackgroundImage {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 600, fit: clip, auto: format}) {
              srcSet
              src
              width
              height
            }
          }
          desktopBackgroundImage {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 600, fit: clip, auto: format}) {
              srcSet
              src
              width
              height
            }
          }
        }
        carouselTitle
        carouselDescription(markdown: false)
        ctaLabel
        ctaLink {
          _modelApiKey
          slug
        }
        recipesImage {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 600, fit: clip, auto: format}) {
            srcSet
            src
            width
            height
          }
        }
        recipesTitle
        recipesDescription(markdown: false)
        recipesCtaLabel
        recipesProduct {
          _modelApiKey
          slug
        }
        featuredRecipes {
          title
          description
          items {
            slug
            name
            picture {
              url
              alt
              filename
              responsiveImage(imgixParams: {w: 600, fit: crop}) {
                srcSet
                src
              }
            }
          }
        }
        _allSlugLocales {
          locale
          value
        }
        seo {
          title
          twitterCard
          image {
            url
            alt
            filename
          }
          description
        }
      }
    }
  `
  return request({ query })
}

function getRecipeWizard(locale) {
  const query = `
    query RecipeWizard {
      recipeWizard(locale: ${locale}) {
        title
        description
        topImage {
          url
          alt
          filename

          responsiveImage( imgixParams: { fit: clip, w: 600, auto: format } ) {
            src
            width
            height
            alt
            title
          }
        }
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        bottomImage {
          url
          alt
          filename
          responsiveImage( imgixParams: { fit: clip, w: 600, auto: format } ) {
            src
            width
            height
            alt
            title
          }
        }
        typologyLabel
        difficultyLabel
        durationLabel
        startLabel
        backLabel
        submitLabel
        resultsLabel
        quantityLabel
        ctaLabelNewSearch
        typologies {
          id
          name
        }
        difficulties {
          id
          name
        }
        durationIntervals {
          label
          minimum
          maximum
        }
      }
    }
  `
  return request({ query })
}

function getTermsAndConditionsPage(locale) {
  const query = `
    query TermsAndConditions {
      termsAndConditionsPage(locale: ${locale}) {
        body(markdown: true)
        title
        seo {
          description
          title
          twitterCard
          image {
            url
          }
        }
      }
    }
  `
  return request({ query })
}

function getCookiePolicyPage(locale) {
  const query = `
    query CookiePolicy {
      cookiePolicyPage(locale: ${locale}) {
        body(markdown: true)
        title
        scriptCookieBot
        seo {
          description
          title
          twitterCard
          image {
            url
          }
        }
      }
    }
  `
  return request({ query })
}

function getPrivacyPoliciesPage(locale) {
  const query = `
    query PrivacyPolicies {
      privacyPoliciesPage(locale: ${locale}) {
        body(markdown: true)
        title
        seo {
          description
          title
          twitterCard
          image {
            url
          }
        }
      }
    }
  `
  return request({ query })
}

function getCompanyStoryPage(locale) {
  const query = `
    query CompanyStoryPage {
      companyStoryPage(locale: ${locale}) {
        title
        paragraph(markdown: true)
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        hero {
          title
          description
          openLabel
          closeLabel
          backgroundImage {
            url
            alt
            filename
          }
          items {
            ... on ModularSectionRecord {
              _modelApiKey
              content {
                ... on TitleRecord {
                  _modelApiKey
                  content(markdown: true)
                }
                ... on ParagraphRecord {
                  _modelApiKey
                  title
                  content
                }
              }
              images {
                url
                alt
                filename
              }
              inverted
              theme
            }
            ... on TimelineRecord {
              _modelApiKey
              title
              items {
                title
                image {
                  url
                  alt
                  filename
                }
                content {
                  ... on TitleRecord {
                    _modelApiKey
                    content
                  }
                  ... on ParagraphRecord {
                    _modelApiKey
                    title
                    content
                  }
                  ... on ImageRecord {
                    _modelApiKey
                    image {
                      url
                      alt
                      filename
                    }
                  }
                  ... on VideoRecord {
                    _modelApiKey
                    video {
                      url
                      mimeType
                    }
                    thumbnail {
                      url
                      alt
                      filename
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  return request({ query })
}

function getCompanyValuesPage(locale) {
  const query = `
    query CompanyValuesPage {
      companyValuesPage(locale: ${locale}) {
        title
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        hero {
          title
          description
          openLabel
          closeLabel
          backgroundImage {
            url
            alt
            filename
          }
          items {
            ... on ModularSectionRecord {
              _modelApiKey
              content {
                ... on TitleRecord {
                  _modelApiKey
                  content(markdown: true)
                }
                ... on ParagraphRecord {
                  _modelApiKey
                  title
                  content
                }
              }
              images {
                url
                alt
                filename
              }
              inverted
              theme
            }
            ... on TimelineRecord {
              _modelApiKey
              title
              items {
                title
                image {
                  url
                  alt
                  filename
                }
                content {
                  ... on TitleRecord {
                    _modelApiKey
                    content
                  }
                  ... on ParagraphRecord {
                    _modelApiKey
                    title
                    content
                  }
                  ... on ImageRecord {
                    _modelApiKey
                    image {
                      url
                      alt
                      filename
                    }
                  }
                  ... on VideoRecord {
                    _modelApiKey
                    video {
                      url
                      mimeType
                      video {
                        thumbnailUrl
                      }
                    }
                    thumbnail {
                      url
                      alt
                      filename
                    }
                  }
                }
              }
            }
          }
        }
        boxes {
          title
          openLabel
          closeLabel
          backgroundImage {
            url
            alt
            filename
          }
          items {
            ... on ModularSectionRecord {
              _modelApiKey
              content {
                ... on TitleRecord {
                  _modelApiKey
                  content(markdown: true)
                }
                ... on ParagraphRecord {
                  _modelApiKey
                  title
                  content
                }
              }
              images {
                url
                alt
                filename
              }
              inverted
              theme
            }
            ... on TimelineRecord {
              _modelApiKey
              title
              items {
                title
                image {
                  url
                  alt
                  filename
                }
                content {
                  ... on TitleRecord {
                    _modelApiKey
                    content
                  }
                  ... on ParagraphRecord {
                    _modelApiKey
                    title
                    content
                  }
                  ... on ImageRecord {
                    _modelApiKey
                    image {
                      url
                      alt
                      filename
                    }
                  }
                  ... on VideoRecord {
                    _modelApiKey
                    video {
                      url
                      mimeType
                      video {
                        thumbnailUrl
                      }
                    }
                    thumbnail {
                      url
                      alt
                      filename
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  return request({ query })
}

function getContactsPage(locale) {
  const query = `
    query ContactsPage {
      contactsPage(locale: ${locale}) {
        companyLabel
        contactsTitle
        emailLabel
        formDescription(markdown: false)
        formTitle
        messageLabel
        nameLabel
        privateLabel
        privacyPolicyLabel(markdown: true)
        submitLabel
        telephoneLabel
        title
        requiredLabel
        invalidEmailLabel
        thankYouTitle
        thankYouParagraph
        thankYouButtonLabel
        thankYouImage {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 300, fit: clip}) {
            srcSet
            src
          }
        }
        bottomImage {
          url
          alt
          filename
          responsiveImage(
            imgixParams: { fit: clip, w: 1920, auto: format }
          ) {
            srcSet
            src
            width
            height
          }
        }
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
            responsiveImage( imgixParams: { fit: clip, w: 1920, auto: format } ) {
              srcSet
              src
              width
              alt
            }
          }
        }
        contactsImage {
          url
          alt
          filename
          responsiveImage( imgixParams: { fit: clip, w: 1920, auto: format } ) {
            srcSet
            src
            title
            alt
            width
          }
        }
        contactInfo {
          content(markdown: true)
        }
        heroBackground {
          url
          alt
          filename
          responsiveImage( imgixParams: { fit: clip, w: 1920, auto: format } ) {
            srcSet
            src
            width
          }
        }
      }
    }
  `
  return request({ query })
}

/* Multiple instance models */

function getProduct(locale, slug) {
  const query = `
    query Product {
      product(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        id
        name
        pictures {
          image {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 800, fit: crop}) {
              srcSet
              src
              width
              height
            }
          }
        }
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        _allSlugLocales {
          locale
          value
        }
        description(markdown: true)
        tags {
          label
        }
        ingredients(markdown: true)
        extraInfo(markdown: true)
        packagingCarouselTitle
        packagingCarousel {
          title
          image {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 600, fit: crop}) {
              srcSet
              src
            }
          }
        }
        nutritionFactsTitle
        nutritionFactsDescription
        nutritionFactsTable {
          ... on RowRecord {
            _modelApiKey
            label
            value
          }
          ... on DivisorRecord {
            _modelApiKey
          }
        }
        featuredRecipesTitle
        featuredRecipesImage {
          url
          alt
          filename
        }
        questionsAndAnswers {
          question
          answer(markdown: true)
        }
        questionAndAnswersTitle
      }
    }
  `
  return request({ query })
}

function getProductLinePage(locale, slug) {
  const query = `
    query ProductLinePage {
      productLine(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        id
        name
        shortDescription
        image {
          url
          alt
          filename
        }
        seoText(markdown: true)
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return request({ query })
}

function getProductOriginPage(locale, slug) {
  const query = `
    query ProductOriginPage {
      productOrigin(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        id
        name
        shortDescription
        image {
          url
          alt
          filename
        }
        seoText(markdown: true)
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return request({ query })
}

function getProductAgingPage(locale, slug) {
  const query = `
    query ProductAgingPage {
      productAging(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        id
        name
        shortDescription
        image {
          url
          alt
          filename
        }
        seoText(markdown: true)
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return request({ query })
}

function getRecipe(locale, slug) {
  const query = `
    query Recipe {
      recipe(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        id
        name
        _firstPublishedAt
        categories {
          name
          slug
        }
        consigli(markdown: true)
        keywords
        calories
        cuisine
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        _allSlugLocales {
          locale
          value
        }
        picture {
          url
          alt
          filename
          responsiveImage(imgixParams: {fit: clip, w: 600, auto: format}) {
            src
            width
            height
            alt
            title
          }
        }
        description(markdown: true)
        author
        authorType
        effort {
          name
        }
        prepTime
        duration
        featuredProduct {
          id
          name
          slug
          pictures {
            image {
              url
              alt
              filename
              responsiveImage(imgixParams: {fit: clip, w: 300, auto: format}) {
                src
                width
                height
              }
            }
          }
        }
        servings
        ingredients {
          ... on GroupTitleRecord {
            _modelApiKey
            content
          }
          ... on IngredientRecord {
            _modelApiKey
            name
            quantity
            producedByPinna
          }
        }
        recipeMethod {
          ... on GroupTitleRecord {
            _modelApiKey
            content
          }
          ... on RecipeStepRecord {
            _modelApiKey
            content
            images {
              filename
              responsiveImage(imgixParams: {w: 600}) {
                src
                srcSet
                alt
              }
            }
          }
        }
        video {
          url
          mimeType
          video {
            thumbnailUrl
          }
        }
        videotubo
        videoThumbnail {
          url
          alt
          filename
        }
        relatedProducts {
          name
          slug
          tags {
            label
          }
          pictures {
            image {
              url
              alt
              filename
              responsiveImage(imgixParams: {w: 600, fit: clip, auto: format}) {
                src
                width
                height
              }
            }
          }
        }
        relatedRecipesTitle
        relatedRecipes {
          slug
          name
          duration
          picture {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 600, fit: crop}) {
              srcSet
              src
            }
          }
        }
        questionsAndAnswers {
          question
          answer(markdown: true)
        }
        questionAndAnswersTitle
      }
    }
  `
  return request({ query })
}

function getRecipeCategoryPage(locale, slug) {
  const query = `
    query RecipeCategory {
      recipeCategory(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        id
        name
        shortDescription
        image {
          url
          alt
          filename
        }
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        _allSlugLocales {
          locale
          value
        }
        seoText(markdown: true)
      }
    }
  `
  return request({ query })
}

function getRecipeDishPage(locale, slug) {
  const query = `
    query RecipeDish {
      recipeDish(locale: ${locale}, filter: {slug: {eq: "${slug}"}}) {
        id
        name
        shortDescription
        image {
          url
          alt
          filename
        }
          catinterne {
          name
          slug
        }
        seo {
          description
          title
          twitterCard
          image {
            url
            alt
            filename
          }
        }
        _allSlugLocales {
          locale
          value
        }
        seoText(markdown: true)
      }
    }
  `
  return request({ query })
}

/* Paginated multiple instance models */
function getProductLines(locale) {
  const key = 'allProductLines'
  const query = (page, limit) => `
    query ProductLines {
      ${key}(locale: ${locale}, ${addPagination(page, limit)}) {
        id
        slug
        name
        shortDescription
        seoText(markdown: true)
        image {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 600, fit: crop}) {
            srcSet
            src
          }
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getLandings() {
  const key = 'allProductLineLandings'
  const query = (page, limit) => `
    query ProductLineLandings {
      ${key}(${addPagination(page, limit)}) {
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getProductOrigins(locale) {
  const key = 'allProductOrigins'
  const query = (page, limit) => `
    query ProductOrigins {
      ${key}(locale: ${locale}, ${addPagination(page, limit)}) {
        id
        slug
        name
        shortDescription
        seoText(markdown: true)
        image {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 600, fit: crop}) {
            srcSet
            src
          }
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getProductAgings(locale) {
  const key = 'allProductAgings'
  const query = (page, limit) => `
    query ProductAgings {
      ${key}(locale: ${locale}, ${addPagination(page, limit)}) {
        id
        slug
        name
        shortDescription
        seoText(markdown: true)
        image {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 600, fit: crop}) {
            srcSet
            src
          }
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getLineProducts(locale, lineID) {
  const key = 'allProducts'
  const query = (page, limit) => `
    query ProductsByLine {
      ${key}(locale: ${locale}, filter: {lines: {anyIn: ["${lineID}"]}}, ${addPagination(
    page,
    limit
  )}) {
        slug
        name
        pictures {
          image {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 600, fit: crop}) {
              srcSet
              src
            }
          }
        }
        description(markdown: false)
        tags {
          label
        }
        lines {
          id
          slug
          name
        }
        origins {
          id
          slug
          name
        }
        aging {
          id
          slug
          name
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getOriginProducts(locale, originID) {
  const key = 'allProducts'
  const query = (page, limit) => `
    query ProductsByOrigin {
      ${key}(locale: ${locale}, filter: {origins: {anyIn: ["${originID}"]}}, ${addPagination(
    page,
    limit
  )}) {
        slug
        name
        pictures {
          image {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 600, fit: crop}) {
              srcSet
              src
            }
          }
        }
        description(markdown: false)
        tags {
          label
        }
        lines {
          id
          slug
          name
        }
        origins {
          id
          slug
          name
        }
        aging {
          id
          slug
          name
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getAgingProducts(locale, agingID) {
  const key = 'allProducts'
  const query = (page, limit) => `
    query ProductsByAging {
      ${key}(locale: ${locale}, filter: {aging: {eq: "${agingID}"}}, ${addPagination(
    page,
    limit
  )}) {
        slug
        name
        pictures {
          image {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 600, fit: crop}) {
              srcSet
              src
            }
          }
        }
        description(markdown: false)
        tags {
          label
        }
        lines {
          id
          slug
          name
        }
        origins {
          id
          slug
          name
        }
        aging {
          id
          slug
          name
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getAllProducts(locale) {
  const key = 'allProducts'
  const query = (page, limit) => `
    query AllProducts {
      ${key}(locale: ${locale}, ${addPagination(page, limit)}) {
        name
        slug
        pictures {
          image {
            url
            alt
            filename
            responsiveImage(imgixParams: {w: 400, fit: crop}) {
              srcSet
              src
            }
          }
        }
        tags {
          label
        }
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getRecipeCategories(locale) {
  const key = 'allRecipeCategories'
  const query = (page, limit) => `
    query RecipeCategories {
      ${key}(locale: ${locale}, ${addPagination(page, limit)}) {
        name
        slug
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getRecipeDishes(locale) {
  const key = 'allRecipeDishes'
  const query = (page, limit) => `
    query RecipeDishes {
      ${key}(locale: ${locale}, ${addPagination(page, limit)}) {
        name
        slug
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getRecipesByProduct(locale, productID) {
  const key = 'allRecipes'
  const query = (page, limit) => `
    query RecipesByProduct {
      ${key}(locale: ${locale}, filter: {featuredProduct: {eq: "${productID}"}}, ${addPagination(
    page,
    limit
  )}) {
        slug
        name
        duration
        description
        calories
        effort {
          name
        }
        categories {
          name
          slug
        }
        picture {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 600, fit: crop}) {
            srcSet
            src
          }
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getRecipesByCategory(locale, categoryID) {
  const key = 'allRecipes'
  const query = (page, limit) => `
    query RecipesByCategory {
       ${key}(locale: ${locale}, filter: {categories: {anyIn: ["${categoryID}"]}}, ${addPagination(
    page,
    limit
  )}) {
        name
        slug
        duration
        picture {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 400, fit: crop}) {
            srcSet
            src
          }
        }
        prepTime
      }
    }
  `
  return paginatedRequest(key, query)
}

function getRecipesByDish(locale, dishID) {
  const key = 'allRecipes'
  console.log('query recipe dish')
  const query = (page, limit) => `
    query RecipesByCategory {
       ${key}(locale: ${locale}, filter: {dish: {eq: "${dishID}"}}, ${addPagination(
    page,
    limit
  )}) {
        name
        slug
        description
        categories {
          id
          name
        }
        picture {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 400, fit: crop}) {
            srcSet
            src
          }
        }
        duration
        calories
        keywords
        cuisine
        effort {
          id
          name
        }
      }
    }
  `

  return paginatedRequest(key, query)
}

function getAllRecipes(locale) {
  const key = 'allRecipes'
  const query = (page, limit) => `
    query AllRecipes {
      ${key}(locale: ${locale}, ${addPagination(page, limit)}) {
        slug
        name
        picture {
          url
          alt
          filename
          responsiveImage(imgixParams: {w: 400, fit: crop}) {
            srcSet
            src
          }
        }
        duration
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `
  return paginatedRequest(key, query)
}

function getAllRecipesWizard(
  locale,
  typologyID,
  difficultyID,
  durationInterval
) {
  const key = 'allRecipes'
  const [min, max] = durationInterval
  let durationFilter = `duration: {gte: "${min}"`
  if (max) durationFilter += `, lte: "${max}"}`
  else durationFilter += '}'
  const query = (page, limit) => `
    query WizardResults {
       ${key}(locale: ${locale}, filter: {dish: {eq: "${typologyID}"}, effort: {eq: "${difficultyID}"}, ${durationFilter}}, ${addPagination(
    page,
    limit
  )}) {
        name
        slug
        picture {
          url
          alt
          filename
          responsiveImage( imgixParams: { fit: clip, w: 600, auto: format } ) {
            src
            width
            height
            alt
            title
          }
        }
        duration
      }
    }
  `
  return paginatedRequest(key, query)
}

function getRecipesHome(locale) {
  const query = `
    query RecipesHome {
      recipesHome(locale: ${locale}) {
        title
        description(markdown: false)
        subtitle
        discoverMore
        categories {
          label
          link {
            ... on RecipeCategoryRecord {
              id
              name
              slug
              _modelApiKey
            }
            ... on RecipesPageRecord {
              id
              _modelApiKey
            }
          }
          image {
            url
            alt
            filename
          }
        }
        heroImage {
          url
          alt
          filename
        }
      }
    }
  `
  return request({ query })
}

function getFooter(locale) {
  const query = `
    query Footer {
      footer(locale: ${locale}) {
        content(markdown: true)
        contactTitle
        contactParagraph
        contactButtonLabel
        copyright
        termsAndConditionsLabel
        cookiePolicyLabel
        showCookiePolicy
        showTermsAndConditions
        privacyDisclaimerLabel
        socialNetworks {
          logo {
            url
            alt
            filename
          }
          url
        }
      }
    }
  `
  return request({ query })
}

function getRedirects() {
  const query = `
    query Redirects {
      common {
        redirects {
          newPath
          oldPath
          statusCode
        }
        redirects2 {
          newPath
          oldPath
          statusCode
        }
        redirects3 {
          newPath
          oldPath
          statusCode
        }
        redirects4 {
          newPath
          oldPath
          statusCode
        }
        redirects5 {
          newPath
          oldPath
          statusCode
        }
      }
    }
  `
  return request({ query })
}

function getRecipeRatings(recipeId) {
  const query = (page, limit) => `
  query AllRatings {
    allRatings(filter: {recipe: {eq: "${recipeId}"}}, ${addPagination(
    page,
    limit
  )}) {
      value
      recipe {
        id
      }
    }
  }
  `
  return paginatedRequest('allRatings', query)
}

export default {
  getRicettariDownloadPage,
  getRicettariPage,
  getCommon,
  getHeader,
  getHome,
  getCompanyValuesPage,
  getCompanyStoryPage,
  getTermsAndConditionsPage,
  getPrivacyPoliciesPage,
  getProductLines,
  getProductLinePage,
  getProductOriginPage,
  getProductAgingPage,
  getLineProducts,
  getOriginProducts,
  getAgingProducts,
  getProductsHome,
  getProductsPage,
  getProduct,
  getRecipesPage,
  getRecipeWizard,
  getAllRecipesWizard,
  getRecipesByProduct,
  getAllProducts,
  getLinesPage,
  getOriginsPage,
  getAgingsPage,
  getRecipe,
  getAllRecipes,
  getRecipeCategories,
  getRecipesHome,
  getRecipeCategoryPage,
  getRecipesByCategory,
  getRecipeDishPage,
  getRecipesByDish,
  getRecipeDishes,
  getLanding,
  getLandings,
  getProductOrigins,
  getProductAgings,
  getFooter,
  getContactsPage,
  getRedirects,
  getCookiePolicyPage,
  getRecipeRatings,
}
