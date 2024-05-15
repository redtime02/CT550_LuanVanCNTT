import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPal = () => {
  const handlePaymentSuccess = (details, data) => {
    // Xử lý thanh toán thành công
    console.log("Payment was successful!", details);
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AdOtUOMj1QrXwExOrTsrwZUpyyjAA8QVE1zbbcIFKb5RByJPo1QiUfMXPsX7e_Jiv1o6H_mM250OR4so",
      }}
    >
      <div>
        <h1>Thanh toán với PayPal</h1>
        <PayPalButtons
          createOrder={(data, actions) => {
            console.log("Creating order...");
            return actions.order.create({
              purchase_units: [{ amount: { value: "10.00" } }],
            });
          }}
          onApprove={(data, actions) => {
            console.log("Approving payment...");
            return actions.order.capture().then(function (details) {
              handlePaymentSuccess(details, data);
            });
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPal;
