import CouponModel from "./CouponModel";

export default class CustomerModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    coupons?: CouponModel[];
}