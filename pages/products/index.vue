<template>
  <main class="products-page pb-152 pb-80">
    <SectionCoverCTA
      :title="title"
      :description="description"
      :img="coverImage"
      :headband="false"
      :margin-head="true"
    />
    <ProductGrid :items="products" />
    <div class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-60 md:mt-180">
      <div
        class="products-page__text markdown text-14 md:text-16 text-gray-500 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
        v-html="sanitizedSeoText"
      ></div>
    </div>
  </main>
</template>
<script>
import SectionCoverCTA from '@/components/SectionCoverCTA'
import ProductGrid from '@/components/ProductGrid'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText } from '@/utils'
import BasePage from '@/components/BasePage'

export default {
  components: {
    SectionCoverCTA,
    ProductGrid,
  },
  nuxtI18n: {
    paths: {
      it: '/prodotti/',
      en: '/products/',
    },
  },
  extends: BasePage,
  async asyncData({ app, store }) {
    const locale = app.i18n.locale
    const { productsPage } = await ApiService.getProductsPage(locale)
    const { allProducts } = await ApiService.getAllProducts(locale)
    return {
      title: productsPage.title,
      description: productsPage.description,
      coverImage: handleAltText(productsPage.coverImage),
      products: allProducts
        ? allProducts.map((product) => ({
            img:
              product.pictures && product.pictures[0]
                ? handleAltText(product.pictures[0].image)
                : '',
            title: product.name,
            ctaLabel: store.state.common[locale].discoverMoreLabel,
            tags: product.tags.map((tag) => tag.label),
            ctaUrl: handleSlug(locale, 'product', product.slug),
          }))
        : [],
      seoText: productsPage.seoText,
      seo: productsPage.seo,
    }
  },
  data() {
    return {
      title: '',
      description: '',
      coverImage: '',
      products: [],
      seoText: '',
    }
  },
  computed: {
    sanitizedSeoText() {
      return this.$sanitize(this.seoText)
    },
  },
}
</script>
