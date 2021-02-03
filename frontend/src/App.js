import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";

function App() {
  const [product, setProduct] = useState({
    name: "React",
    price: 10,
    productBy: "Facebook",
  });

  const makePayment = (token) => {
    //this is here we hit the frondend for token
    //first we need to design a body
    const body = { token, product };
    const headers = {
      "Content-Type": "application/json",
    };
    //we will fire up a backend here
    return fetch("http://localhost:8282/payment", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response, "response");
        const { status } = response;
        console.log("status", status);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <StripeCheckout
          stripeKey="pk_test_51Ho8xdBakjPsKX7TfKogorOVnH0c5bC9G6f2cs4BuRpGBphK4YJdxlF6F5LyemSOOgJJ31hPEvjAn8juegQR6dRs00cHHBs9Ot"
          token={makePayment}
          name="Buy 7Sky Solutions"
          amount={product.price * 100}
        >
          <button style={{ background: "blue", color: "white", padding: 10 }}>
            Buy Subscription in just {product.price} $
          </button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
