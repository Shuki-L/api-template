// custom_typings/express/index.d.ts
declare namespace Express {
    interface Request {
        currentUser: {
            email:string,
            username: string,
            confirmed: boolean
        };
    }
}