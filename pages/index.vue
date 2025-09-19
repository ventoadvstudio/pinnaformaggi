<template>
  <main class="home">
    <Hero
      id="hero"
      :title-small="hero.titleSmall"
      :title-large="hero.titleLarge"
      :sub-title="hero.subTitle"
      :description="hero.description"
      :images="hero.images"
      :images-timeout="hero.imagesTimeout"
      :buttons="hero.buttons"
      :discover-more="hero.discoverMore"
      next-section-id="posters"
    />

    <Posters id="posters" :items="posters" />

    <Slider
      :title="recipesSlider.title"
      :description="recipesSlider.description"
      :items="recipesSlider.items"
      :items-per-group="3"
      :initial-slide="3"
      cover
    />

    <ImageSection
      :title="aboutUs.title"
      :description="aboutUs.description"
      :img="aboutUs.image"
      :cta-label="aboutUs.ctaLabel"
      :cta-url="aboutUs.ctaUrl"
    />

    <Slider
      :title="productsSlider.title"
      :description="productsSlider.description"
      :items="productsSlider.items"
      :items-per-group="3"
    />

    <CtaOverlay :buttons="overlay" />
  </main>
</template>

<script>
import Hero from '@/components/Hero'
import Posters from '@/components/Posters'
import Slider from '@/components/Slider'
import ImageSection from '@/components/ImageSection'
import CtaOverlay from '@/components/CtaOverlay'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText } from '@/utils'
import BasePage from '@/components/BasePage'

export default {
  name: 'Index',
  components: {
    ImageSection,
    Hero,
    Posters,
    Slider,
    CtaOverlay,
  },
  extends: BasePage,

  async asyncData({ app, store, error }) {
    try {
      const locale = app.i18n.locale
      const res = await ApiService.getHome(locale)
      const homepage = res && res.homepage ? res.homepage : null
      if (!homepage) {
        throw new Error('Homepage non trovata')
      }

      // helper lato pagina: restituisce sempre stringa/oggetto valido
      const safeImg = (img) => (img ? handleAltText(img) : '')

      // Etichette comuni senza optional chaining
      const commonDict =
        store && store.state && store.state.common && store.state.common[locale]
          ? store.state.common[locale]
          : {}

      // --- HERO -------------------------------------------------------------
      const images = Array.isArray(homepage.images)
        ? homepage.images.map(safeImg)
        : []

      const heroButtonsSrc = Array.isArray(homepage.heroButtons)
        ? homepage.heroButtons
        : []

      const btn0src = heroButtonsSrc[0] || {}
      const btn1src = heroButtonsSrc[1] || {}

      const hero = {
        titleSmall: homepage.titleSmall || '',
        titleLarge: homepage.titleLarge || '',
        subTitle: homepage.subtitle || '',
        description: homepage.description || '',
        discoverMore: homepage.discoverMore || '',
        images,
        imagesTimeout: homepage.imagesTimeout || 5000,
        // IMPORTANTISSIMO: forniamo SEMPRE due oggetti, mai undefined
        buttons: [
          {
            label: btn0src.label || '',
            to: handleSlug(locale, 'subHomeProducts'),
            background: safeImg(btn0src.background),
          },
          {
            label: btn1src.label || '',
            to: handleSlug(locale, 'subHomeRecipes'),
            background: safeImg(btn1src.background),
          },
        ],
      }

      // --- OVERLAY ----------------------------------------------------------
      const overlay = [
        {
          label: homepage.overlayProductsLabel || '',
          to: handleSlug(locale, 'subHomeProducts'),
        },
        {
          label: homepage.overlayRecipesLabel || '',
          to: handleSlug(locale, 'subHomeRecipes'),
        },
      ]

      // --- POSTERS (featuredLines) -----------------------------------------
      const posters = Array.isArray(homepage.featuredLines)
        ? homepage.featuredLines.map((entry, index) => ({
            topImg: safeImg(entry && entry.imagePrimary),
            title: (entry && entry.title) || '',
            description: (entry && entry.description) || '',
            bottomImg: safeImg(entry && entry.imageSecondary),
            buttonLabel: (entry && entry.ctaLabel) || '',
            // la query di getHome espone link { slug } per la landing
            url: handleSlug(
              locale,
              'lineLanding',
              entry && entry.link ? entry.link.slug : ''
            ),
            color: index === 0 ? 'cream' : 'green',
          }))
        : []

      // --- RECIPES SLIDER ---------------------------------------------------
      const recipesBlock = homepage.featuredRecipes || {}
      const recipesSlider = {
        title: recipesBlock.title || '',
        description: recipesBlock.description || '',
        items: Array.isArray(recipesBlock.items)
          ? recipesBlock.items.map((item) => ({
              title: (item && item.name) || '',
              image: safeImg(item && item.picture),
              ctaLabel: commonDict.visitRecipeLabel || '',
              ctaUrl: handleSlug(
                locale,
                'recipe',
                item && item.slug ? item.slug : ''
              ),
            }))
          : [],
      }

      // --- IMAGE SECTION (About Us) ----------------------------------------
      const aboutUs = {
        title: homepage.aboutUsTitle || '',
        description: homepage.aboutUsDescription || '',
        image: safeImg(homepage.aboutUsBackgroundImage),
        ctaLabel: homepage.aboutUsCtaLabel || '',
        ctaUrl: handleSlug(locale, 'values'),
      }

      // --- PRODUCTS SLIDER --------------------------------------------------
      const productsBlock = homepage.featuredProducts || {}
      const productsSlider = {
        title: productsBlock.title || '',
        description: productsBlock.description || '',
        items: Array.isArray(productsBlock.items)
          ? productsBlock.items.map((item) => ({
              title: (item && item.name) || '',
              image:
                item &&
                item.pictures &&
                item.pictures.length &&
                item.pictures[0] &&
                item.pictures[0].image
                  ? safeImg(item.pictures[0].image)
                  : '',
              ctaLabel: commonDict.visitProductLabel || '',
              ctaUrl: handleSlug(
                locale,
                'product',
                item && item.slug ? item.slug : ''
              ),
            }))
          : [],
      }

      return {
        seo: homepage.seo,
        hero,
        overlay,
        posters,
        recipesSlider,
        aboutUs,
        productsSlider,
      }
    } catch (e) {
      // messaggio chiaro per nuxt generate / netlify
      error({
        statusCode: 500,
        message: 'Errore nel caricamento della homepage',
      })
    }
  },

  data() {
    return {
      hero: {},
      overlay: [],
      posters: [],
      recipesSlider: {},
      aboutUs: {},
      productsSlider: {},
    }
  },
}
</script>
