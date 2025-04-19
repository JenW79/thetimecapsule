import { fetchWithAuth } from "../utils/fetchHelpers"; //needed to auth with credentials

// Action Types
export const LOAD_PRODUCTS = "products/load";
export const ADD_PRODUCT = "products/add";
export const UPDATE_PRODUCT = "products/update";
export const DELETE_PRODUCT = "products/delete";
export const FILTER_PRODUCTS = "products/filter";
export const SEARCH_PRODUCTS = "products/search";

// Action Creators
const loadProducts = (products) => ({ type: LOAD_PRODUCTS, products });
const addProduct = (product) => ({ type: ADD_PRODUCT, product });
const updateProduct = (product) => ({ type: UPDATE_PRODUCT, product });
const deleteProduct = (productId) => ({ type: DELETE_PRODUCT, productId });
export const filterProducts = (filterCriteria) => ({
  type: FILTER_PRODUCTS,
  filterCriteria,
});
export const searchProducts = (searchTerm) => ({
  type: SEARCH_PRODUCTS,
  searchTerm,
});

// THUNKS

export const fetchProducts =
  (query = "") =>
  async (dispatch) => {
    const res = await fetch(`/api/products${query}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(loadProducts(data));
      return data;
    } else {
      const error = await res.json();
      return error;
    }
  };

export const fetchProduct = (productId) => async (dispatch) => {
  if (!productId || typeof productId !== "number" || productId <= 0) {
    console.warn("Invalid productId in fetchProduct:", productId);
    return { error: "Invalid product ID." };
  }

  const res = await fetch(`/api/products/${productId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(addProduct(data));
    return data;
  } else {
    const error = await res.json();
    return error;
  }
};

export const createProduct = (payload) => async (dispatch) => {
  const res = await fetchWithAuth("/api/products", "POST", payload);
  if (res.ok) {
    const data = await res.json();
    dispatch(addProduct(data));
    return data;
  } else {
    const error = await res.json();
    return error;
  }
};

export const editProduct = (productId, payload) => async (dispatch) => {
  const res = await fetchWithAuth(`/api/products/${productId}`, "PUT", payload);
  if (res.ok) {
    const data = await res.json();
    dispatch(updateProduct(data));
    return data;
  } else {
    const error = await res.json();
    return error;
  }
};

export const removeProduct = (productId) => async (dispatch) => {
  const res = await fetchWithAuth(`/api/products/${productId}`, "DELETE");
  if (res.ok) {
    dispatch(deleteProduct(productId));
    return { message: "Product deleted" };
  } else {
    const error = await res.json();
    return error;
  }
};

export const fetchProductsByCategory = (categoryId) => async (dispatch) => {
  const res = await fetch(`/api/categories/${categoryId}/products`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadProducts(data));
    return data;
  } else {
    const error = await res.json();
    return error;
  }
};

export const fetchProductsBySearch = (searchTerm) => async (dispatch) => {
  const res = await fetch(
    `/api/products/search?term=${encodeURIComponent(searchTerm)}`
  );
  if (res.ok) {
    const data = await res.json();
    dispatch(loadProducts(data));
    return data;
  } else {
    const error = await res.json();
    return error;
  }
};

export const fetchCurrentUserProducts = () => async (dispatch) => {
  const res = await fetchWithAuth("/api/products/current", "GET");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadProducts(data));
    return data;
  } else {
    const error = await res.json();
    return error;
  }
};

// REDUCER

const initialState = {};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PRODUCTS: {
      const newState = {};
      action.products.forEach((product) => {
        newState[product.id] = product;
      });
      return newState;
    }
    case ADD_PRODUCT:
      return { ...state, [action.product.id]: action.product };
    case UPDATE_PRODUCT:
      return { ...state, [action.product.id]: action.product };
    case DELETE_PRODUCT: {
      const stateCopy = { ...state };
      delete stateCopy[action.productId];
      return stateCopy;
    }
    default:
      return state;
  }
}
