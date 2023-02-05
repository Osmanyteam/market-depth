import App from '@src/app'
import config from '@core/config'
import PairTradeRouter from '@api/pairTrade/pairTrade.router'

const app = new App([PairTradeRouter])
app.setupSwagger({
  version: '1.0.0',
  title: 'Market Depth API',
  license: {
    name: 'MIT'
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic'
    }
  },
  filesPattern: ['./api/**/*.router.ts', './services/*.service.ts'],
  swaggerUIPath: '/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: true,
  apiDocsPath: '/api-docs.json'
})
app.listen(Number(config.PORT))
