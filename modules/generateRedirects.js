import fs from 'fs'
import path from 'path'
import ApiService from '../services/api.service'

export default function generateRedirects() {
  const nuxtInstance = this
  nuxtInstance.nuxt.hook('generate:done', async () => {
    const { common } = await ApiService.getRedirects()
    const redirects = [...common.redirects, ...common.redirects2, ...common.redirects3, ...common.redirects4, ...common.redirects5]
    const redirectsPath = path.join(
      nuxtInstance.options.generate.dir,
      '_redirects'
    )
    const domains = [
      'pinnaspa.it',
      'fratellipinna.com',
      'fllipinna.it',
      'brigante.it',
    ]
    let data = ''
    domains.forEach((domain) => {
      data += `https://www.${domain}/* https://www.pinnaformaggi.it/:splat 301!\n`
      data += `https://${domain}/* https://www.pinnaformaggi.it/:splat 301!\n`
    })
    data += `/ /en 301! Language=en\n`
    data += `/ /it 301!\n`
    redirects.forEach((el) => {
      data += `${el.oldPath} ${el.newPath} ${el.statusCode}\n`
    })
    fs.writeFileSync(redirectsPath, data)
  })
}
