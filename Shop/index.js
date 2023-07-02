window.addEventListener("load", () => {
  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "/shopping-cart-js/Login";
  }
  showFilteredProduct();
});

let productsObj;


//function to show filtered product
const showFilteredProduct = async () => {
  let colors = [];
  let sizes = [];
  let rating = 0;
  let prices = [];

  let colorsInput = document.getElementsByClassName("color");
  for (let i = 0; i < colorsInput.length; i++) {
    let color = colorsInput[i];
    if (color.checked) colors.push(color.id);
  }

  let sizesInput = document.getElementsByClassName("size");
  for (let i = 0; i < sizesInput.length; i++) {
    let size = sizesInput[i];
    if (size.checked) sizes.push(size.id);
  }

  rating = document.getElementById("range-input").value;

  let pricesInput = document.getElementsByClassName("price");
  for (let i = 0; i < pricesInput.length; i++) {
    let price = pricesInput[i];
    if (price.checked) prices.push(price.id);
  }

  try {
    const products = document.getElementsByClassName("products")[0];
    const productsJSON = await fetch("https://fakestoreapi.com/products");
    productsObj = await productsJSON.json();
    console.log("prdocuts", productsObj);
    products.innerHTML = "";
    const category = document.getElementsByClassName("selected-category")[0].id;
    productsObj.forEach((product) => {
      //category checking
      if (category === "all" || product.category === category) {
        displayFilterProduct(product, colors, sizes, rating, prices);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

document
  .getElementById("filter-btn")
  .addEventListener("click", showFilteredProduct);

// Display Filtered Product
const displayFilterProduct = (product, colors, sizes, rating, prices) => {
  const products = document.getElementsByClassName("products")[0];

  product.color = randomColor();
  product.size = randomSize();

  const filterValue = document.getElementById("search-btn").value;

  if (product.title.toLowerCase().indexOf(filterValue.toLowerCase()) < 0)
    return;

  console.log(colors, prices, sizes, rating, parseInt(rating));

  if (colors.length > 0 && !isElementContains(product.color, colors)) {
    console.log("color does not matched");
    return;
  }

  if (sizes.length > 0 && !isElementContains(product.size, sizes)) {
    console.log("size does not matched");
    return;
  }

  if (rating < product.rating.rate) return;

  if (prices.length > 0 && !inPriceRange(product.price, prices)) return;

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
                  <div class="price"><b>Price :</b> $${product.price}</div>
                  <div class="size"><b>Size :</b> ${product.size}</div>
                </div>
                <div class="color"><b>Color :</b> ${product.color}</div>
                <div class="rating"><b>Rating :</b> ${
                  product.rating.rate
                }/5</div>
              </div>
              <div class="add-cart-btn">
                <button onclick="addToCart(${product.id})">Add To Cart</button>
              </div>
        </div>
     `;
};

//function to add item to cart
const addToCart = async (id) => {
  const product = productsObj.filter((p) => p.id === id)[0];
  console.log(product);
  let cart = await JSON.parse(localStorage.getItem("cart"));
  if (!cart) cart = [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product Added to cart successfully");
  //   return;
};

// function to find random color
const randomColor = () => {
  let colors = ["Red", "Blue", "Green", "Black", "White"];
  return colors[Math.floor(Math.random() * 5)];
};

// function to find random size
const randomSize = () => {
  let sizes = ["S", "M", "X", "L"];
  return sizes[Math.floor(Math.random() * 4)];
};

// on search click show filtered products
document
  .getElementById("search-symbol")
  .addEventListener("click", showFilteredProduct);

// category btns and listener
let categoryBtns = document.getElementsByClassName("category");

// console.log(categoryBtns);

for (let i = 0; i < categoryBtns.length; i++) {
  let category = categoryBtns[i];
  category.addEventListener("click", () => {
    console.log(category, category.id);
    document
      .getElementsByClassName("selected-category")[0]
      .classList.remove("selected-category");
    category.classList.add("selected-category");
    document.getElementById("category-name").innerText =
      category.id.toLocaleUpperCase();
    showFilteredProduct();
  });
}

// check if user is logged in
const isLoggedIn = () => {
  return !!localStorage.getItem("currentUser");
};

// change range input max value
document.getElementById("range-input").addEventListener("change", () => {
  document.getElementById("range-max-value").innerText =
    document.getElementById("range-input").value;
});

//price filter function
const inPriceRange = (price, ranges) => {
  console.log("price and ranges", price, ranges);

  for (let i = 0; i < ranges.length; i++) {
    switch (ranges[i]) {
      case "price25":
        if (price >= 0 && price <= 25) return true;
        break;
      case "price50":
        if (price >= 25 && price <= 50) return true;
        break;
      case "price100":
        if (price >= 50 && price <= 100) return true;
        break;
      case "price101":
        if (price > 100) return 100;
        break;
      default:
        break;
    }
  }
  return false;
};

// is element contains
const isElementContains = (element, elements) => {
  for (let i of elements) {
    if (i == element) return true;
  }
  return false;
};
