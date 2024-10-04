import axios from 'axios';

export class Services {

    constructor() { }

    GetAxios(Url: string) { //Se realizan todas las peticiones Get
        return new Promise(async (resolve: any, reject: any) => {
            try {
                axios.get(Url).then((Res: any) => {
                    resolve(Res.data)
                }).catch((error: any) => { reject(error) })
            } catch (error) {
                reject(error)
            }
        })
    }

    String_To_Number(Valor: string) { //Convertir los string a numeros y con dos decimales
        return Number(Number(Valor).toFixed(2))
    }

    ValidationDates(MapData: any, ApiData: any) {//Compara las fechas del Map y la obtenida en el API
        return new Promise(async (resolve: any, reject: any) => {
            try {

                if (MapData.Last_Updated.getTime() > ApiData.Last_Updated.getTime()) {
                    //La fecha de Mapdata es mayor a la de APiData
                    resolve({
                        Last_Updated: MapData.Last_Updated,
                        Price: MapData.Price
                    })
                } else if (MapData.Last_Updated.getTime() > ApiData.Last_Updated.getTime()) {
                    //La fecha de APiData es mayor a la de MapData
                    resolve({
                        Last_Updated: ApiData.Last_Updated,
                        Price: ApiData.Price
                    })
                }

            } catch (error) {
                reject(error)
            }
        })
    }

}