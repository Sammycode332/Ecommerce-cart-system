//creating the interface Product
interface Product{
    id: number;
    name: string;
    price: number;
    quantityInStock:number;
    category?: string;
}
//creating the cartItem interface
interface CartItem{
    productId:number;
    quantity:number;
    price:number;
}
//Product Manager
class ProductManager{
   private products: Product[] = [];
   //add product method
   public addProduct(id:number,name: string,price:number,quantityInStock:number,category?:string): void{
     const newProduct : Product = {id,name,price,quantityInStock,category};
     this.products.push(newProduct)
     console.log(`Added ${name}`)
   }
   //binary search to get product
   public getProductById(id: number): Product | null{
    this.products.sort((a, b) => a.id - b.id)
    let left = 0
    let right = this.products.length-1

    while(left<=right){
        let mid = Math.floor((left+right)/2)
        let currentProduct = this.products[mid]

        if(currentProduct.id === id){
            return currentProduct
        }else if(currentProduct.id < id){
            left = mid+1
        }else{
            right = mid-1
        }
    }
    return null
   }
//    public searchByName(name: string): Product | null{
//     this.products.sort((a, b) => a.name.localeCompare(b.name))
//     let left = 0
//     let right = this.products.length-1

//     while(left<=right){
//         let mid = Math.floor((left+right)/2)
//         let currentProduct = this.products[mid]

//         if(currentProduct.name === name){
//             return currentProduct
//         }else if(currentProduct.name < name){
//             left = mid+1
//         }else{
//             right = mid-1
//         }
//     }
//     return null
//    }

    //Searching Product by name
    public searchByName(name: string): Product[] {
    return this.products.filter(product => 
        product.name.toLowerCase().includes(name.toLowerCase())
    );
}
    //sorting product by price
    public sortByPrice(): Product[]{
        return [...this.products].sort((a,b)=>a.price - b.price);
    }
    //getting all products
    public getAllProducts(): Product[]{
        return[...this.products]
    }
}
// cart class
class ShoppingCart{
    private items: CartItem[] = [];

    private productManager: ProductManager;

    constructor(productManager: ProductManager){
        this.productManager = productManager
    }
    //add tocart
    public addToCart(productId:number,quantity:number){
         const product = this.productManager.getProductById(productId)
         //checking if products exist
         if(!product){
            console.log(`Error: Product with ID ${productId} not found.`)
            return;
         }
         //checking if quantity is greater than quantity in stock
         if(quantity > product.quantityInStock){
            throw new Error("Not enough stock available.")
         }
         const existingItem = this.items.find(item=>item.productId ===productId);
         if(existingItem){
            existingItem.quantity += quantity;
         }else{
            const newItem: CartItem = {
                productId: productId,
                quantity: quantity,
                price: product.price
            }
            this.items.push(newItem)
         }
         console.log(`Successfully added ${product.name} to cart`)
    }
    public removeFromCart(productId: number) : void{
        //finding index of the product to remove
        const index = this.items.findIndex(item => item.productId === productId);
        if (index === -1) { 
            console.error(`Error: Product with ID ${productId} not found in cart.`);
            return;
        }
        this.items.splice(index, 1);
    }
    //getting all items in the cart
    public getCartItems(): CartItem[]{
        return[...this.items]
    }
    public getCartTotal(): number {
        //getting total cart
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].price * this.items[i].quantity;
        }
        return total;
    }
    public clearCart(): void{
        //srtting cart to 0
        this.items.length = 0
        console.log("The cart is now empty")
    }
    public updateQuantity(productId: number,newQuantity: number): void{
        const cartItem = this.items.find(item=> item.productId === productId)
        //if cart item not in cart
        if(!cartItem){
            throw new Error(`Product with ID ${productId} is not in your cart.`)
        }
        //if cart item is not up to 0
        if(newQuantity <=0){
            throw new Error("Quantity must be greater than 0")
        }
        const product = this.productManager.getProductById(productId);
        if(product && newQuantity > product.quantityInStock){
            throw new Error(`Cannot update quantity. Only ${product.quantityInStock} items available in stock.`);
        }
        cartItem.quantity = newQuantity;
    console.log(`Updated quantity to ${newQuantity}.`);
    }
}

const productManager = new ProductManager();
productManager.addProduct(1,"Laptop",1200,5)
productManager.addProduct(2,"Mouse",25,50)
productManager.addProduct(3,"Keyboard",80,20)
productManager.addProduct(4,"Monitor",350,8)
productManager.addProduct(5,"USB Cable",10,100)
productManager.addProduct(6,"PS5",1000,100)
productManager.addProduct(7,"Iphone17",1000,70)
productManager.addProduct(8,"Power Bank",110,100)


console.log("\n========== ALL PRODUCTS ==========")
const allProducts = productManager.getAllProducts()
allProducts.forEach(p => console.log(`[ID: ${p.id}] ${p.name} - $${p.price} - Stock: ${p.quantityInStock}`))
console.log("==================================\n")

console.log("========== SEARCH BY NAME: 'mouse' ==========")
const searchResult = productManager.searchByName("mouse")
searchResult.forEach(p => console.log(`[ID: ${p.id}] ${p.name} - $${p.price}`))
console.log("===========================================\n")

console.log("========== SORTED BY PRICE (Low to High) ==========")
const sortedProducts = productManager.sortByPrice()
sortedProducts.forEach(p => console.log(`[ID: ${p.id}] ${p.name} - $${p.price}`))
console.log("==================================================\n")


const cart = new ShoppingCart(productManager)

console.log("========== ADDING ITEMS TO CART ==========")
cart.addToCart(5,3)
cart.addToCart(7,2)
cart.addToCart(3,5)
cart.addToCart(4,3)
cart.addToCart(1,2)
cart.addToCart(2,2)
console.log("==========================================\n")

console.log("========== CART ITEMS ==========")
const cartItems = cart.getCartItems()
cartItems.forEach(item => {
    const product = productManager.getProductById(item.productId)
    console.log(`${product?.name} - Quantity: ${item.quantity} - Price per unit: $${item.price} - Subtotal: $${item.price * item.quantity}`)
})
console.log("================================\n")

console.log("========== CART TOTAL ==========")
const total = cart.getCartTotal()
console.log(`Total: $${total.toFixed(2)}`)
console.log("================================\n")

console.log("========== REMOVING ITEM (ID: 1) ==========")
cart.removeFromCart(1)
console.log("==========================================\n")

console.log("========== CART ITEMS AFTER REMOVAL ==========")
const cartItemsAfterRemoval = cart.getCartItems()
cartItemsAfterRemoval.forEach(item => {
    const product = productManager.getProductById(item.productId)
    console.log(`${product?.name} - Quantity: ${item.quantity} - Subtotal: $${item.price * item.quantity}`)
})
console.log("============================================\n")

console.log("========== UPDATING QUANTITY (ID: 2 to 5) ==========")
cart.updateQuantity(2, 5)
console.log("===================================================\n")

console.log("========== FINAL CART ==========")
const finalCart = cart.getCartItems()
finalCart.forEach(item => {
    const product = productManager.getProductById(item.productId)
    console.log(`${product?.name} - Quantity: ${item.quantity} - Subtotal: $${item.price * item.quantity}`)
})
console.log("Final Total: $" + cart.getCartTotal().toFixed(2))
console.log("================================\n")