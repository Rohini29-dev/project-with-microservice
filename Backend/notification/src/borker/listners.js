const { subscribeToQueue } = require("./borker");
const {sendEmail} = require('../email')


module.exports = function () {
    subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED",async (data)=>{
    console.log('Received data from queue:',data);

  const emailHTMLTemplate = `
    
    <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
    ">

        <div style="
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        ">

            <h1 style="
                color: #4CAF50;
                text-align: center;
            ">
                Welcome to Our Service 🎉
            </h1>

            <p style="
                font-size: 16px;
                color: #333;
            ">
                Dear 
                <strong>
                    ${data.fullName.firstName} 
                    ${data.fullName.lastName || ""}
                </strong>,
            </p>

            <p style="
                font-size: 15px;
                color: #555;
                line-height: 1.6;
            ">
                Thank you for registering with us. 
                We're excited to have you on board 🚀
            </p>

            <p style="
                font-size: 15px;
                color: #555;
                line-height: 1.6;
            ">
                You can now explore our platform and enjoy all the features we provide.
            </p>

            <div style="text-align: center; margin-top: 30px;">
                
                <a href="#"
                    style="
                        background-color: #4CAF50;
                        color: white;
                        padding: 12px 25px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                    "
                >
                    Get Started
                </a>

            </div>

            <p style="
                margin-top: 40px;
                font-size: 14px;
                color: #777;
            ">
                Best Regards, <br />
                <strong>The Team</strong>
            </p>

        </div>

    </div>

`;
    await sendEmail(
    data.email,
    "Welcome to our Service",
    "Thank you for registering with us!",
    emailHTMLTemplate
);
    
})


subscribeToQueue(
    "PAYMENT_NOTIFICATION.PAYMENT_INITIATED",
    async (data) => {

        const emailHTMLTemplate = `
        
        <div style="
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
        ">

            <div style="
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            ">

                <h1 style="
                    color: #007bff;
                    text-align: center;
                ">
                    Payment Initiated 💳
                </h1>

                <p style="
                    font-size: 16px;
                    color: #333;
                ">
                    Hello 
                    <strong>
                        ${data.fullName}
                    </strong>,
                </p>

                <p style="
                    font-size: 15px;
                    color: #555;
                    line-height: 1.6;
                ">
                    Your payment process has been initiated successfully 🚀
                </p>

                <p style="
                    font-size: 15px;
                    color: #555;
                    line-height: 1.6;
                ">
                    Please find your payment details below.
                </p>

                <div style="
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                ">

                    <h3 style="
                        margin-top: 0;
                        color: #333;
                    ">
                        Payment Details
                    </h3>

                    <p style="
                        font-size: 15px;
                        color: #555;
                    ">
                        <strong>Order ID:</strong> 
                        ${data.orderId}
                    </p>

                    <p style="
                        font-size: 15px;
                        color: #555;
                    ">
                        <strong>Amount:</strong> 
                        ${data.amount} ${data.currency.toUpperCase()}
                    </p>

                    <p style="
                        font-size: 15px;
                        color: #555;
                    ">
                        <strong>Status:</strong> Pending
                    </p>

                </div>

                <div style="
                    text-align: center;
                    margin-top: 30px;
                ">
                    
                    <a href="http://localhost:5173/orders"
                        style="
                            background-color: #007bff;
                            color: white;
                            padding: 12px 25px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                        "
                    >
                        View Order
                    </a>

                </div>

                <p style="
                    margin-top: 40px;
                    font-size: 14px;
                    color: #777;
                ">
                    Thank you for shopping with us ❤️
                </p>

            </div>

        </div>

        `;

        await sendEmail(
            data.email,
            "Payment Initiated Successfully",
            "Your payment has been initiated successfully",
            emailHTMLTemplate
        );

        console.log("Payment initiated email sent");

    }
);



subscribeToQueue(
  "PAYMENT_NOTIFICATION.PAYMENT_COMPLETE",
  async (data) => {

    

   const emailHTMLTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        
        <h1 style="color: #22c55e;">Payment Successful 🎉</h1>

        <p>Dear <strong>${data.username}</strong>,</p>

        <p>
            Thank you for your payment. Your transaction has been completed successfully.
        </p>

        <div style="
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        ">
            <h3>Payment Details</h3>

            <p><strong>Order ID:</strong> ${data.orderId}</p>

            <p><strong>Payment ID:</strong> ${data.paymentId}</p>

            <p><strong>Amount Paid:</strong> ${data.amount} ${data.currency}</p>
        </div>

        <p>
            We appreciate your trust in our service.
        </p>

        <p>
            If you have any questions, feel free to contact our support team.
        </p>

        <br />

        <p>
            Best Regards, <br />
            <strong>Your Team</strong>
        </p>
    </div>
`;;

    await sendEmail(
      data.email,
      "Payment Successful",
      "Your payment has been completed successfully.",
      emailHTMLTemplate
    );
  }
);
 

subscribeToQueue(
  "PAYMENT_NOTIFICATION.PAYMENT_FAILED",
  async (data) => {

    const emailHTMLTemplate = `

    <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
    ">

        <div style="
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        ">

            <h1 style="
                color: #e53935;
                text-align: center;
            ">
                Payment Failed ❌
            </h1>

            <p style="
                font-size: 16px;
                color: #333;
                line-height: 1.6;
            ">
                We were unable to process your payment successfully.
            </p>

            <p style="
                font-size: 15px;
                color: #555;
                line-height: 1.6;
            ">
                Please try again after some time or use another payment method.
            </p>

            <div style="
                background-color: #fff5f5;
                padding: 20px;
                border-radius: 8px;
                margin-top: 25px;
                border: 1px solid #f5c2c2;
            ">

                <h3 style="color:#333;">
                    Transaction Details
                </h3>

                <p>
                    <strong>Order ID:</strong>
                    ${data.ordersId || "N/A"}
                </p>

                <p>
                    <strong>Payment ID:</strong>
                    ${data.paymentId || "N/A"}
                </p>

                <p>
                    <strong>Status:</strong>
                    Failed
                </p>

            </div>

            <div style="
                text-align: center;
                margin-top: 30px;
            ">

                <a href="#"
                    style="
                        background-color: #e53935;
                        color: white;
                        padding: 12px 25px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                    "
                >
                    Retry Payment
                </a>

            </div>

            <p style="
                margin-top: 40px;
                font-size: 14px;
                color: #777;
                line-height: 1.6;
            ">
                If any amount was deducted from your bank account,
                it will usually be refunded automatically within a few business days.
            </p>

            <p style="
                font-size: 14px;
                color: #777;
            ">
                Best Regards, <br />
                <strong>The Team</strong>
            </p>

        </div>

    </div>

    `;

    await sendEmail(
      data.email,
      "Payment Failed",
      "Your payment could not be completed.",
      emailHTMLTemplate
    );
  }
);

subscribeToQueue(
    "PRODUCT_NOTIFICATION.PRODUCT_CREATED",
    async (data) => {

        const emailHTMLTemplate = `
        
        <div style="
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
        ">

            <div style="
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            ">

                <h1 style="
                    color: #4CAF50;
                    text-align: center;
                ">
                    Product Created Successfully 🎉
                </h1>

                <p style="
                    font-size: 16px;
                    color: #333;
                ">
                    Hello Seller,
                </p>

                <p style="
                    font-size: 15px;
                    color: #555;
                    line-height: 1.6;
                ">
                    Your product has been added successfully to the platform 🚀
                </p>

                <div style="
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                ">

                    <h3 style="
                        margin-top: 0;
                        color: #333;
                    ">
                        Product Details
                    </h3>

                    <p style="
                        font-size: 15px;
                        color: #555;
                    ">
                        <strong>Product ID:</strong> 
                        ${data.productId}
                    </p>

                    <p style="
                        font-size: 15px;
                        color: #555;
                    ">
                        <strong>Seller ID:</strong> 
                        ${data.sellerId}
                    </p>

                    <p style="
                        font-size: 15px;
                        color: #555;
                    ">
                        <strong>Status:</strong> Active
                    </p>

                </div>

                <div style="
                    text-align: center;
                    margin-top: 30px;
                ">
                    
                    <a href="http://localhost:5173/seller/products"
                        style="
                            background-color: #4CAF50;
                            color: white;
                            padding: 12px 25px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                        "
                    >
                        Manage Products
                    </a>

                </div>

                <p style="
                    margin-top: 40px;
                    font-size: 14px;
                    color: #777;
                ">
                    Thank you for selling with us ❤️
                </p>

            </div>

        </div>

        `;

        await sendEmail(
            data.email,
            "Product Created Successfully",
            "Your product has been created successfully",
            emailHTMLTemplate
        );

        console.log("Product creation email sent");

    }
);


}






