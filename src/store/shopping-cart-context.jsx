import {createContext, useReducer} from "react";
import {DUMMY_PRODUCTS} from "../dummy-products.js";

const ACTION_ADD_ITEM = "ADD_ITEM";
const ACTION_UPDATE_ITEM = "UPDATE_ITEM";

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {
    },
    itemsUpdateItemQuantity: () => {
    }
});

function shoppingCartReducer(currentState, action) {

    if (action.type === ACTION_ADD_ITEM) {
        const updatedItems = [...currentState.items];

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload.id
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            updatedItems[existingCartItemIndex] = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload.id);
            updatedItems.push({
                id: action.payload.id,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            ...currentState,
            items: updatedItems
        };
    }

    if (action.type === ACTION_UPDATE_ITEM) {
        const updatedItems = [...currentState.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            ...currentState,
            items: updatedItems
        };
    }

    return currentState;
}

export default function CartContextProvider({children}) {

    const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
        items: []
    });

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: ACTION_ADD_ITEM,
            payload: {
                id
            }
        })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: ACTION_UPDATE_ITEM,
            payload: {
                productId,
                amount
            }
        })
    }

    const contextValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        itemsUpdateItemQuantity: handleUpdateCartItemQuantity
    }

    return <CartContext.Provider value={contextValue}>
        {children}
    </CartContext.Provider>
}