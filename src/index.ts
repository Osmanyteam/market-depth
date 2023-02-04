import App from './app'
import config from './core/config'
import PairTradeRouter from './apiServices/pairTrade/pairTrade.router'

const app = new App([PairTradeRouter])
app.listen(Number(config.PORT))
