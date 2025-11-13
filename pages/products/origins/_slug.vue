<template>
  <main class="product-origin-page pb-152 pb-80">
    <SectionCoverSwitch
      :title="sectionCoverSwitch.title"
      :description="sectionCoverSwitch.description"
      :img="sectionCoverSwitch.img"
      :links="sectionCoverSwitch.links"
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
import SectionCoverSwitch from '@/components/SectionCoverSwitch'
import ProductGrid from '@/components/ProductGrid'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText, handleSlugLocales } from '@/utils'
import BasePage from '@/components/BasePage'

export default {
  name: 'OriginPage',
  components: {
    SectionCoverSwitch,
    ProductGrid,
  },
  nuxtI18n: {
    paths: {
      it: '/prodotti/origine/:slug',
      en: '/products/origin/:slug',
    },
  },
  extends: BasePage,
  async asyncData({ app, store, params }) {
    const locale = app.i18n.locale
    const common = store.state.common[locale]
    const { productOrigin } = await ApiService.getProductOriginPage(
      locale,
      params.slug
    )
    const slugLocales = productOrigin._allSlugLocales
    if (slugLocales && slugLocales.length > 0) {
      await store.dispatch(
        'i18n/setRouteParams',
        handleSlugLocales(slugLocales)
      )
    }
    const { allProducts } = await ApiService.getOriginProducts(
      locale,
      productOrigin.id
    )
    const { allProductOrigins } = await ApiService.getProductOrigins(locale)
    return {
      sectionCoverSwitch: {
        title: productOrigin.name,
        description: productOrigin.shortDescription,
        img: handleAltText(productOrigin.image),
        links: allProductOrigins.map((origin) => ({
          label: origin.name,
          url: handleSlug(locale, 'origin', origin.slug),
        })),
      },
      products: allProducts.map((product) => ({
        img:
          product.pictures && product.pictures[0]
            ? handleAltText(product.pictures[0].image)
            : '',
        title: product.name,
        ctaLabel: common.discoverMoreLabel,
        tags: product.tags.map((tag) => tag.label),
        ctaUrl: handleSlug(locale, 'product', product.slug),
      })),
      seoText: productOrigin.seoText,
      seo: productOrigin.seo,
    }
  },
  data() {
    return {
      sectionCoverSwitch: {},
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
