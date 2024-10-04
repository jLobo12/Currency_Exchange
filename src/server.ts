import express from 'express'
import { Services } from './service';


class server {

    public app: express.Application;

    constructor(
        private services: Services = new Services()
    ) {
        this.app = express();
        this.config()
    }

    start() {
        //inicializa express
        this.app.listen(this.app.get('port'), () => {
            console.log('Backend listo en el Puerto', this.app.get('port'));
            console.log('Version V1.0.0')
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

    Routes(){
        try {
            
            this.app.get('/',async (req:any, res:any)=>{
                this.services.GetAxios("https://api.currencyapi.com/v3/latest?apikey=cur_live_7nuFRH15HPWq1U250d53aEOYECqflUkQLXCe3pAY&currencies=VES")
                res.send('Bienvenido al backend')
            })
            

        } catch (error) {
            console.log(new Date())
            console.error(error)
        }
    }

}

const StartServer = new server()