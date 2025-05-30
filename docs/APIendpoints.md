# 🕹️ Retro Marketplace API Documentation  
_A vintage-themed eCommerce API for 80s, 90s, and 00s lovers_

---

## 🛍️ PRODUCTS

### `GET /api/products`
**Description:** Fetch all available retro products.  
**Auth:** Optional  
**Query Params:**
- `decade` – Filter by decade (`80s`, `90s`, `00s`)
- `category` – Filter by category (`toy`, `game`, `electronic`)

**Example Request:**
```http
GET /api/products?decade=90s&category=toy
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Game Boy Color",
    "description": "Classic handheld console in atomic purple.",
    "price": 79.99,
    "image_url": "https://...",
    "decade": "90s",
    "category": "electronic",
    "owner": {
      "id": 2,
      "username": "retroQueen90"
    },
    "created_at": "2025-04-17T17:40:00",
    "review_count": 3
  }
]
```

---

### `POST /api/products`
**Description:** Add a new product (e.g., Tamagotchi, VHS tapes)  
**Auth:** Required  

**Body Example:**
```json
{
  "name": "Polly Pocket",
  "description": "Classic 90s mini playset in great condition.",
  "price": 24.50,
  "image_url": "https://...",
  "decade": "90s",
  "category": "toy"
}
```

**Success Response:** `201 Created`
```json
{
  "id": 5,
  "name": "Polly Pocket",
  "description": "Classic 90s mini playset in great condition.",
  "price": 24.5,
  "image_url": "https://...",
  "decade": "90s",
  "category": "toy",
  "owner": {
    "id": 2,
    "username": "retroQueen90"
  },
  "created_at": "2025-04-17T17:45:00",
  "review_count": 0
}
```

---

### `PUT /api/products/:id`
**Description:** Update a product listing (owner only)  
**Auth:** Required  

**Body Example:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "price": 29.99,
  "image_url": "https://new-url.com"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated description",
  "price": 29.99,
  "image_url": "https://new-url.com",
  "decade": "90s",
  "category": "electronic",
  "owner": {
    "id": 2,
    "username": "retroQueen90"
  },
  "created_at": "2025-04-17T17:40:00",
  "review_count": 3
}
```

---

### `DELETE /api/products/:id`
**Description:** Remove a product from your shop (owner only)  
**Auth:** Required  
**Response:**
```json
{ "message": "Product deleted" }
```

---

## ⭐ FAVORITES

### `GET /api/favorites`  
View user's favorited items.  
**Auth:** Required

### `POST /api/favorites`  
Favorite a product.  
**Auth:** Required

### `DELETE /api/favorites/:id`  
Remove a product from favorites.  
**Auth:** Required

---

## ✍️ REVIEWS 

### `GET /api/products/:id/reviews`  
Fetch reviews for a specific product.  
**Auth:** Optional
**Response:**
```json
{[{
    "id": 1,
    "user": { "id": 3, "username": "mixtapez4life" },
    "rating": 5,
    "comment": "It works perfectly! Took me back to '99."
  }]
  }
```
### `POST /api/products/:id/reviews`  
Create a review.  
**Auth:** Required
**Response:**
```json
{
  "rating": 4,
  "comment": "Awesome Sega Genesis, just needed cleaning."
}
```

### `PUT /api/reviews/:id`  
Edit a review.  
**Auth:** Required
**Response**
```json
{
  "rating": 3,
  "comment": "Changed my mind, the Furby talks too much."
}
```

### `DELETE /api/reviews/:id`  
Delete a review.  
**Auth:** Required

---

## 🛒 CART + CHECKOUT 

### `GET /api/cart`  
View current user's cart items.  
**Auth:** Required
**Response**
```json
{
  [
  {
    "id": 1,
    "product": {
      "id": 8,
      "name": "Y2K Denim Jacket",
      "price": 45.00
    },
    "quantity": 1
  }
]
}
```

### `POST /api/cart`  
Add item to cart.  
**Auth:** Required
**Response**
```json
{
 {
  "product_id": 8,
  "quantity": 2
}
}
```
### `DELETE /api/cart/:item_id`  
Remove item from cart.  
**Auth:** Required

### `POST /api/checkout`  
Complete checkout.  
**Auth:** Required

---

## 🧾 ERROR FORMAT

Errors return a consistent structure:
```json
{ "errors": { "field": "message" } }
```

Example:
```json
{ "errors": { "price": "Price must be a positive number" } }
```


