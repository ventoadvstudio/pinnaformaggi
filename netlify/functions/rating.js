const crypto = require('crypto')
const { SiteClient } = require('datocms-client')

const client = new SiteClient(process.env.DATOCMS_FULLACCESS_API_TOKEN)

function ok() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Rating added' }),
  }
}

function badRequest() {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad request' }),
  }
}

function alreadyExist() {
  return {
    statusCode: 409,
    body: JSON.stringify({ message: 'Already exist' }),
  }
}

async function checkExistRating(data) {
  const deviceId = crypto.createHash('md5').update(data.ip).digest('hex')
  const items = await client.items.all({
    filter: {
      type: 'rating',
      fields: {
        recipe: {
          eq: data.recipeId,
        },
        deviceId: {
          eq: deviceId,
        },
      },
      page: {
        limit: 1,
      },
    },
  })
  return items.length !== 0
}

function addRating(data) {
  const deviceId = crypto.createHash('md5').update(data.ip).digest('hex')
  return client.items.create({
    itemType: '1991406',
    recipe: data.recipeId,
    value: parseInt(data.rating, 10),
    deviceId,
  })
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST' || !event.body) {
    return badRequest()
  }
  const body = JSON.parse(event.body)
  const rating = parseInt(body.rating)
  if (!body.recipeId || isNaN(rating) || rating < 1 || rating > 5) {
    return badRequest()
  }

  let ip = ''
  if (event.headers['client-ip']) ip = event.headers['client-ip']
  else if (event.headers['x-nf-client-connection-ip'])
    ip = event.headers['x-nf-client-connection-ip']
  else if (event.headers['x-forwarded-for']) {
    if (event.headers['x-forwarded-for'].includes(',')) {
      ip = event.headers['x-forwarded-for'].split(',')[0]
    } else {
      ip = event.headers['x-forwarded-for']
    }
  }

  if (!ip) console.log(event)

  const params = {
    ...body,
    ip,
  }

  try {
    if (await checkExistRating(params)) return alreadyExist()
    await addRating(params)
    return ok()
  } catch (e) {
    console.log(e)
    return badRequest()
  }
}
