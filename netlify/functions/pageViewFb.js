const bizSdk = require('facebook-nodejs-business-sdk')
const EventRequest = bizSdk.EventRequest
const UserData = bizSdk.UserData
const ServerEvent = bizSdk.ServerEvent

const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
const pixelId = process.env.FACEBOOK_PIXEL_ID

function ok() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Ok' }),
  }
}

function badRequest() {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad request' }),
  }
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST' || !event.body) {
    return badRequest()
  }

  const body = JSON.parse(event.body)
  if (!body.sourceUrl || !body.eventId) {
    return badRequest()
  }

  bizSdk.FacebookAdsApi.init(accessToken)

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

  const currentTimestamp = Math.floor(new Date() / 1000)

  const userData = new UserData()
    .setClientIpAddress(ip)
    .setClientUserAgent(event.headers['user-agent'])

  const pageView = new ServerEvent()
    .setEventId(body.eventId)
    .setEventName('page_view')
    .setEventTime(currentTimestamp)
    .setUserData(userData)
    .setEventSourceUrl(body.sourceUrl)
    .setActionSource('website')

  const eventRequest = new EventRequest(accessToken, pixelId).setEvents([
    pageView,
  ])

  try {
    await eventRequest.execute()
    return ok()
  } catch (e) {
    console.error('Error: ', e)
    return badRequest()
  }
}
