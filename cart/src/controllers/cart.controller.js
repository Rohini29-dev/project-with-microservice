const cartModel = require("../models/cart.model");

async function addItemToCarts(req, res) {
  try {
    const { productId, qty } = req.body;
    const user = req.user;

    
    
    let cart = await cartModel.findOne({ user: user.id });

    if (!cart) {
      cart = new cartModel({ user: user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();

    return res.status(200).json({
      message: "cart added successfully",
      cart,
    });

  } catch (error) {
    console.log("error---->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updateItemQuantity(req, res) {
  try {
    const { productId } = req.params; 
    const { qty } = req.body;
    const user = req.user;

    const cart = await cartModel.findOne({ user: user.id });

    if (!cart) {
      return res.status(404).json({
        message: 'cart not found'
      });
    }

    const existsItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existsItemIndex < 0) {
      return res.status(404).json({
        message: 'cart item not found'
      });
    }

    cart.items[existsItemIndex].quantity += qty;

if (cart.items[existsItemIndex].quantity <= 0) {
  cart.items.splice(existsItemIndex, 1);
}

await cart.save();

return res.status(200).json({
  message: "Cart updated",
  cart,
  itemCounts: cart.items.length,
  totalQuantity: cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  ),
});

  } catch (error) {
    console.log('updating item error', error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}


async function getCart(req, res) {
  try {
    const user = req.user;

    let cart = await cartModel.findOne({ user: user.id }); 

    

    

    if (!cart) {
      cart = new cartModel({ user: user.id, items: [] });
      await cart.save(); 
    }

    return res.status(200).json({
      cart,
      itemCounts: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0)
    });

  } catch (error) {
    console.log("get cart error", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

async function removeCartItem(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    const cart = await cartModel.findOne({
      user: user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();


    return res.status(200).json({
      message: "Item removed successfully",
      cart,
      itemCounts: cart.items.length,
      totalQuantity: cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
    addItemToCarts,
    updateItemQuantity,
    getCart,
    removeCartItem
}

