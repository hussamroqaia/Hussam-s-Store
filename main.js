let products = [];
let localProducts = JSON.parse(localStorage.getItem("products"));
products = localProducts;
let productsWishList = [];
let productsCart = [];
let productQuantity = document.getElementById("productQuantity");
let detailsAdd = document.getElementById("detailsAdd");

if (localProducts === null) {
  products = localProducts = [];
}

async function getProducts() {
  const response = await fetch("https://dummyjson.com/products");
  const data = await response.json();

  if (products.length == 0) {
    products = data.products.concat(products);
  }

  print(products);
}

getProducts();

function unitPrice(p) {
  return (
    Number(p.price) -
    (Number(p.price) * Math.round(Number(p.discountPercentage))) / 100
  );
}

function fSToN(n) {
  return `$${Number(n).toFixed(2)}`;
}

function updateCountersAndTotals() {
  let basketCounter = document.getElementById("basketCounter");
  let totalProducts = document.getElementById("totalProducts");
  let totalQty = productsCart.reduce(
    (s, p) => s + Number(p.numberOfProducts || 0),
    0
  );
  totalProducts.innerHTML = String(totalQty);
  if (totalQty > 9) {
    basketCounter.innerHTML = "+9";
  } else {
    basketCounter.innerHTML = String(totalQty);
  }
  basketCounter.classList.toggle("hidden", totalQty === 0);

  document
    .getElementById("footerCart")
    .classList.toggle("hidden", totalQty === 0);
  document
    .getElementById("emptyCart")
    .classList.toggle("hidden", totalQty != 0);

  let sum = productsCart.reduce(
    (s, p) => s + Number(p.numberOfProducts || 0) * unitPrice(p),
    0
  );
  document.getElementById("finalTotal").innerHTML = fSToN(sum);
}
const dialogDetails = document.getElementById("dialogDetails");

function detailsEdite(i) {
  dialogDetails.dataset.productIndex = String(i);
  document.getElementById("productQuantity").innerHTML = "1";

  document
    .getElementById("detailsImg")
    .setAttribute("alt", `${products[i].title}`);
  document
    .getElementById("detailsImg")
    .setAttribute("src", `${products[i].thumbnail}`);
  document
    .getElementById("detailsImg1")
    .setAttribute("src", `${products[i].images[0]}`);
  document
    .getElementById("detailsImg2")
    .setAttribute("src", `${products[i].images[0]}`);
  document
    .getElementById("detailsImg3")
    .setAttribute("src", `${products[i].images[0]}`);
  document.getElementById("detailsTitle").innerHTML = `${products[i].title}`;
  document.getElementById(
    "detailsDescription"
  ).innerHTML = `${products[i].description}`;
  document.getElementById("detailsPrice").innerHTML = `${(
    products[i].price -
    (products[i].price * Math.round(products[i].discountPercentage)) / 100
  ).toFixed(2)}`;
  document.getElementById(
    "detailsPriceBeforDiscount"
  ).innerHTML = `${products[i].price}`;
  document.getElementById("detailsRating").innerHTML = `${products[
    i
  ].rating.toFixed(1)}`;
  document.getElementById(
    "detailsBrand"
  ).innerHTML = `Brand: ${products[i].brand}`;
  document.getElementById(
    "detailsCategory"
  ).innerHTML = `Category: ${products[i].category}`;
  document.getElementById("detailsStock").innerHTML = `${products[i].stock}`;

  let stars1 = [...document.querySelectorAll(".star")];
  let count = Math.round(products[i].rating.toFixed(1));
  for (let i = 0; i < 5; i++) {
    stars1[i].classList.remove("text-yellow-400");
    stars1[i].classList.remove("fill-yellow-400");
  }

  for (let i = 0; i < count; i++) {
    stars1[i].classList.add("text-yellow-400");
    stars1[i].classList.add("fill-yellow-400");
  }

  let closeBtn1 = document.getElementById("closeDialog1");
  closeBtn1.addEventListener("click", () => dialogDetails.close());
  detailsAdd.innerHTML = `Add to Cart - ${fSToN(1 * unitPrice(products[i]))}`;

  // /////////
}

document
  .getElementById("reduceQuantity")
  .addEventListener("click", function () {
    let i = Number(dialogDetails.dataset.productIndex || 0);
    let current = Number(productQuantity.innerHTML);
    if (current > 1) {
      let newQty = current - 1;
      productQuantity.innerHTML = String(newQty);

      detailsAdd.innerHTML = `Add to Cart - ${fSToN(
        newQty * unitPrice(products[i])
      )}`;
    }
  });

document
  .getElementById("increaseQuantity")
  .addEventListener("click", function () {
    let i = Number(dialogDetails.dataset.productIndex || 0);
    let current = Number(productQuantity.innerHTML);

    let inCart = Number(
      productsCart.find((x) => x.id === products[i].id)?.numberOfProducts || 0
    );
    let maxAllowed = Number(products[i].stock) - inCart;

    if (current < maxAllowed) {
      let newQty = current + 1;
      productQuantity.innerHTML = String(newQty);
      detailsAdd.innerHTML = `Add to Cart - ${fSToN(
        newQty * unitPrice(products[i])
      )}`;
    } else {
      const host = dialogDetails?.open ? dialogDetails : document.body;
      Toastify({
        text: "You’ve reached the stock limit for this product.",
        duration: 2500,
        gravity: "top",
        position: "right",
        close: true,
        selector: host, 
        style: {
          zIndex: 9999, // or "9999"
        },
        className: "toast-z-top",
      }).showToast();
    }
  });

detailsAdd.addEventListener("click", function () {
  let i = Number(dialogDetails.dataset.productIndex || 0);
  let requested = Number(productQuantity.innerHTML);
  let stock = Number(products[i].stock);

  let idx = productsCart.findIndex((p) => p.id === products[i].id);

  if (idx > -1) {
    var inCart = Number(productsCart[idx].numberOfProducts || 0);
  } else {
    var inCart = 0;
  }

  let available = Math.max(0, stock - inCart);
  if (available === 0) {
    Toastify({
      text: "You’ve reached the stock limit for this product.",
      duration: 2500,
      gravity: "top",
      position: "right",
      close: true,
    }).showToast();
    dialogDetails.close();
    return;
  }

  let toAdd = Math.min(requested, available);

  if (idx > -1) {
    productsCart[idx].numberOfProducts = inCart + toAdd;
  } else {
    const copy = structuredClone(products[i]);
    copy.numberOfProducts = toAdd;
    productsCart.push(copy);
  }
  updateCountersAndTotals();
  document.getElementById("aa").innerHTML = "";
  document.getElementById("finalTotal").innerHTML = fSToN(0);
  let runningTotal = 0;
  productsCart.forEach((p) => {
    let productCart = document.createElement("div");
    productCart.setAttribute("id", `c${p.id}`);
    productCart.innerHTML = `
    <div class="flex items-center gap-4 p-4 border rounded-lg mb-4">
          <img
            alt="${p.title}"
            class="w-16 h-16 object-cover rounded"
            src="${p.thumbnail}"
          />
          <div class="flex-1">
            <h4 class="font-medium">${p.title}</h4>
            <p class="text-sm text-gray-600">$${(
              p.price -
              (p.price * Math.round(p.discountPercentage)) / 100
            ).toFixed(2)} each</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              id="bd${p.id}"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border size-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-minus h-4 w-4"
              >
                <path d="M5 12h14"></path>
              </svg></button
            ><span id="count${p.id}" class="w-8 text-center">${
      p.numberOfProducts
    }</span
            ><button
              id="bi${p.id}"

              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border size-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-plus h-4 w-4"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
          </div>
          <div class="text-right">
         <p id="total${p.id}" class="font-medium">
  ${fSToN(Number(p.numberOfProducts) * unitPrice(p))}
</p>
    </div>
        </div>
    `;
    runningTotal += Number(p.numberOfProducts) * unitPrice(p);
    document.getElementById("finalTotal").innerHTML = fSToN(runningTotal);

    document.getElementById("aa").append(productCart);
    document.getElementById(`bd${p.id}`).addEventListener("click", function () {
      const idx = productsCart.findIndex((x) => x.id === p.id);
      const newQty = Number(productsCart[idx].numberOfProducts || 0) - 1;

      if (newQty <= 0) {
        productsCart.splice(idx, 1);
        document.getElementById(`c${p.id}`).remove();
      } else {
        productsCart[idx].numberOfProducts = newQty;
        document.getElementById(`count${p.id}`).innerHTML = String(newQty);
        document.getElementById(`total${p.id}`).innerHTML = fSToN(
          newQty * unitPrice(p)
        );
      }

      updateCountersAndTotals();
    });

    document.getElementById(`bi${p.id}`).addEventListener("click", function () {
      const idx = productsCart.findIndex((x) => x.id === p.id);
      let newQty = Number(productsCart[idx].numberOfProducts || 0) + 1;
      if (newQty > Number(p.stock)) {
        Toastify({
          text: "You’ve reached the stock limit for this product.",
          duration: 2500,
          gravity: "top", // "top" or "bottom"
          position: "right", // "left", "center" or "right"
          close: true,
        }).showToast();
      }
      newQty = Math.min(newQty, Number(p.stock));

      productsCart[idx].numberOfProducts = newQty;
      document.getElementById(`count${p.id}`).innerHTML = String(newQty);
      document.getElementById(`total${p.id}`).innerHTML = fSToN(
        newQty * unitPrice(p)
      );

      updateCountersAndTotals();
    });
  });
  dialogDetails.close();
});

function print(products) {
  let cards = document.querySelector(".cards");
  cards.innerHTML = "";

  products.forEach((product) => {
    cards.innerHTML += `
    <div
            class="card bg-white max-w-3xs bg-card text-card-foreground gap-6 rounded-xl py-6  hover:shadow-xl transition-all border-0 shadow-md pt-0 h-[480px] flex flex-col opacity-100 translate-y-0 scale-100"
            id="${product.id}"
            >
            <div
              
              class="grid auto-rows-min items-start gap-1.5 "
            >
              <div class="relative">
                <img
                  src="${product.thumbnail}"
                  alt="${product.title}"
                  class="imageProduct w-full h-48 object-fit rounded-t-lg cursor-pointer"
                />
                <div class="absolute top-2 right-2 flex gap-1">
                  <button
                    
                    class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-square-pen h-4 w-4 text-gray-600"
                    >
                      <path
                        d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      ></path>
                      <path
                        d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                      ></path>
                    </svg>
                    </button>
                    <button
                    id="${product.id}"
                    
                    class="like inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium size-9 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-heart h-4 w-4 text-gray-600"
                    >
                      <path
                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <span
                  
                  class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent absolute bottom-2 left-2 bg-orange-500"
                  >-<!-- -->${Math.round(product.discountPercentage)}%</span
                >
              </div>
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <div
                class="font-semibold text-lg mb-2 truncate text-neutral"
              >
                ${product.title}
              </div>
              <p class="text-sm text-gray-600 mb-2 truncate">
                ${product.description}
              </p>
              <div class="flex items-center mb-2">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-600 ml-2"
                  >(${product.rating.toFixed(1)})</span
                >
              </div>
              <div class="flex items-center justify-between mt-auto">
                <div>
                  <span class="text-2xl font-bold text-neutral">
                  $${(
                    product.price -
                    (product.price * Math.round(product.discountPercentage)) /
                      100
                  ).toFixed(2)}</span
                  ><span class="text-sm text-gray-500 line-through ml-2"
                    >$${product.price}</span
                  >
                </div>
                <span
                  
                  class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit  border-transparent bg-green-300"
                  >${product.stock}<!-- -->
                  left</span
                >
              </div>
            </div>
            <div
              
              class="p-4"
            >
              <button
                
                class="view cursor-pointer inline-flex items-center justify-center   rounded-md text-sm font-medium transition-all  bg-slate-800 text-white shadow-xs hover:bg-slate-900 h-9 px-4 py-2  w-full"
              >
                View Details
              </button>
            </div>
          </div>
  
  
  
          `;
    let stars = [
      ...document.getElementById(`${product.id}`).children[1].children[2]
        .children[0].children,
    ];

    for (let i = 0; i < Math.round(product.rating.toFixed(1)); i++) {
      stars[i].classList.add("text-yellow-400");
      stars[i].classList.add("fill-yellow-400");
    }
  });

  var productsView = document.querySelectorAll(".view");
  var productsView2 = document.querySelectorAll(".imageProduct");

  for (let i = 0; i < productsView.length; i++) {
    productsView[i].addEventListener("click", function () {
      dialogDetails.showModal();

      detailsEdite(i);
    });
    productsView2[i].addEventListener("click", function () {
      const dialogDetails = document.getElementById("dialogDetails");

      dialogDetails.showModal();
      detailsEdite(i);
    });
  }

  let likes = document.querySelectorAll(".like");

  for (let i = 0; i < likes.length; i++) {
    likes[i].addEventListener("click", function () {
      if (likes[i].children[0].classList.contains("!fill-red-500")) {
        likes[i].children[0].classList.remove("!fill-red-500");
        likes[i].children[0].classList.remove("!text-red-500");
        document.getElementById("likesCounter").innerHTML =
          Number(document.getElementById("likesCounter").innerHTML) - 1;
        if (Number(document.getElementById("likesCounter").innerHTML) == 0) {
          document.getElementById("likesCounter").classList.add("hidden");
          document.getElementById("heart").classList.remove("!fill-red-500");
          document.getElementById("heart").classList.remove("!text-red-500");
          document.getElementById("empty").classList.remove("hidden");
        }
      } else {
        document.getElementById("empty").classList.add("hidden");

        document.getElementById("likesCounter").classList.remove("hidden");
        document.getElementById("heart").classList.add("!fill-red-500");
        document.getElementById("heart").classList.add("!text-red-500");

        likes[i].children[0].classList.add("!fill-red-500");
        likes[i].children[0].classList.add("!text-red-500");
        document.getElementById("likesCounter").innerHTML =
          Number(document.getElementById("likesCounter").innerHTML) + 1;
          if (Number(document.getElementById("likesCounter").innerHTML) > 9){
            document.getElementById("likesCounter").innerHTML = "+9"
          }
      }
      var productNumber = document
        .querySelectorAll(".like")
        [i].getAttribute("id");

      const pid = Number(productNumber);
      const inWish = productsWishList.some((p) => p.id === pid);

      if (inWish) {
        productsWishList = productsWishList.filter((p) => p.id !== pid);
      } else {
        productsWishList.push(products[pid - 1]);
      }

      printWish(productsWishList);
    });
  }
}

function printWish(productsWishList) {
  document.getElementById("productCardWishList").innerHTML = "";
  productsWishList.forEach((product) => {
    let wishListCard = document.createElement("div");
    wishListCard.classList.add("space-y-4");
    wishListCard.setAttribute("id", `a${product.id}`);
    wishListCard.innerHTML = `
            
              <div class="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  alt="${product.title}"
                  class="w-16 h-16 object-cover rounded"
                  src="${product.thumbnail}"
                />
                <div class="flex-1">
                  <h4 class="font-medium">${product.title}</h4>
                  <p class="text-sm text-gray-600 line-clamp-2">
                    ${product.description}
                  </p>
                  <p class="text-lg font-bold text-purple-600">$${(
                    product.price -
                    (product.price * Math.round(product.discountPercentage)) /
                      100
                  ).toFixed(2)}</p>
                </div>
                <div class="flex gap-2">
                  <button
                  id="close${product.id}"
                    class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all  border shadow-xs h-9 px-4 py-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-x h-4 w-4"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                    </button>
                  
                  <button
                  id="view${product.id}"
                    class="rounded-md text-sm font-medium transition-all bg-neutral text-base shadow-xs hover:bg-slate-900 h-9 px-4 py-2 has-[&gt;svg]:px-3"
                  >
                    View
                  </button>
                </div>
              </div>
            
            `;
    document.getElementById("productCardWishList").append(wishListCard);
  });
  for (let i = 0; i < productsWishList.length; i++) {
    document
      .getElementById(`view${productsWishList[i].id}`)
      .addEventListener("click", function () {
        detailsEdite(Number(productsWishList[i].id) - 1);
        dialogDetails.showModal();
      });

    document
      .getElementById(`close${productsWishList[i].id}`)
      .addEventListener("click", function () {
        const id = Number(this.id.replace("close", ""));

        const cardEl = document.getElementById(`a${id}`);
        if (cardEl) cardEl.remove();
        // productsWishList = productsWishList.filter((p) => p.id !== id);
        let index = productsWishList.indexOf(
          productsWishList.find((p) => p.id == id)
        );
        productsWishList.splice(index, 1);
        printWish(productsWishList);

        const count = productsWishList.length;
        const counterEl = document.getElementById("likesCounter");
        const heartEl = document.getElementById("heart");
        const emptyEl = document.getElementById("empty");

        counterEl.innerHTML = String(count);
        counterEl.classList.toggle("hidden", count === 0);
        heartEl.classList.toggle("!fill-red-500", count > 0);
        heartEl.classList.toggle("!text-red-500", count > 0);
        emptyEl.classList.toggle("hidden", count > 0);

        const likeBtn = document.querySelector(`.like[id="${id}"]`);
        if (likeBtn) {
          likeBtn.children[0].classList.remove("!fill-red-500");
          likeBtn.children[0].classList.remove("!text-red-500");
        }
      });
  }
}

function dialogAddProducts() {
  const dialogAddProduct = document.getElementById("DialogAddProduct");
  const openBtn = document.getElementById("openDialog");
  const closeBtn = document.getElementById("closeDialog");
  const closeBtn2 = document.getElementById("closeDialog2");

  openBtn.addEventListener("click", () => dialogAddProduct.showModal());
  closeBtn.addEventListener("click", () => dialogAddProduct.close());
  closeBtn2.addEventListener("click", () => dialogAddProduct.close());
}

dialogAddProducts();

function dialogWishlists() {
  const dialogWishlist = document.getElementById("dialogWishlist");
  const openBtn = document.getElementById("openDialog2");
  const closeBtn = document.getElementById("closeDialog3");

  openBtn.addEventListener("click", () => dialogWishlist.showModal());
  closeBtn.addEventListener("click", () => dialogWishlist.close());
}

dialogWishlists();

function dialogCarts() {
  const dialogCart = document.getElementById("dialogCart");
  const openBtn = document.getElementById("openDialog3");
  const closeBtn = document.getElementById("closeDialog4");

  openBtn.addEventListener("click", () => dialogCart.showModal());
  closeBtn.addEventListener("click", () => dialogCart.close());
}

dialogCarts();

document.getElementById("addProduct").addEventListener("click", function () {
  let titlev = document.getElementById("title").value;
  let descriptionv = document.getElementById("description").value;
  let pricev = document.getElementById("price").value;
  let stockv = document.getElementById("stock").value;
  let categoryv = document.getElementById("category").value;
  let brandv = document.getElementById("brand").value;
  let url1v = document.getElementById("url1").value;
  let newProduct = {
    id: products.length + 1,
    title: titlev,
    description: descriptionv,
    price: Number(pricev),
    stock: Number(stockv),
    category: categoryv,
    brand: brandv,
    thumbnail: url1v,
    discountPercentage: 20,
    rating: 4.3,
  };

  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  print(products);
});

function search(userInput, arr, fun) {
  var filteredProducts = arr.filter(function (product) {
    return product.title.toLowerCase().includes(userInput.toLowerCase().trim());
  });
  fun(filteredProducts);
}

document
  .getElementById("searchInputProduct")
  .addEventListener("input", function () {
    let userInput = document.getElementById("searchInputProduct").value;
    search(userInput, products, print);
  });

document
  .getElementById("searchInputWishList")
  .addEventListener("input", function () {
    let userInput = document.getElementById("searchInputWishList").value.trim();
    search(userInput, productsWishList, printWish);
  });
