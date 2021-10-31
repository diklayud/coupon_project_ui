export default class UserDetails {
    clientType: CouponClientType = "";
    email: string = "";
    password: string = "";
}

export type CouponClientType = "ADMINISTRATOR" | "COMPANY" | "CUSTOMER" | "";
