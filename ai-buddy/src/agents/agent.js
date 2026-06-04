
const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const {ToolMessage,AIMessage,HumanMessage} = require('@langchain/core/messages')

const tools = require("./tools");
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.5,
});

const modelWithTools = model.bindTools([
  tools.searchProduct,
  tools.addProductToCart,
]);

const graph = new StateGraph(MessagesAnnotation)

 .addNode("chat", async (state, config) => {

    console.log("CHAT NODE STARTED");

    const response = await model.invoke(
        state.messages,
        {
            tools: [
                tools.searchProduct,
                tools.addProductToCart
            ]
        }
    );

    console.log("MODEL RESPONSE --->", response);

    state.messages.push(response);

    return state;
})
  .addNode("tools", async (state, config) => {

    console.log("TOOLS NODE STARTED");

    console.log("TOOLS CONFIG", JSON.stringify(config,null,2));

    const lastMessage =
      state.messages[state.messages.length - 1];

    const toolCalls =
      lastMessage.tool_calls || [];

    const toolResults = await Promise.all(
      toolCalls.map(async (call) => {

        console.log("Tool Calling:", call.name);

        const selectedTool =
          tools[call.name];

        if (!selectedTool) {
          throw new Error(
            `Tool ${call.name} not found`
          );
        }

        console.log("CONFIG --->", config);
console.log("TOKEN --->", config?.metadata?.token);

        const result =
          await selectedTool.invoke({
            ...call.args,
            token: config.metadata.token,
          });

          

        return new ToolMessage({
          content: result,
          tool_call_id: call.id,
        });
      })
    );

    state.messages.push(...toolResults);

    return state;
  })

  .addEdge("__start__", "chat")

  .addConditionalEdges(
    "chat",
    async (state) => {

      const lastMessage =
        state.messages[state.messages.length - 1];

      if (
        lastMessage.tool_calls &&
        lastMessage.tool_calls.length > 0
      ) {
        return "tools";
      }

      return "__end__";
    }
  )

  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = agent;