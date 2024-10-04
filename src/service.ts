import axios from 'axios';

export class Services {

    constructor() {
        console.log("Llegue a services")
    }

    GetAxios(Url: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                console.log(Url)
                axios.get(Url).then((Res: any) => {
                    resolve(Res.data)
                }).catch((error: any) => { reject(error) })
            } catch (error) {
                console.log(new Date())
                console.error(error)
            }
        })
    }

    Sting_To_Number(Valor: string) {
        return Number(Number(Valor).toFixed(2))
    }

}