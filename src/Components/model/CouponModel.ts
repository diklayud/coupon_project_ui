export default class CouponModel {
    id: number;
    company_id_ui?: number;
    category?: string;
    title: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    amount?: number;
    price?: number;
    image: string;
}