
export function notifyByEmail(subscriber:string, email: string, tokenSymbol: string, price: number) {
    console.log(
        `NOTIFIYING: ${subscriber} 
        by Email: ${email} 
        for token: ${tokenSymbol} 
        at price ${price}
    `);
}

export function notifyByTelegram(subscriber:string, username: string, tokenSymbol: string, price: number) {
    console.log(
        `NOTIFIYING: ${subscriber} 
        by telegram username: ${username} 
        for token: ${tokenSymbol} 
        at price ${price}
    `);
}