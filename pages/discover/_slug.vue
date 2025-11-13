<template>
  <main class="landing-page">
    <div class="landing-page__hero mt-40 sm:mt-0">
      <datocms-image
        :data="{ ...heroImage.responsiveImage, alt: heroImage.alt }"
        layout="intrinsic"
        class="landing-page__hero-image w-full h-full object-cover sm:w-auto sm:h-auto sm:mx-auto select-none"
      />
    </div>
    <div
      class="container md:grid md:grid-cols-12 md:gap-30"
      :class="{ 'md:mt-56': marginTop === false, 'mt-56': marginTop === true }"
    >
      <div class="landing-page__text md:col-start-3 md:col-span-8 text-center">
        <datocms-image
          :data="{ ...lineLogo.responsiveImage, alt: lineLogo.alt }"
          object-fit="contain"
          class="landing-page__logo max-w-full mx-auto mb-16 md:mb-24"
        />
        <CollapsibleParagraph
          :title="title"
          :content="description"
          :btn-label="$store.state.common[$i18n.locale].discoverMoreLabel"
        />
      </div>
    </div>
    <div
      class="landing-page__features flex flex-col md:flex-row mt-50 md:mt-80"
    >
      <ProductFeatures
        :items="features[0].items"
        :mobile-background-image="features[0].mobileBackgroundImage"
        :desktop-background-image="features[0].desktopBackgroundImage"
        first
        class="md:flex-1"
      />
      <ProductFeatures
        :items="features[1].items"
        :mobile-background-image="features[1].mobileBackgroundImage"
        :desktop-background-image="features[1].desktopBackgroundImage"
        class="md:flex-1"
      />
    </div>
    <div class="landing-page__products-carousel">
      <Slider
        :title="productsCarousel.title"
        :description="productsCarousel.description"
        :cta-label="productsCarousel.ctaLabel"
        :cta-url="productsCarousel.ctaUrl"
        :items="productsCarousel.items"
      />
    </div>
    <div class="landing-page__recipes-cta">
      <RecipesCta
        :title="recipesCta.title"
        :description="recipesCta.description"
        :img="recipesCta.image"
        :cta-label="recipesCta.ctaLabel"
        :cta-url="recipesCta.ctaUrl"
      />
    </div>
    <div class="landing-page__featured-recipes">
      <Slider
        :title="featuredRecipes.title"
        :description="featuredRecipes.description"
        :items="featuredRecipes.items"
        cover
      />
    </div>
  </main>
</template>
<script>
import ProductFeatures from '@/components/ProductFeatures'
import Slider from '@/components/Slider'
import RecipesCta from '@/components/RecipesCta'
import ApiService from '@/services/api.service'
import { handleSlug } from '@/utils'
import BasePage from '@/components/BasePage'
import { handleAltText, handleSlugLocales } from '~/utils'
import CollapsibleParagraph from '~/components/CollapsibleParagraph'

export default {
  name: 'LineLandingPage',
  components: {
    CollapsibleParagraph,
    ProductFeatures,
    Slider,
    RecipesCta,
  },
  extends: BasePage,
  async asyncData({ app, params, error, store }) {
    const slug = params.slug
    const locale = app.i18n.locale
    const common = store.state.common[locale]
    try {
      // Main page request
      const { productLineLanding } = await ApiService.getLanding(locale, slug)
      if (!productLineLanding) {
        error({
          statusCode: 404,
          message: 'Pagina non trovata',
        })
        return
      }
      const slugLocales = productLineLanding._allSlugLocales
      if (slugLocales && slugLocales.length > 0) {
        await store.dispatch(
          'i18n/setRouteParams',
          handleSlugLocales(slugLocales)
        )
      }
      // Products by line request
      const { allProducts: lineProducts } = await ApiService.getLineProducts(
        locale,
        productLineLanding.featuredLine.id
      )
      // Mapping
      return {
        heroImage: handleAltText(productLineLanding.heroImage),
        lineLogo: handleAltText(productLineLanding.lineLogo),
        title: productLineLanding.title,
        marginTop: productLineLanding.presentationMarginTop,
        description: productLineLanding.description,
        features: productLineLanding.features.map((feature) => ({
          items: feature.items,
          mobileBackgroundImage: handleAltText(feature.mobileBackgroundImage),
          desktopBackgroundImage: handleAltText(feature.desktopBackgroundImage),
        })),
        productsCarousel: {
          title: productLineLanding.carouselTitle,
          description: productLineLanding.carouselDescription,
          ctaLabel: productLineLanding.ctaLabel,
          ctaUrl: handleSlug(
            locale,
            productLineLanding.ctaLink._modelApiKey,
            productLineLanding.ctaLink.slug
          ),
          items: lineProducts.map((product) => ({
            title: product.name,
            image: product.pictures
              ? handleAltText(product.pictures[0].image)
              : '',
            ctaLabel: common.visitProductLabel,
            ctaUrl: handleSlug(locale, 'product', product.slug),
          })),
        },
        recipesCta: {
          title: productLineLanding.recipesTitle,
          description: productLineLanding.recipesDescription,
          image: handleAltText(productLineLanding.recipesImage),
          ctaLabel: productLineLanding.recipesCtaLabel,
          ctaUrl: productLineLanding.recipesProduct
            ? handleSlug(
                locale,
                productLineLanding.recipesProduct._modelApiKey,
                productLineLanding.recipesProduct.slug
              )
            : '',
        },
        featuredRecipes: {
          title: productLineLanding.featuredRecipes.title,
          description: productLineLanding.featuredRecipes.description,
          items: productLineLanding.featuredRecipes.items.map((recipe) => ({
            title: recipe.name,
            image: handleAltText(recipe.picture),
            ctaLabel: common.visitRecipeLabel,
            ctaUrl: handleSlug(locale, 'recipe', recipe.slug),
          })),
        },
        seo: productLineLanding.seo,
      }
    } catch (e) {
      console.log(e)
    }
  },
  nuxtI18n: {
    paths: {
      it: '/scopri/:slug/',
      en: '/discover/:slug/',
    },
  },
}
</script>
<style>
.landing-page {
  &__hero {
    height: 310px;
    @screen sm {
      height: auto;
    }
  }
  &__logo {
    max-height: 115px;
  }
}
</style>
