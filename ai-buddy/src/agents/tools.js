// const {tool} = require('@langchain/core/tools')
// const {z} = require('zod')
// const axios = require('axios')

// const searchProduct = tool(async ({query,token})=>{
 
//     console.log('searchProduct called with data --------------->',{query,token});


//     const response = await axios.get(`http://localhost:3001/api/products?q=${query}`,{
//         headers:{
//             Authorization:`Bearer ${token}`
//         }
//     }) 
//     return JSON.stringify(response.data)
// },{
//     name:"searchProduct",
//     description:"Search for product based on a query",
//     schema:z.object({
//         query:z.string().describe("The search query for product")
//     })
// })


// const addProductToCart = tool(async({productId,qty=1,token})=>{  

    
        
// const response = await axios.post(`http://localhost:3002/api/carts/`,{
//     productId,
//     qty
// },{
//     headers:{
//         Authorization:`Bearer ${token}`
//     }
// })   
// return `Added product with with id ${productId} (qty:${qty}) to cart`

// },{
//     name:"addProductToCart",
//     description:"Add a product to the shopping cart",
//     schema:z.object({
//         productId:z.string().describe("The id of the product to add to the cart"),
//         qty:z.number().describe("The quantity of the product to add to the cart").default(1)
//     })
// }) 



// module.exports = {
//     searchProduct,
//     addProductToCart
// }









const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const searchProduct = tool(
  async ({ query, token }) => {

    console.log("searchProduct called:", query);

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

    console.log("PRODUCT ID:", productId)
    console.log("TOKEN:", token)

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