import express from 'express'
import { Currency } from './Currency_Serv';
import { environment } from './environment';


class server {

    private app: express.Application;

    constructor(
        private currency: Currency = new Currency()
    ) {
        this.app = express();
        this.config()
    }

    start() {
        //inicializa express
        this.app.listen(this.app.get('port'), () => {
            console.log('Exchange Currency listo en el Puerto', this.app.get('port'));
            console.log(`Version ${environment.Version}`)
        })
    }

    config() {
        //configuracion 
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(function (req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            next();
        });

        this.start()
        this.Routes()
    }

    Routes() {
        //Aca se configuran todas las rutas del API
        try {

            this.app.get('/', async (req: any, res: any) => {
                res.send('Bienvenido al backend')
            })

            this.app.get('/GetPrice', async (req: any, res: any) => {
                try {
                    this.currency.GetPrice().then((Prices: any) => {//Busca el precio de las monedas
                        res.status(200)
                        res.json(Prices)
                    }).catch(err => {
                        console.error(err)
                        res.status(500)
                        res.json({ status: false, message: "Internal server error" })
                    })
                } catch (error) {
                    console.error(error)
                }
            })

            this.app.post('/SetPrice', async (req: any, res: any) => {
                //Modifica el precio una moneda
                if (req.body.moneda != undefined && req.body.monto != undefined) {
                    this.currency.SetPriceCurrency(req.body.moneda, req.body.monto).then((Update: any) => {
                        res.status(200)
                        res.json(Update)
                    }).catch(err => {
                        console.error(err)
                        res.status(500)
                        res.json({ status: false, message: "Internal server error" })
                    })
                } else {
                    res.status(400)
                    res.json({ status: false, message: "Bad request" })
                }
            })

        } catch (error) {
            console.error(error)
        }
    }

}

const StartServer = new server()