
const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const searchProduct = tool(
  async ({ query, token }) => {


    const response = await axios.get(
      `http://localhost:3001/api/products?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return JSON.stringify(response.data);
  },
  {
    name: "searchProduct",
    description: "Search products by query",
    schema: z.object({
      query: z.string(),
    }),
  }
);

const addProductToCart = tool(
  async ({ productId }, config) => {

    const token = config.metadata?.token


    const response = await axios.post(
      "http://localhost:3002/api/carts",
      {
        productId,
        qty: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return JSON.stringify(response.data)
  },
  {
    name: "addProductToCart",
    description: "Add product to cart",
    schema: z.object({
      productId: z.string()
    })
  }
)

module.exports = {
  searchProduct,
  addProductToCart,
};