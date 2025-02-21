<template>
  <main class="products-agings-page pb-152 pb-80">
    <section
      v-for="(aging, i) in agings"
      :key="aging.title"
      :class="{
        'mt-40 md:mt-50': i > 0,
        'mt-45 lg:mt-0': i === 0,
        'mb-100 md:mb-140': i === agings.length - 1,
      }"
    >
      <ProductCategoryShowcase
        :headband="i !== 0"
        :title="aging.title"
        :img="aging.img"
        :description="aging.description"
        :items="aging.items"
        :cta-label="aging.ctaLabel"
        :cta-url="aging.ctaUrl"
      />
    </section>
    <div class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-60 md:mt-180">
      <div
        class="recipes-page__text lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
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
import { handleSlug, handleAltText } from '@/utils'
import BasePage from '@/components/BasePage'

export default {
  components: {
    ProductCategoryShowcase,
  },
  nuxtI18n: {
    paths: {
      it: '/prodotti/stagionatura/',
      en: '/products/aging/',
    },
  },
  extends: BasePage,
  async asyncData({ app, store }) {
    const locale = app.i18n.locale
    const common = store.state.common[locale]
    const { agingsPage } = await ApiService.getAgingsPage(locale)
    const { allProductAgings } = await ApiService.getProductAgings(locale)
    const allAgingsProducts = []
    for (const aging of allProductAgings) {
      const { allProducts: agingProducts } = await ApiService.getAgingProducts(
        locale,
        aging.id
      )
      allAgingsProducts.push(agingProducts)
    }
    return {
      title: agingsPage.title,
      description: agingsPage.description,
      seo: agingsPage.seo,
      agings: allProductAgings.map((aging, i) => ({
        img: aging.image ? handleAltText(aging.image) : '',
        title: aging.name,
        description: aging.shortDescription,
        ctaLabel: common.discoverMoreLabel,
        ctaUrl: handleSlug(locale, 'aging', aging.slug),
        items: allAgingsProducts[i].map((product) => ({
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
      agings: [],
    }
  },
}
</script>
