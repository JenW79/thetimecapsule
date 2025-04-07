
# 🕹️ Retro Marketplace API Documentation  
_A vintage-themed eCommerce API for 80s, 90s, and 00s lovers_

## PRODUCTS

### `GET /api/products`
**Description:** Fetch all available retro products  
**Auth:** Optional  
**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Game Boy Color",
    "price": 79.99,
    "image_url": "https://...",
    "owner": { "id": 2, "username": "retroQueen90" }
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
  "image_url": "https://..."
}
```

---

### `PUT /api/products/:id`
**Description:** Update a product listing (owner only)  
**Auth:** Required  
**Body Example:**
```json
{
  "price": 19.99
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

## FAVORITES

### `GET /api/favorites`
**Description:** View your favorited retro goodies  
**Auth:** Required  
**Example Response:**
```json
[
  {
    "id": 1,
    "product": {
      "id": 5,
      "name": "Lisa Frank Stickers",
      "price": 12.00
    }
  }
]
```

---

### `POST /api/favorites`
**Description:** Favorite a product (like Pokémon cards or lava lamps)  
**Auth:** Required  
**Body Example:**
```json
{
  "product_id": 5
}
```

---

### `DELETE /api/favorites/:id`
**Description:** Unfavorite a product  
**Auth:** Required  
**Response:**
```json
{ "message": "Removed from favorites" }
```

---

## REVIEWS

### `GET /api/products/:id/reviews`
**Description:** View reviews for a specific product (e.g., "Walkman with cassette tape")  
**Auth:** Optional  
**Example Response:**
```json
[
  {
    "id": 1,
    "user": { "id": 3, "username": "mixtapez4life" },
    "rating": 5,
    "comment": "It works perfectly! Took me back to '99."
  }
]
```

---

### `POST /api/products/:id/reviews`
**Description:** Leave a review on a product  
**Auth:** Required  
**Body Example:**
```json
{
  "rating": 4,
  "comment": "Awesome Sega Genesis, just needed cleaning."
}
```

---

### `PUT /api/reviews/:id`
**Description:** Edit your review  
**Auth:** Required  
**Body Example:**
```json
{
  "rating": 3,
  "comment": "Changed my mind, the Furby talks too much."
}
```

---

### `DELETE /api/reviews/:id`
**Description:** Remove your review  
**Auth:** Required  
**Response:**
```json
{ "message": "Review deleted" }
```

---

## CART + CHECKOUT

### `GET /api/cart`
**Description:** View all items in your cart (e.g., NSYNC CDs, Beanie Babies)  
**Auth:** Required  
**Example Response:**
```json
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
```

---

### `POST /api/cart`
**Description:** Add a product to your cart  
**Auth:** Required  
**Body Example:**
```json
{
  "product_id": 8,
  "quantity": 2
}
```

---

### `DELETE /api/cart/:item_id`
**Description:** Remove an item from your cart  
**Auth:** Required  
**Response:**
```json
{ "message": "Item removed from cart" }
```

---

### `POST /api/checkout`
**Description:** Complete your purchase (and score some retro treasures)  
**Auth:** Required  
**Response:**
```json
{ "message": "Checkout successful! Enjoy your nostalgia trip!" }
```

---
