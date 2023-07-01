window.addEventListener("load", () => {
  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "/shopping-cart-js/Login";
  }
  fetchProducts();
});

const products = document.getElementsByClassName("products")[0];

let productsObj;

const fetchProducts = async () => {
  try {
    const productsJSON = await fetch("https://fakestoreapi.com/products");
    productsObj = await productsJSON.json();
    console.log("prdocuts", productsObj);
    products.innerHTML = "";
    productsObj.forEach((product) => displayProduct(product));
  } catch (error) {
    console.log(error);
  }
};

const fetchProductsByCategory = async (category) => {
  try {
    const productsJSON = await fetch("https://fakestoreapi.com/products");
    productsObj = await productsJSON.json();
    console.log("prdocuts", productsObj);
    products.innerHTML = "";
    productsObj.forEach((product) => {
      if (category === "all" || product.category === category) {
        displayProduct(product);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const displayProduct = (product) => {
  product.color = randomColor();
  product.size = randomSize();

  const filterValue = document.getElementById("search-btn").value;
  // console.log(filterValue, product.title.toLowerCase().indexOf(filterValue.toLowerCase()));

  if (product.title.toLowerCase().indexOf(filterValue.toLowerCase()) < 0)
    return;

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

const addToCart = async (id) => {
  const product = productsObj.filter((p) => p.id === id)[0];
  console.log(product);
  let cart = await JSON.parse(localStorage.getItem("cart"));
  if (!cart) cart = [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart successfully");
  //   return;
};

const randomColor = () => {
  let colors = ["Red", "Blue", "Green", "Black", "White"];
  return colors[Math.floor(Math.random() * 5)];
};

const randomSize = () => {
  let sizes = ["S", "M", "X", "L"];
  return sizes[Math.floor(Math.random() * 4)];
};

document
  .getElementById("search-symbol")
  .addEventListener("click", fetchProducts);

document.getElementById("filter-btn").addEventListener("click", () => {
  event.preventDefault();
});

let categoryBtns = document.getElementsByClassName("category");

console.log(categoryBtns);

for (let i = 0; i < categoryBtns.length; i++) {
  let category = categoryBtns[i];
  category.addEventListener("click", () => {
    console.log(category, category.id);
    fetchProductsByCategory(category.id);
    document
      .getElementsByClassName("selected-category")[0]
      .classList.remove("selected-category");
    category.classList.add("selected-category");
    document.getElementById('category-name').innerText = category.id.toLocaleUpperCase();
  });
}

const isLoggedIn = () => {
  return !!localStorage.getItem("currentUser");
};

document.getElementById("range-input").addEventListener("change", () => {
  document.getElementById("range-max-value").innerText =
    document.getElementById("range-input").value;
});

document.getElementById("filter-btn").addEventListener("click", async () => {
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
  for (let i = 0; i < sizesInput; i++) {
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
    const productsJSON = await fetch("https://fakestoreapi.com/products");
    productsObj = await productsJSON.json();
    console.log("prdocuts", productsObj);
    products.innerHTML = "";
    productsObj.forEach((product) =>
      displayFilterProduct(product, colors, sizes, rating, prices)
    );
  } catch (error) {
    console.log(error);
  }
});

// Display Filtered Product
const displayFilterProduct = (product, colors, sizes, rating, prices) => {

  const filterValue = document.getElementById("search-btn").value;
  // console.log(filterValue, product.title.toLowerCase().indexOf(filterValue.toLowerCase()));

  if (product.title.toLowerCase().indexOf(filterValue.toLowerCase()) < 0)
    return;

  if (!colors.contains(product.color)) return;
  if (!sizes.contains(product.size)) return;
  if (rating > product.rating) return;

  if (!inPriceRange(product.price, prices)) return;

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

const inPriceRange = (price, ranges) => {
  for (let i = 0; i < ranges.length; i++) {
    switch (ranges.id) {
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
