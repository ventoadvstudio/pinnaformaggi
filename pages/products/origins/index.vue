<template>
  <main class="products-origins-page pb-152 pb-80">
    <section
      v-for="(origin, i) in origins"
      :key="origin.title"
      :class="{
        'mt-40 md:mt-50': i > 0,
        'mt-45 lg:mt-0': i === 0,
        'mb-100 md:mb-140': i === origins.length - 1,
      }"
    >
      <ProductCategoryShowcase
        :headband="i !== 0"
        :title="origin.title"
        :img="origin.img"
        :description="origin.description"
        :items="origin.items"
        :cta-label="origin.ctaLabel"
        :cta-url="origin.ctaUrl"
      />
    </section>
    <div class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-60 md:mt-180">
      <div
        class="products-origins-page__text lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
      >
        <h6 class="text-14 md:text-16 text-gray-500 font-bold uppercase">
          {{ title }}
        </h6>
        <p class="text-14 md:text-16 text-gray-500">
          {{ description }}
        </p>
      </div>
    </div>
  </main>
</template>
<script>
import ProductCategoryShowcase from '@/components/ProductCategoryShowcase'
import ApiService from '@/services/api.service'
import BasePage from '@/components/BasePage'
import { handleSlug, handleAltText } from '@/utils'

export default {
  components: {
    ProductCategoryShowcase,
  },
  nuxtI18n: {
    paths: {
      it: '/prodotti/origine',
      en: '/products/origin',
    },
  },
  extends: BasePage,
  async asyncData({ app, store }) {
    const locale = app.i18n.locale
    const common = store.state.common[locale]
    const { originsPage } = await ApiService.getOriginsPage(locale)
    const { allProductOrigins } = await ApiService.getProductOrigins(locale)
    const allOriginsProducts = []
    for (const origin of allProductOrigins) {
      const {
        allProducts: originProducts,
      } = await ApiService.getOriginProducts(locale, origin.id)
      allOriginsProducts.push(originProducts)
    }
    return {
      title: originsPage.title,
      description: originsPage.description,
      seo: originsPage.seo,
      origins: allProductOrigins.map((origin, i) => ({
        img: origin.image ? handleAltText(origin.image) : '',
        title: origin.name,
        description: origin.shortDescription,
        ctaLabel: common.discoverMoreLabel,
        ctaUrl: handleSlug(locale, 'origin', origin.slug),
        items: allOriginsProducts[i].map((product) => ({
          title: product.name,
          image:
            product.pictures && product.pictures[0]
              ? handleAltText(product.pictures[0].image)
              : '',
          ctaLabel: common.visitProductLabel,
          ctaUrl: handleSlug(locale, 'product', product.slug),
        })),
      })),
    }
  },
  data() {
    return {
      title: '',
      description: '',
      origins: [],
    }
  },
}
</script>
