import { createContext, useReducer } from 'react';

// Create a context for the store
export const Store = createContext();

// Define the initial state for the store
const initialState = {
  cart: {
    // Initialize cartItems with data from localStorage or an empty array if not available
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

// Define the reducer function to handle state changes based on actions
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // Action to add an item to the cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
          item._id === existItem._id ? newItem : item
        )
        : [...state.cart.cartItems, newItem];
      // Update localStorage with the modified cartItems
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      // Return the updated state
      return { ...state, cart: { ...state.cart, cartItems } };
    // Action to remove an item from the cart
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      // Update localStorage with the modified cartItems
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      // Return the updated state
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
      };
    default:
      // Default case, return the current state if action type is not recognized
      return state;
  }
}

// Create a provider component to wrap the app and provide the store's state and dispatch function
export function StoreProvider(props) {
  // Use the useReducer hook to manage state and actions
  const [state, dispatch] = useReducer(reducer, initialState);
  // Create a value object to pass the state and dispatch function as context value
  const value = { state, dispatch };
  // Provide the value to the components within the Store.Provider
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
