API desarrollada con la finalidad de consultar el precio basado en USD de las criptomonedas BTC, ETH, BNB, USDT (tether) y de las monedas BS y EURO.

Ejecución del API:
1- Clonar el repositorio
2- Ejecutar npm i 
3- Ejecutar el comando tsc
4- Ejecutar npm run start

Rutas establecidas:
*GET => localhost:3000/GetPrice Entrega un JSON con los precios de las criptomonedas, fecha de actualización y código de la moneda

*POST => localhost:3000/SetPrice Actualiza el precio de una criptomoneda en caso de que el precio no sea el actual, como sería el caso del BS y el EURO, el JSON a enviar para realizar el cambio es {"moneda": "VES", "monto": "36.98"}


NOTA: La API de currencyapi para la consulta de Bs y Euro tiene un límite de peticiones, se recomienda crear su propia APIKey 
LINK https://currencyapi.com/