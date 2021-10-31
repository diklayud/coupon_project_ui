import CouponModel from "./CouponModel";

export default class CompanyModel {
    id: number;
    name: string;
    email: string;
    password?: string;
    coupons?: CouponModel[];
}