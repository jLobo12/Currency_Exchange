import { Services } from "./service";
import { environment } from "./environment";

export class Currency {

    constructor(
        private service: Services = new Services()
    ) { }

    GetPriceBs() {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let Price_BS: any = {
                    Last_Updated: null,
                    Currency: "VES",
                    Price: null
                }

                this.service.GetAxios(`${environment.currencyapi.UrlBase}latest?apikey=${environment.currencyapi.ApiKey}&currencies=VES`).then((BS_Data: any) => {
                    if (BS_Data.isEmpty != true) {
                        console.log("Json con data")
                        console.log(BS_Data)
                        Price_BS.Last_Updated = BS_Data.meta.last_updated_at
                        Price_BS.Price = BS_Data.isEmpty != true ? this.service.Sting_To_Number(BS_Data.data.VES.value) : null
                    }
                    resolve(Price_BS)
                }).catch(err => {
                    console.log(new Date())
                    console.error(err)
                })
            } catch (error) {
                console.log(new Date())
                console.error(error)
            }
        })
    }

    GetPriceEur() {
        return new Promise(async (resolve: any, reject: any) => {
            try {

            } catch (error) {

            }
        })
    }

    GetPriceCrypto() {
        return new Promise(async (resolve: any, reject: any) => {
            try {

                this.service.GetAxios(`${environment.coinranking.UrlBase}coins`).then((CryptoData: any) => {
                    const CoinsDatos = CryptoData.data.coins
                    const FechaConsulta = new Date()
                    const BTC_Data = (CoinsDatos.find((v: any) => v.symbol == 'BTC'))
                    const ETH_Data = (CoinsDatos.find((v: any) => v.symbol == 'ETH'))
                    const USDT_Data = (CoinsDatos.find((v: any) => v.symbol == 'USDT'))
                    const BNB_Data = (CoinsDatos.find((v: any) => v.symbol == 'BNB'))

                    let CoinsCrypto = [
                        {
                            Last_Updated: FechaConsulta,
                            Currency: 'BTC',
                            Price: BTC_Data.isEmpty != true ? this.service.Sting_To_Number(BTC_Data.price) : null
                        },
                        {
                            Last_Updated: FechaConsulta,
                            Currency: 'ETH',
                            Price: ETH_Data.isEmpty != true ? this.service.Sting_To_Number(ETH_Data.price) : null
                        },
                        {
                            Last_Updated: FechaConsulta,
                            Currency: 'USDT',
                            Price: USDT_Data.isEmpty != true ? this.service.Sting_To_Number(USDT_Data.price) : null
                        },
                        {
                            Last_Updated: FechaConsulta,
                            Currency: 'BNB',
                            Price: BNB_Data.isEmpty != true ? this.service.Sting_To_Number(BNB_Data.price) : null
                        }
                    ]

                    resolve(CoinsCrypto)

                }).catch(err => {
                    console.log(new Date())
                    console.error(err)
                })

            } catch (error) {

            }
        })
    }

}

const test = new Currency()

test.GetPriceBs().then((Data: any) => {
    console.log(Data)
})