const cartModel = require("../models/cart.model");

// =========================================
// ADD ITEM TO CART
// =========================================

async function addItemToCarts(req, res) {
  try {
    const { productId, qty } = req.body;
    const user = req.user;

    let cart = await cartModel.findOne({
      user: user.id,
    });

    if (!cart) {
      cart = new cartModel({
        user: user.id,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += qty;
    } else {
      cart.items.push({
        productId,
        quantity: qty,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Cart added successfully",
      cart,
      itemCounts: cart.items.length,
      totalQuantity: cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    });
  } catch (error) {
    console.log("Add cart item error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// =========================================
// UPDATE ITEM QUANTITY
// =========================================

async function updateItemQuantity(req, res) {
  try {
    const { productId } = req.params;
    const { qty } = req.body;
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

    // +1 or -1 quantity change
    cart.items[itemIndex].quantity += qty;

    // If quantity becomes 0 or less,
    // remove the item from cart
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    return res.status(200).json({
      message: "Item quantity updated successfully",
      cart,
      itemCounts: cart.items.length,
      totalQuantity: cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    });
  } catch (error) {
    console.log("Update item quantity error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// =========================================
// GET CART
// =========================================

async function getCart(req, res) {
  try {
    const user = req.user;

    let cart = await cartModel.findOne({
      user: user.id,
    });

    if (!cart) {
      cart = new cartModel({
        user: user.id,
        items: [],
      });

      await cart.save();
    }

    return res.status(200).json({
      cart,
      itemCounts: cart.items.length,
      totalQuantity: cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    });
  } catch (error) {
    console.log("Get cart error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// =========================================
// REMOVE ITEM FROM CART
// =========================================

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
    console.log("Remove cart item error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// =========================================
// EXPORT
// =========================================

module.exports = {
  addItemToCarts,
  updateItemQuantity,
  getCart,
  removeCartItem,
};