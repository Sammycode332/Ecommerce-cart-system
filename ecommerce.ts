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
interface Discount{
    id:number;
    code:string;
    discountType?:string;
    discountValue:number;
    isActive:boolean;
    minPurchaseAmount?:number
}
interface Order{
    orderId:number;
    items: CartItem[];
    subTotal:number;
    taxAmount:number;
    discountAmount:number;
    finalTotal: number;
    appliedDiscount?:number
    orderDate:Date
}
//Product Manager
class ProductManager{
   private products: Product[] = [];
   private discounts: Discount[] = [];

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
    public adddiscount(discount: Discount): void{
        const discountExists = this.discounts.some(d=> d.code === discount.code);
        if(discountExists){
            throw new Error(`Discount code ${discount.code} has already been used`)
        }
        this.discounts.push(discount)
        console.log(`Discount ${discount.code} has already been applied`)
    //   
   }
   public getDiscountByCode(code: string): Discount | null{
    const foundDiscount = this.discounts.find(d=> d.code === code);
    if(!foundDiscount){
        return null
    }
    return foundDiscount
   }
   public validateDiscount(code: string,cartTotal: number): boolean{
    const discount = this.getDiscountByCode(code);

    if(!discount){
        console.log("Discount code does not exixt.")
        return false;
    }
    if(!discount.isActive){
        console.log("This discount code is expired or inactive")
        return false;
    }
    if(discount.minPurchaseAmount !==undefined && cartTotal < discount.minPurchaseAmount){
        console.log(`You need to spend at least $${discount.minPurchaseAmount} to use the code`)
    }
    return true;
   }
}
// cart class
class ShoppingCart{
    private items: CartItem[] = [];
    private appliedDiscount: Discount | null;
    private taxRate: number = 0.1

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
    // applying discount
    public applyDiscount(code: string): void { 
        const cartTotal = this.getCartTotal();

        const discount = this.productManager.getDiscountByCode(code);

        if (!discount) {
            console.error(`Error: Discount code "${code}" does not exist.`);
            return;
        }

        const isValid = this.productManager.validateDiscount(code, cartTotal);

        if (!isValid) {
            console.error(`Error: Discount code "${code}" is invalid.`);
            return;
        }

        this.appliedDiscount = discount;
        console.log(`Success: Discount code "${code}" applied!`);
    }
    public getSubTotal(): number{
        return this.getCartTotal()
    }
    public getTaxAmount(): number{
        return this.getSubTotal() * this.taxRate
    }
    public getDiscountAmount(): number{
        //incase no discount is applied
        if(!this.appliedDiscount){
            return 0;
        }
        const subtotal = this.getSubTotal();
        // if discount type is percentage or fixed
        if(this.appliedDiscount.discountType === "percentage"){
            return (subtotal * this.appliedDiscount.discountValue) /100;
        }else if(this.appliedDiscount.discountType == "fixed"){
            return this.appliedDiscount.discountValue;
        }
        return 0
    }
    //calculating Final Total
    public getFinalTotal(): number{
        return this.getSubTotal() + this.getTaxAmount() - this.getDiscountAmount()
    }
    //removing discount
    public removeDiscount(): void{
        this.appliedDiscount = null;
        console.log("Discount code has been removed from the cart. ");

    }
    // the main order summary of the cart
    public getOrderSummary(): Order{
        const orderSummary: Order = {
            orderId: Math.floor(Math.random() * 90000) + 10000,
            items: this.getCartItems(),
            subTotal: this.getSubTotal(),
            taxAmount: this.getTaxAmount(),
            discountAmount: this.getDiscountAmount(),
            finalTotal:this.getFinalTotal(),
            appliedDiscount:this.appliedDiscount ? this.appliedDiscount.id : undefined,
            orderDate: new Date(),
        }
        return orderSummary;
    }
    public printOrderReceipt(): void {
        console.log("\n=================================");
        console.log("         ORDER RECEIPT           ");
        console.log("=================================");
        
        // Loop through items 
        
        this.items.forEach(item => {
            const product = this.productManager.getProductById(item.productId);
            console.log(`${product?.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`);
        });

        console.log("---------------------------------");
        console.log(`Subtotal:         $${this.getSubTotal().toFixed(2)}`);
        console.log(`Tax (10%):        $${this.getTaxAmount().toFixed(2)}`);
        if (this.getDiscountAmount() > 0) {
            console.log(`Discount Applied: -$${this.getDiscountAmount().toFixed(2)} (${this.appliedDiscount?.code})`);
        }
        console.log("---------------------------------");
        console.log(`FINAL TOTAL:      $${this.getFinalTotal().toFixed(2)}`);
        console.log("=================================\n");
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
console.log("\n========== ADDING SAMPLE DISCOUNTS ==========");
productManager.adddiscount({ id: 1, code: "SAVE10", discountType: "percentage", discountValue: 10, isActive: true });
productManager.adddiscount({ id: 2, code: "SUMMER20", discountType: "percentage", discountValue: 20, isActive: true, minPurchaseAmount: 5000 }); // High min spend for testing
productManager.adddiscount({ id: 3, code: "FLAT100", discountType: "fixed", discountValue: 100, isActive: true });
productManager.adddiscount({ id: 4, code: "EXPIRED50", discountType: "percentage", discountValue: 50, isActive: false });
console.log("====================================================\n");

console.log("========== CART BEFORE ANY DISCOUNT ==========");
console.log(`Subtotal:    $${cart.getSubTotal().toFixed(2)}`);
console.log(`Tax Amount:  $${cart.getTaxAmount().toFixed(2)}`);
console.log(`Final Total: $${cart.getFinalTotal().toFixed(2)}`);
console.log("=======================================================\n");

console.log("========== STEP 4.5: APPLYING VALID DISCOUNT (SAVE10) ==========");
cart.applyDiscount("SAVE10");

console.log("\n--- CART WITH SAVE10 DISCOUNT ---");
console.log(`Subtotal:        $${cart.getSubTotal().toFixed(2)}`);
console.log(`Discount Amount: -$${cart.getDiscountAmount().toFixed(2)}`);
console.log(`Tax Amount:      $${cart.getTaxAmount().toFixed(2)}`);
console.log(`Final Total:     $${cart.getFinalTotal().toFixed(2)}`);
console.log("===============================================================\n");

console.log("========== STEP 4.6: TRYING INVALID DISCOUNTS ==========");
console.log("-> Test 1: Fake Code");
cart.applyDiscount("FAKECODE99"); 

console.log("\n-> Test 2: Expired Code");
cart.applyDiscount("EXPIRED50"); 
console.log("=======================================================\n");

console.log("==========  REMOVING THE DISCOUNT ==========");
cart.removeDiscount();
console.log(`Final Total back to: $${cart.getFinalTotal().toFixed(2)}`);
console.log("====================================================\n");

console.log("==========  APPLYING FLAT100 & RECEIPT ==========");
cart.applyDiscount("FLAT100");
cart.printOrderReceipt();
console.log("========================================================\n");

console.log("========== TESTING EDGE CASES ==========");

// Edge Case 1: Minimum purchase constraint test
console.log("-> Test A: Minimum Not Met (SUMMER20 requires $5000)");
cart.applyDiscount("SUMMER20"); 

// Edge Case 2: Empty Cart Test
console.log("\n-> Test B: Applying discount to a completely empty cart");
const temporaryEmptyCart = new ShoppingCart(productManager);
temporaryEmptyCart.applyDiscount("SAVE10"); 
temporaryEmptyCart.printOrderReceipt();
console.log("===================================================\n");