import App from '@src/app'
import config from '@core/config'
import PairTradeRouter from '@api/pairTrade/pairTrade.router'

const app = new App([PairTradeRouter])
app.listen(Number(config.PORT))
