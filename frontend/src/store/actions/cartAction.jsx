import { addToCart, getCart, removeCartItem, updateCartItem } from "../../services/cart.service";
import { loadcart } from "../reducers/cartSlice";

export const asyncloadCart =
  () => async (dispatch) => {
    try {
      const  {data}  = await getCart();

      console.log(
        "ALL CART RESPONSE =>",
        data
      );


      dispatch(
        loadcart(data)
      );

      return data;

    } catch (error) {
      console.log(
        "LOAD PRODUCTS ERROR =>",
        error
      );

      throw error;
    }
  };
export const asyncAddCart =
  (productId, quantity = 1) => async (dispatch) => {
    try {
      const { data } = await addToCart(
        productId,
        quantity
      );

      console.log(
        "ADD CART RESPONSE =>",
        data
      );

      dispatch(
        loadcart(data)
      );

      return data;

    } catch (error) {
      console.log(
        "ADD CART ERROR =>",
        error
      );

      throw error;
    }
  };

  export const asyncupdateCart =
    (id, qty) => async (dispatch) => {
      try {
        const res =
          await updateCartItem(
            id,
            qty
          );
  
        console.log(
          "UPDATE CART RESPONSE =>",
          res
        );
  
        // Refresh all products
        await dispatch(
          asyncloadCart()
        );
  
        return res;
  
      } catch (error) {
        console.log(
          "UPDATE PRODUCT ERROR =>",
          error
        );
  
        throw error;
      }
    };


    export const asyncdremoveCart =
      (id) => async (dispatch) => {
        try {
          const res =
            await removeCartItem(id);
    
          console.log(
            "DELETE Cart RESPONSE =>",
            res
          );
    
          // Refresh all products
          await dispatch(
            asyncloadCart()
          );
    
          return res;
    
        } catch (error) {
          console.log(
            "DELETE PRODUCT ERROR =>",
            error
          );
    
          throw error;
        }
      };