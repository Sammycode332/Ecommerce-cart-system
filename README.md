# E-Commerce Product Manager & Shopping Cart System (Level 2)

A robust TypeScript-based system demonstrating core Data Structures and Algorithms (DSA) concepts, object-oriented programming, and defensive code validation. This project simulates an e-commerce backend managing a product catalog, user shopping carts, and dynamic order discount logic.

---

## 🚀 Features Implemented

### 1. Data Structures & Catalog Management (`ProductManager`)
* **Product Storage:** Uses a private array structures to hold catalog data securely.
* **Binary Search O(log n):** Implemented an efficient lookup function (`getProductById`) that sorts elements and utilizes binary search to retrieve products lightning fast.
* **Fuzzy Search:** Built a custom `searchByName` method using case-insensitive string matching filters.
* **Discount Ledger:** Manages a collection of valid discount codes with tracking for specific properties like status and constraints.

### 2. Cart Operations (`ShoppingCart`)
* **Encapsulation:** Uses the TypeScript `spread (...)` operator to return shallow copies of arrays, protecting internal states from outside mutability.
* **Quantity Management:** Updates cart quantities dynamically while cross-checking store shelves via safe boundaries.
* **Defensive Design / Guards:** Built explicit error throwing loops (`throw new Error`) to instantly halt invalid transactions (e.g., out-of-stock items, non-existent products, negative numbers).

### 3. Level 2: Financial Math & Coupon Rules (New)
* **Taxation & Totals:** Automated calculations for subtotal sums, constant tax rates (10%), and dynamic totals.
* **Polymorphic Discounts:** Supports two completely distinct styles of discounts:
    * *Percentage Rules:* Slices a relative part out of the subtotal (e.g., `SAVE10` gives 10% off).
    * *Fixed Rules:* Subtracts a flat currency value directly (e.g., `FLAT100` drops $100 off).
* **Constraint Testing:** Validates coupon eligibility thresholds based on operational flags (`isActive`) and spending baselines (`minPurchaseAmount`).
* **Audit Summaries:** Features an `getOrderSummary()` processor creating unique transaction receipts and a visual shell generator (`printOrderReceipt()`).

---

## 🛠️ Data Architecture (Interfaces)

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
    quantityInStock: number;
    category?: string;
}

interface CartItem {
    productId: number;
    quantity: number;
    price: number;
}

interface Discount {
    id: number;
    code: string;
    discountType?: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
    minPurchaseAmount?: number;
}

interface Order {
    orderId: number;
    items: CartItem[];
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    finalTotal: number;
    appliedDiscount?: number;
    orderDate: Date;
}