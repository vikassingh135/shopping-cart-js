window.addEventListener("load", () => {
  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "/shopping-cart-js/Login";
  }
});

const products = document.getElementsByClassName("products")[0];

let productsObj, cartValue;

const fetchProducts = async () => {
  try {
    productsObj = await JSON.parse(localStorage.getItem("cart"));
    // console.log("prdocuts",productsObj);
    if (!productsObj) productsObj = [];
    products.innerHTML = "";
    document.getElementsByClassName("purchased-items")[0].innerHTML = "";
    productsObj.forEach((product, id) => {
      displayProduct(product, id);
      displayProductInCheckout(product, id);
      calculateTotalValue(productsObj);
    });
  } catch (error) {
    console.log(error);
  }
};

const displayProduct = (product, id) => {
  products.innerHTML += `
        <div class="product">
              <div class="image">
                <img
                  src=${product.image}
                />
              </div>
              <div class="details">
                <div class="product-title">
                   ${product.title.substr(0, 40)}
                </div>
                <div class="price-size">
                  <div class="price">Price : $${product.price}</div>
                  <div class="size">Size : L</div>
                </div>
                </div>
              <div class="add-cart-btn">
                <button onclick='removeProduct(${id})'>Remove From Cart</button>
              </div>
        </div>
    `;
};

const removeProduct = async (id) => {
  productsObj = await JSON.parse(localStorage.getItem("cart"));
  // console.log("prdocuts",productsObj);
  productsObj.splice(id,1);
  localStorage.setItem('cart', JSON.stringify(productsObj));
  fetchProducts();
};

const displayProductInCheckout = (product, id) => {
  const purchasedItem = document.getElementsByClassName("purchased-items")[0];

  purchasedItem.innerHTML += `
      <div class="item">
        <div>${id + 1}.</div>
        <div class="title">
           ${product.title.substr(0, 40)} 
         </div>
      <div class="price">
            ${product.price}
         </div>
      </div>
      `;
};

const calculateTotalValue = (productsObj) => {
  totalValue = 0;
  productsObj.forEach((product) => (totalValue += product.price));
  document.getElementById("total-price").innerText = `$ ${totalValue.toFixed(
    3
  )}`;
  cartValue = totalValue*100;
};

fetchProducts();
// Payment
var options = {
  key: "rzp_test_SvLkqBRU6KmZIi", // Enter the Key ID generated from the Dashboard
  amount: "1000",
  currency: "INR",
  description: "Acme Corp",
  image: "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg",
  prefill: {
    email: "gaurav.kumar@example.com",
    contact: +919900000000,
  },
  config: {
    display: {
      blocks: {
        utib: {
          //name for Axis block
          name: "Pay using Axis Bank",
          instruments: [
            {
              method: "card",
              issuers: ["UTIB"],
            },
            {
              method: "netbanking",
              banks: ["UTIB"],
            },
          ],
        },
        other: {
          //  name for other block
          name: "Other Payment modes",
          instruments: [
            {
              method: "card",
              issuers: ["ICIC"],
            },
            {
              method: "netbanking",
            },
          ],
        },
      },
      hide: [
        {
          method: "upi",
        },
      ],
      sequence: ["block.utib", "block.other"],
      preferences: {
        show_default_blocks: false, // Should Checkout show its default blocks?
      },
    },
  },
  handler: function (response) {
    alert(response.razorpay_payment_id);
    alert("Items Purchased Successfully");
    localStorage.setItem("cart", JSON.stringify([]));
    document.getElementById("total-price").innerText = `$ 0`;
    fetchProducts();
  },
  modal: {
    ondismiss: function () {
      if (confirm("Are you sure, you want to close the form?")) {
        txt = "You pressed OK!";
        console.log("Checkout form closed by the user");
      } else {
        txt = "You pressed Cancel!";
        console.log("Complete the Payment");
      }
    },
  },
};

var rzp1 = new Razorpay(options);
document.getElementById("rzp-button1").onclick = function (e) {
  options.amount = cartValue;
  rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
};

const isLoggedIn = () => {
  return !!localStorage.getItem("currentUser");
};
