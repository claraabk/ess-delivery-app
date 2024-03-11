export class CreatePromotionDto {
    name: string
    description: string
    discount: number
    startDate: Date
    endDate: Date
    menuItems: string[]
    restaurantId: string
}