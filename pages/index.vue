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
      const { homepage } = await ApiService.getHome(locale)

      // Fallback “safe” se qualche campo manca
      const images = homepage && homepage.images ? homepage.images : []
      const heroButtons =
        homepage && homepage.heroButtons ? homepage.heroButtons : []
      const featuredLines =
        homepage && homepage.featuredLines ? homepage.featuredLines : []
      const featuredRecipes =
        homepage && homepage.featuredRecipes
          ? homepage.featuredRecipes
          : { items: [] }
      const featuredProducts =
        homepage && homepage.featuredProducts
          ? homepage.featuredProducts
          : { items: [] }

      return {
        seo: homepage ? homepage.seo : null,

        hero: {
          titleSmall: homepage ? homepage.titleSmall : '',
          titleLarge: homepage ? homepage.titleLarge : '',
          subTitle: homepage ? homepage.subtitle : '',
          description: homepage ? homepage.description : '',
          discoverMore: homepage ? homepage.discoverMore : '',
          images: images.map((img) => handleAltText(img)),
          imagesTimeout: homepage ? homepage.imagesTimeout : 5000,
          buttons: [
            heroButtons[0]
              ? {
                  label: heroButtons[0].label,
                  to: handleSlug(locale, 'subHomeProducts'),
                  background: handleAltText(heroButtons[0].background),
                }
              : null,
            heroButtons[1]
              ? {
                  label: heroButtons[1].label,
                  to: handleSlug(locale, 'subHomeRecipes'),
                  background: handleAltText(heroButtons[1].background),
                }
              : null,
          ].filter(Boolean),
        },

        overlay: [
          {
            label: homepage ? homepage.overlayProductsLabel : '',
            to: handleSlug(locale, 'subHomeProducts'),
          },
          {
            label: homepage ? homepage.overlayRecipesLabel : '',
            to: handleSlug(locale, 'subHomeRecipes'),
          },
        ],

        // Lasciamo la logica invariata (come prima), con fallback difensivi
        posters: featuredLines.map((entry, index) => ({
          topImg: handleAltText(entry.imagePrimary),
          title: entry.title,
          description: entry.description,
          bottomImg: handleAltText(entry.imageSecondary),
          buttonLabel: entry.ctaLabel,
          // in DatoCMS questo link è la landing della linea (come in origine)
          url: handleSlug(
            locale,
            'lineLanding',
            entry.link ? entry.link.slug : ''
          ),
          color: index === 0 ? 'cream' : 'green',
        })),

        recipesSlider: {
          title: featuredRecipes.title || '',
          description: featuredRecipes.description || '',
          items: (featuredRecipes.items || []).map((item) => ({
            title: item.name,
            image: handleAltText(item.picture),
            ctaLabel: store.state.common[locale].visitRecipeLabel,
            ctaUrl: handleSlug(locale, 'recipe', item.slug),
          })),
        },

        aboutUs: {
          title: homepage ? homepage.aboutUsTitle : '',
          description: homepage ? homepage.aboutUsDescription : '',
          image: handleAltText(
            homepage ? homepage.aboutUsBackgroundImage : null
          ),
          ctaLabel: homepage ? homepage.aboutUsCtaLabel : '',
          ctaUrl: handleSlug(locale, 'values'),
        },

        productsSlider: {
          title: featuredProducts.title || '',
          description: featuredProducts.description || '',
          items: (featuredProducts.items || []).map((item) => ({
            title: item.name,
            image:
              item.pictures && item.pictures.length
                ? handleAltText(item.pictures[0].image)
                : '',
            ctaLabel: store.state.common[locale].visitProductLabel,
            ctaUrl: handleSlug(locale, 'product', item.slug),
          })),
        },
      }
    } catch (e) {
      // se qualcosa va storto evitiamo di stampare query in pagina
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
