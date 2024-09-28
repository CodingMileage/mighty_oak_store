export default function converToSubCurrency(amount: number, factor = 100) {
    return Math.round(amount * factor)
}