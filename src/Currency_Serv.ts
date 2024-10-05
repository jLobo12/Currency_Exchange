import { Services } from "./service";
import { environment } from "./environment";

export class Currency {

    CurrencyPrices = new Map() //map para almacenar los cambios de precio realizados por el administrador

    constructor(
        private service: Services = new Services()
    ) { }

    GetPriceBsAndEur() {
        //Metodo para consultar el precio del Bs y el Euro basados en USD
        return new Promise(async (resolve: any, reject: any) => {
            try {
                let Price_BS_EUR: any = []

                //Consulto el API para obtener el precio del Bs y el euro
                this.service.GetAxios(`${environment.currencyapi.UrlBase}latest?apikey=${environment.currencyapi.ApiKey}&currencies=VES,EUR`).then((BS_EUR_Data: any) => {
                    if (BS_EUR_Data.isEmpty != true) { //se valida que no llegue vacio el json
                        const Data_BS_EUR = BS_EUR_Data.data
                        let key: any

                        for (key in Data_BS_EUR) {//se recorre el json con los datos de las dos monedas

                            //esta validacion se realiza en caso de que el administrador haya modificado el precio de una de las monedas por un precio mas actual
                            //con esto se toma el precio mas actual de la moneda
                            if (this.CurrencyPrices.has(Data_BS_EUR[key].code)) {
                                this.service.ValidationDates(this.CurrencyPrices.get(Data_BS_EUR[key].code), {
                                    Last_Updated: new Date(BS_EUR_Data.meta.last_updated_at),
                                    Currency: Data_BS_EUR[key].code,
                                    Price: this.service.String_To_Number(Data_BS_EUR[key].value)
                                }).then((NewData: any) => {
                                    Price_BS_EUR.push({
                                        Last_Updated: NewData.Last_Updated,
                                        Currency: Data_BS_EUR[key].code,
                                        Price: NewData.Price
                                    })
                                }).catch(err => {
                                    reject(err)
                                })

                            } else {//si el administrado no ha modificado el precio se toma que el que se encontro en el API
                                Price_BS_EUR.push({
                                    Last_Updated: new Date(BS_EUR_Data.meta.last_updated_at),
                                    Currency: Data_BS_EUR[key].code,
                                    Price: this.service.String_To_Number(Data_BS_EUR[key].value)
                                })
                            }
                        }
                    }
                    resolve(Price_BS_EUR)
                }).catch(err => {
                    reject(err)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    GetDateCrypto(uuid: String) {//Se busca el precio de las cryptomonedas 
        return new Promise(async (resolve: any, reject: any) => {
            try {
                this.service.GetAxios(`${environment.coinranking.UrlBase}coin/${uuid}/price`).then((Data: any) => {
                    if (Data.status == "success") {
                        resolve(new Date(Data.data.timestamp * 1000))
                    } else { // si no se encuentra una fecha se asigan la fecha se consulta
                        resolve(new Date())
                    }
                }).catch(err => {
                    reject(err)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    GetPriceCrypto() { //Se consultan los precio del BTC, ETH, USDT, BNB 
        return new Promise(async (resolve: any, reject: any) => {
            try {

                this.service.GetAxios(`${environment.coinranking.UrlBase}coins`).then(async (CryptoData: any) => {
                    const CoinsDatos = CryptoData.data.coins
                    let GlobalCrypto: any = []
                    let CoinsCrypto: any = []

                    //Se buscan las monedas solicitadas entre el lote de todas las
                    GlobalCrypto.push(CoinsDatos.find((v: any) => v.symbol == 'BTC'))
                    GlobalCrypto.push(CoinsDatos.find((v: any) => v.symbol == 'ETH'))
                    GlobalCrypto.push(CoinsDatos.find((v: any) => v.symbol == 'USDT'))
                    GlobalCrypto.push(CoinsDatos.find((v: any) => v.symbol == 'BNB'))

                    //Se recorre el arreglo con las monedas
                    for (let index = 0; index < GlobalCrypto.length; index++) {
                        if (GlobalCrypto[index] != undefined) {//Se valida que uno nomenda no este en undefined
                            //Se conculta la fecha de actualizacion de la moneda ya que no se encuentra en el arreglo
                            await this.GetDateCrypto(GlobalCrypto[index].uuid).then((FechaCrypto: any) => {
                                //Una vez encontrada la fecha, se valida que el administrador no haya modificado el precio
                                //si el administrador modifico el precio se valida coon la data consultada, y se toma la fecha mas actual
                                if (this.CurrencyPrices.has(GlobalCrypto[index].symbol)) {
                                    this.service.ValidationDates(this.CurrencyPrices.get(GlobalCrypto[index].symbol), {
                                        Last_Updated: FechaCrypto,
                                        Currency: GlobalCrypto[index].symbol,
                                        Price: this.service.String_To_Number(GlobalCrypto[index].price)
                                    }).then((NewData: any) => {
                                        //Se asigna la data mas actual
                                        CoinsCrypto.push({
                                            Last_Updated: NewData.Last_Updated,
                                            Currency: GlobalCrypto[index].symbol,
                                            Price: NewData.Price
                                        })
                                    }).catch(err => {
                                        reject(err)
                                    })
                                } else {
                                    //No se ha modificado el monto por el administrado, se usa el dato obtenido del api
                                    CoinsCrypto.push({
                                        Last_Updated: FechaCrypto,
                                        Currency: GlobalCrypto[index].symbol,
                                        Price: this.service.String_To_Number(GlobalCrypto[index].price)
                                    })
                                }

                                if (index == GlobalCrypto.length - 1) {
                                    //este if se usa para poder retornar la data solo si se llego al final del arreglo
                                    resolve(CoinsCrypto)
                                }

                            })
                        }
                    }

                }).catch(err => {
                    reject(err)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    GetPrice() { //Une los dos metodo que consultan el precio de las monedas
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //Se consultal ambos metodo y se espera a tener la repuestas de ambos
                Promise.allSettled([this.GetPriceBsAndEur(), this.GetPriceCrypto()]).then((Values: any) => {
                    let AllPrice:any = []

                    //Se recorre ambos arreglos con la data de ambos metodos y se unen en un solo arreglo
                    for (let index = 0; index < Values.length; index++) {
                        //si la consulta fue exitosa, la data se agrega al arreglo global
                        if (Values[index].status == 'fulfilled') {
                            AllPrice.push(...Values[index].value)
                        }
                        //se retorna la data solo cuando se llega al final del arreglo
                        if (index === Values.length - 1) {
                            resolve(AllPrice)
                        }
                    }
                }).catch(err => {
                    reject(err)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    SetPriceCurrency(Code: string, Price: string) {//Metodo para modificar el precio de alguna modena
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //se asigna la moda en el map con su Key y su valor
                this.CurrencyPrices.set(Code, {
                    Last_Updated: new Date(),
                    Currency: Code,
                    Price: this.service.String_To_Number(Price)
                })

                //Se retorna un mensaje para indicar que se realizo con exito la modificacion
                resolve({
                    status: "New price saved successfully",
                    currency: this.CurrencyPrices.get(Code)
                })

            } catch (error) {
                reject(error)
            }
        })
    }

}

