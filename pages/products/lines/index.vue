<template>
  <main class="products-lines-page pb-152 pb-80">
    <section
      v-for="(line, i) in lines"
      :key="line.title"
      :class="{
        'mt-40 md:mt-50': i > 0,
        'mt-45 lg:mt-0': i === 0,
        'mb-100 md:mb-140': i === lines.length - 1,
      }"
    >
      <ProductCategoryShowcase
        :headband="i !== 0"
        :title="line.title"
        :img="line.img"
        :description="line.description"
        :items="line.items"
        :cta-label="line.ctaLabel"
        :cta-url="line.ctaUrl"
      />
    </section>
    <div class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-60 md:mt-180">
      <div
        class="products-lines-page__text lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
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
      it: '/prodotti/linee/',
      en: '/products/lines/',
    },
  },
  extends: BasePage,
  async asyncData({ app, store }) {
    const locale = app.i18n.locale
    const common = store.state.common[locale]
    const { linesPage } = await ApiService.getLinesPage(locale)
    const { allProductLines } = await ApiService.getProductLines(locale)
    const allLinesProducts = []
    for (const line of allProductLines) {
      const { allProducts: lineProducts } = await ApiService.getLineProducts(
        locale,
        line.id
      )
      allLinesProducts.push(lineProducts)
    }
    return {
      title: linesPage.title,
      description: linesPage.description,
      seo: linesPage.seo,
      lines: allProductLines.map((line, i) => ({
        img: line.image ? handleAltText(line.image) : '',
        title: line.name,
        description: line.shortDescription,
        ctaLabel: linesPage.discoverLine,
        ctaUrl: handleSlug(locale, 'line', line.slug),
        items: allLinesProducts[i].map((product) => ({
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
      lines: [],
    }
  },
}
</script>
