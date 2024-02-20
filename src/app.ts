import { getCollection } from "./db"

export const x = 1001222200

//TODO: 
export const FetchPrice = async({args}: {args: any}) => {
    
    const {STYLE, SIZE,STONE_TYPE,Metal_Type, word} = args

    const letterArray = word.split('')
    let total = 0
    const productsCollection = await getCollection('products')
    const productsorders = await productsCollection
      .find({ STYLE, SIZE, STONE_TYPE, Metal_Type, Letter: { $in: letterArray }})
      .toArray()
    const letterMap = new Map(); 
    for (const letter of letterArray) 
    { 
      if (letterMap.has(letter)) 
      { 
        letterMap.set(letter, letterMap.get(letter) + 1); 
      } 
      else { 
        letterMap.set(letter, 1); 
      } 
    }

    const groupedProducts = Array.from(letterMap.entries()).map(([letter, count]) => { const filteredProducts = productsorders.filter(p => p.Letter === letter); return { letter, count, products: filteredProducts }; });
    for (const p of groupedProducts) {
        total += parseInt(p.products[0].Component_Price) * p.count
    }
    return {total,groupedProducts}
}