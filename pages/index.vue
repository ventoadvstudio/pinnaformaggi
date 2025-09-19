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

const safeImg = (img) => (img ? handleAltText(img) : '')

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
    let homepage = null

    // 1) Proviamo a leggere i dati, senza mai lanciare errori
    try {
      const res = await ApiService.getHome(locale)
      homepage = res && res.homepage ? res.homepage : null
    } catch (_) {
      homepage = null
    }

    // 2) Fallback “safe” su tutti i campi
    const images =
      homepage && homepage.images ? homepage.images.map(safeImg) : []
    const heroButtons =
      homepage && homepage.heroButtons ? homepage.heroButtons : []
    const featuredLines =
      homepage && homepage.featuredLines ? homepage.featuredLines : []
    const featuredRecipes =
      homepage && homepage.featuredRecipes
        ? homepage.featuredRecipes
        : { title: '', description: '', items: [] }
    const featuredProducts =
      homepage && homepage.featuredProducts
        ? homepage.featuredProducts
        : { title: '', description: '', items: [] }

    const hero = {
      titleSmall: homepage ? homepage.titleSmall : '',
      titleLarge: homepage ? homepage.titleLarge : '',
      subTitle: homepage ? homepage.subtitle : '',
      description: homepage ? homepage.description : '',
      discoverMore: homepage ? homepage.discoverMore : '',
      images,
      imagesTimeout:
        homepage && homepage.imagesTimeout ? homepage.imagesTimeout : 5000,
      buttons: [
        heroButtons[0]
          ? {
              label: heroButtons[0].label || '',
              to: handleSlug(locale, 'subHomeProducts'),
              background: safeImg(heroButtons[0].background),
            }
          : null,
        heroButtons[1]
          ? {
              label: heroButtons[1].label || '',
              to: handleSlug(locale, 'subHomeRecipes'),
              background: safeImg(heroButtons[1].background),
            }
          : null,
      ].filter(Boolean),
    }

    const overlay = [
      {
        label: homepage ? homepage.overlayProductsLabel || '' : '',
        to: handleSlug(locale, 'subHomeProducts'),
      },
      {
        label: homepage ? homepage.overlayRecipesLabel || '' : '',
        to: handleSlug(locale, 'subHomeRecipes'),
      },
    ]

    const posters = featuredLines.map((entry, index) => ({
      topImg: safeImg(entry.imagePrimary),
      title: entry.title || '',
      description: entry.description || '',
      bottomImg: safeImg(entry.imageSecondary), // <-- invariato
      buttonLabel: entry.ctaLabel || '', // <-- invariato
      url: handleSlug(
        locale,
        'lineLanding',
        entry.link && entry.link.slug ? entry.link.slug : ''
      ),
      color: index === 0 ? 'cream' : 'green',
    }))

    const recipesSlider = {
      title: featuredRecipes.title || '',
      description: featuredRecipes.description || '',
      items: (featuredRecipes.items || []).map((item) => ({
        title: item.name || '',
        image: safeImg(item.picture),
        ctaLabel:
          (store &&
            store.state &&
            store.state.common &&
            store.state.common[locale] &&
            store.state.common[locale].visitRecipeLabel) ||
          '',
        ctaUrl: handleSlug(locale, 'recipe', item.slug || ''),
      })),
    }

    const aboutUs = {
      title: (homepage && homepage.aboutUsTitle) || '',
      description: (homepage && homepage.aboutUsDescription) || '',
      image: safeImg(homepage && homepage.aboutUsBackgroundImage),
      ctaLabel: (homepage && homepage.aboutUsCtaLabel) || '',
      ctaUrl: handleSlug(locale, 'values'),
    }

    const productsSlider = {
      title: featuredProducts.title || '',
      description: featuredProducts.description || '',
      items: (featuredProducts.items || []).map((item) => ({
        title: item.name || '',
        image:
          item && item.pictures && item.pictures[0] && item.pictures[0].image
            ? safeImg(item.pictures[0].image)
            : '',
        ctaLabel:
          (store &&
            store.state &&
            store.state.common &&
            store.state.common[locale] &&
            store.state.common[locale].visitProductLabel) ||
          '',
        ctaUrl: handleSlug(locale, 'product', (item && item.slug) || ''),
      })),
    }

    // 3) Niente error(): in fallback la pagina si genera comunque
    return {
      seo: (homepage && homepage.seo) || null,
      hero,
      overlay,
      posters,
      recipesSlider,
      aboutUs,
      productsSlider,
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
