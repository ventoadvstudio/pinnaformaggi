<template>
  <main class="products">
    <HeroSecondary
      :title="hero.title"
      :description="hero.description"
      :sub-title="hero.subtitle"
      :background-image="hero.backgroundImage"
      :buttons="hero.categories"
      :discover-more="hero.discoverMore"
      theme="primary"
      next-section-id="featuredProducts"
    />
    <FeaturedProducts id="featuredProducts" :items="featuredProducts" />
  </main>
</template>
<script>
import HeroSecondary from '@/components/HeroSecondary'
import FeaturedProducts from '@/components/FeaturedProducts'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText } from '@/utils'
import BasePage from '@/components/BasePage'

export default {
  name: 'ProductsHomePage',
  components: {
    HeroSecondary,
    FeaturedProducts,
  },
  extends: BasePage,
  async asyncData({ app }) {
    const locale = app.i18n.locale
    const { productsHome } = await ApiService.getProductsHome(locale)
    return {
      hero: {
        title: productsHome.title,
        description: productsHome.description,
        backgroundImage: handleAltText(productsHome.heroImage),
        subtitle: productsHome.subtitle,
        discoverMore: productsHome.discoverMore,
        categories: productsHome.categories.map((category) => ({
          label: category.label,
          image: handleAltText(category.image),
          url: handleSlug(locale, category.link._modelApiKey),
        })),
      },
      featuredProducts: productsHome.featuredProducts.map(
        (featuredProduct) => ({
          img: handleAltText(featuredProduct.image),
          title: featuredProduct.title,
          description: featuredProduct.description,
          buttonLabel: featuredProduct.buttonLabel,
          url: handleSlug(locale, 'product', featuredProduct.link.slug),
        })
      ),
      seo: productsHome.seo,
    }
  },
  data() {
    return {
      featuredProducts: [],
    }
  },
  nuxtI18n: {
    paths: {
      it: '/scopri/prodotti/',
      en: '/discover/products/',
    },
  },
}
</script>
