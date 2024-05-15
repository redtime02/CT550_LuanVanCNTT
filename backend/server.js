const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require("cors");
const paypal = require("paypal-rest-sdk");

const app = express();
app.use(cookieParser());
app.use(cors());

// Thiết lập kết nối đến cơ sở dữ liệu MongoDB
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/trash-type", require("./routes/trashTypeRoute"));
app.use("/api/location", require("./routes/locationRoute"));
app.use("/api/feedback", require("./routes/feedbackRoute"));
app.use("/api/bonus", require("./routes/bonusItemRoute"));
app.use("/api/reward", require("./routes/rewardedRoute"));
app.use("/api/blog", require("./routes/blogRoute"));

// Đường dẫn đến thư mục chứa hình ảnh
const uploadsDir = "E:/CT550_LuanVanCNTT/backend/uploads/";

// Endpoint GET để hiển thị hình ảnh
app.get("/api/image/*", (req, res) => {
  const imagePath = req.params[0];
  const fullPath = path.join(uploadsDir, imagePath);

  // Phản hồi với nội dung của tệp hình ảnh
  res.sendFile(fullPath);
});

// Thiết lập cấu hình PayPal
paypal.configure({
  mode: "sandbox", // sandbox or live
  client_id:
    "AdOtUOMj1QrXwExOrTsrwZUpyyjAA8QVE1zbbcIFKb5RByJPo1QiUfMXPsX7e_Jiv1o6H_mM250OR4so",
  client_secret:
    "EL2cU0dBIel0CRhetOwJNw-2g9tU_TSUbqr1Pt0mFS4U5YLe_6uo5TK7OOwl_4yYHjSqp-df_QoEI5k-",
});

// Route để tạo đơn hàng PayPal
app.post("/api/create-order", async (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3001/success",
      cancel_url: "http://localhost:3001/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Product",
              sku: "001",
              price: "10.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "10.00",
        },
        description: "Mô tả đơn hàng",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

// Route để xác nhận thanh toán PayPal
app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "10.00",
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.error(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.redirect("/payment-success");
      }
    }
  );
});

app.get("/cancel", (req, res) => res.send("Cancelled"));

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
