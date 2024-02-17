import { getCollection } from "./db"

export const x = 1001222200

export const FetchPrice = async({args}) => {
    
    const {STYLE, SIZE,STONE_TYPE,Metal_Type, word} = args

    const letterArray = word.split('')
    let total = 0
    const productsCollection = await getCollection('products')
    const productsorders = await productsCollection
      .find({ STYLE, SIZE, STONE_TYPE, Metal_Type, Letter: { $in: letterArray }})
      .toArray()
    for (const p of productsorders) {
        total += parseInt(p.Component_Price)
    }
    return total
}