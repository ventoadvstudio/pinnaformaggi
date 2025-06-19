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
  async asyncData({ app, store }) {
    const locale = app.i18n.locale
    const { homepage } = await ApiService.getHome(locale)
    return {
      seo: homepage.seo,
      hero: {
        titleSmall: homepage.titleSmall,
        titleLarge: homepage.titleLarge,
        subTitle: homepage.subtitle,
        description: homepage.description,
        discoverMore: homepage.discoverMore,
        images: homepage.images.map((image) => handleAltText(image)),
        imagesTimeout: homepage.imagesTimeout,
        buttons: [
          {
            label: homepage.heroButtons[0].label,
            to: handleSlug(locale, 'subHomeProducts'),
            background: handleAltText(homepage.heroButtons[0].background),
          },
          {
            label: homepage.heroButtons[1].label,
            to: handleSlug(locale, 'subHomeRecipes'),
            background: handleAltText(homepage.heroButtons[1].background),
          },
        ],
      },
      overlay: [
        {
          label: homepage.overlayProductsLabel,
          to: handleSlug(locale, 'subHomeProducts'),
        },
        {
          label: homepage.overlayRecipesLabel,
          to: handleSlug(locale, 'subHomeRecipes'),
        },
      ],
      posters: homepage.featuredLines.map((entry, index) => ({
        topImg: handleAltText(entry.imagePrimary),
        title: entry.title,
        description: entry.description,
        bottomImg: handleAltText(entry.imageSecondary),
        buttonLabel: entry.ctaLabel,
        url: handleSlug(locale, 'lineLanding', entry.link.slug),
        color: index === 0 ? 'cream' : 'green',
      })),
      recipesSlider: {
        title: homepage.featuredRecipes.title,
        description: homepage.featuredRecipes.description,
        items: homepage.featuredRecipes.items.map((item) => ({
          title: item.name,
          image: handleAltText(item.picture),
          ctaLabel: store.state.common[locale].visitRecipeLabel,
          ctaUrl: handleSlug(locale, 'recipe', item.slug),
        })),
      },
      aboutUs: {
        title: homepage.aboutUsTitle,
        description: homepage.aboutUsDescription,
        image: handleAltText(homepage.aboutUsBackgroundImage),
        ctaLabel: homepage.aboutUsCtaLabel,
        ctaUrl: handleSlug(locale, 'values'),
      },
      productsSlider: {
        title: homepage.featuredProducts.title,
        description: homepage.featuredProducts.description,
        items: homepage.featuredProducts.items.map((item) => ({
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
