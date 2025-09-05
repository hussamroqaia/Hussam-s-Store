let products = [];
let products1 = [];
let products2 = [];
let products3 = [];
let productsCart = [];
let productsWishList = [];
let localProducts = JSON.parse(localStorage.getItem("products"));
let localProductsCart = JSON.parse(localStorage.getItem("productsCart"));
let localProductsWish = JSON.parse(localStorage.getItem("productsWishList"));
if (Array.isArray(localProducts)) {
  products = localProducts;
} else {
  products = [];
}
if (Array.isArray(localProductsCart)) {
  productsCart = localProductsCart;
} else {
  productsCart = [];
}
if (Array.isArray(localProductsWish)) {
  productsWishList = localProductsWish;
} else {
  productsWishList = [];
}
var dialogAddProduct = document.getElementById("DialogAddProduct");
var openBtnAddProduct = document.getElementById("openDialogAddProduct");
var closeBtnAddProduct1 = document.getElementById("closeDialogAddProduct1");
var closeBtnAddProduct2 = document.getElementById("closeDialogAddProduct2");
openBtnAddProduct.addEventListener("click", () => {
  dialogAddProduct.showModal();
  document.querySelectorAll('[name="error-msg"]').forEach(function (msg) {
    msg.remove();
  });
  let urrl = document.querySelectorAll(".url");
  for (let index = 1; index < urrl.length; index++) {
    if (urrl[index].value.trim() == "") {
      urrl[index].parentElement.remove();
      urrl[index].remove();
    }
  }
});
closeBtnAddProduct1.addEventListener("click", () => dialogAddProduct.close());
closeBtnAddProduct2.addEventListener("click", () => dialogAddProduct.close());
let productQuantity = document.getElementById("productQuantity");
let detailsAdd = document.getElementById("detailsAdd");
let dialogDetails = document.getElementById("dialogDetails");
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem("productsCart", JSON.stringify(productsCart));
}
function saveWish() {
  localStorage.setItem("productsWishList", JSON.stringify(productsWishList));
}
function printCart() {
  let cartContainer = document.getElementById("productsCartContainer");
  cartContainer.innerHTML = "";
  document.getElementById("finalTotal").innerHTML = fSToN(0);
  let runningTotal = 0;

  productsCart.forEach((p) => {
    let prodCart = document.createElement("div");
    prodCart.setAttribute("id", `c${p.id}`);
    prodCart.innerHTML = `
      <div
  class="flex flex-col items-center gap-4 p-4
         rounded-xl border bg-[rgb(92,99,120)] text-white shadow-sm
         transition-all hover:shadow-md mb-4 max-w-xs sm:max-w-xl "
>
  
  <div class="shrink-0">
    <img
      src="${p.images[0]}"
      alt="${p.title}"
      class="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover ring-1 ring-black/10"
    />
  </div>


  <div class="min-w-0 flex flex-col gap-1">
    <h4 class="font-semibold text-base md:text-lg leading-snug line-clamp-1">
      ${p.title}
    </h4>
    <p class="text-sm text-white/80">
      ${fSToN(unitPrice(p))} each
    </p>
  </div>

 
  <div
    class="flex items-center gap-2 justify-start md:justify-end
           order-3 md:order-none col-span-2 md:col-span-1"
  >
    <button
      id="bd${p.id}"
      class="inline-flex items-center justify-center h-10 w-10 rounded-md
             border border-white/30 bg-white/10 hover:bg-white/20 transition
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer"

    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>

    <span id="count${p.id}" class="min-w-8 text-center select-none">
      ${p.numberOfProducts}
    </span>

    <button
      id="bi${p.id}"
      class="inline-flex items-center justify-center h-10 w-10 rounded-md
             border border-white/30 bg-white/10 hover:bg-white/20 transition
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer"

    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
    </button>
  </div>


  <div
    class="text-right font-bold
           order-4 md:order-none col-span-2 md:col-span-1"
  >
    <p id="total${p.id}">
      ${fSToN(Number(p.numberOfProducts) * unitPrice(p))}
    </p>
  </div>
</div>

    `;
    cartContainer.append(prodCart);

    runningTotal += Number(p.numberOfProducts) * unitPrice(p);
    document.getElementById("finalTotal").innerHTML = fSToN(runningTotal);

    document.getElementById(`bd${p.id}`).addEventListener("click", function () {
      let idx = productsCart.findIndex((x) => x.id === p.id);
      let newQty = Number(productsCart[idx].numberOfProducts || 0) - 1;

      if (newQty <= 0) {
        productsCart.splice(idx, 1);
        document.getElementById(`c${p.id}`)?.remove();
      } else {
        productsCart[idx].numberOfProducts = newQty;
        document.getElementById(`count${p.id}`).innerHTML = String(newQty);
        document.getElementById(`total${p.id}`).innerHTML = fSToN(
          newQty * unitPrice(p)
        );
      }

      saveCart();
      updateCountersAndTotals();
    });

    document.getElementById(`bi${p.id}`).addEventListener("click", function () {
      let idx = productsCart.findIndex((x) => x.id === p.id);
      let newQty = Number(productsCart[idx].numberOfProducts || 0) + 1;

      if (newQty > Number(p.stock)) {
        let dialogCart = document.getElementById("dialogCart");
        const scrollY = dialogCart?.scrollTop ?? 0;

        Toastify({
          text: "You’ve reached the stock limit for this product.",
          duration: 2500,
          gravity: "top",
          position: "right",
          close: true,
          selector: dialogCart,
          offset: { y: scrollY + 12 },
          className: "toast-z-top",
        }).showToast();
      }
      newQty = Math.min(newQty, Number(p.stock));

      productsCart[idx].numberOfProducts = newQty;
      document.getElementById(`count${p.id}`).innerHTML = String(newQty);
      document.getElementById(`total${p.id}`).innerHTML = fSToN(
        newQty * unitPrice(p)
      );

      saveCart();
      updateCountersAndTotals();
    });
  });
}

async function getProducts() {
  let response1 = await fetch("https://dummyjson.com/products?limit=10&skip=0");
  let data1 = await response1.json();

  let response2 = await fetch(
    "https://dummyjson.com/products?limit=10&skip=10"
  );
  let data2 = await response2.json();

  let response3 = await fetch(
    "https://dummyjson.com/products?limit=10&skip=20"
  );
  let data3 = await response3.json();

  products1 = data1.products;
  products2 = data2.products;
  products3 = data3.products;
  if (products.length == 0) {
    products = products1.concat(products2).concat(products3);
  } else {
    products.splice(0, 20);
    products3 = products;
    console.log("333");

    console.log(products3);
    products = products1.concat(products2).concat(products3);
  }
  console.log(products);

  print(products1);
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
    (acu, p) => acu + Number(p.numberOfProducts || 0),
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
    (acu, p) => acu + Number(p.numberOfProducts || 0) * unitPrice(p),
    0
  );
  document.getElementById("finalTotal").innerHTML = fSToN(sum);
}

function detailsEdite(i) {
  dialogDetails.dataset.productIndex = String(i);
  document.getElementById("productQuantity").innerHTML = "1";
  document.getElementById("detailsStock").classList.remove("!bg-red-500");
  document.getElementById("detailsStock").classList.remove("!text-white");
  document.getElementById("counterFoot").classList.remove("!hidden");
  document.getElementById("conDetailsImg").innerHTML = `
  <img
              id="detailsImg1"
              alt=""
              class="imgDet w-16 h-16 lg:w-20 lg:h-20 flex-none object-cover rounded cursor-pointer ring-2 ring-white/30 hover:ring-primary transition mt-1 ml-1 snap-start"
              src=""
            />
  `;
  document.getElementById("detailsImg1").addEventListener("click", function () {
    let wholeImages = document.querySelectorAll(".imgDet");
    for (let index = 0; index < wholeImages.length; index++) {
      wholeImages[index].classList.remove("!ring-primary");
      wholeImages[index].classList.remove("ring-2");
      wholeImages[index].classList.add("ring-2");
      wholeImages[index].classList.add("ring-white/30");
    }
    document.getElementById("detailsImg1").classList.add("!ring-primary");
    document.getElementById("detailsImg1").classList.add("ring-2");
    let src1 = document.getElementById("detailsImg1").getAttribute("src");
    document.getElementById("detailsImg").setAttribute("src", `${src1}`);
  });
  for (let index = 1; index < products[i].images.length; index++) {
    let img = document.createElement("img");
    img.setAttribute("id", `detailsImg${index + 1}`);
    img.setAttribute("alt", `${products[i].title}`);
    img.setAttribute("src", `${products[i].images[index]}`);
    img.setAttribute(
      "class",
      "imgDet w-16 h-16 lg:w-20 lg:h-20 flex-none object-cover rounded cursor-pointer ring-2 ring-white/30 hover:ring-primary transition mt-1 ml-1 snap-start"
    );
    document.getElementById("conDetailsImg").append(img);
    document
      .getElementById(`detailsImg${index + 1}`)
      .addEventListener("click", function () {
        let wholeImages = document.querySelectorAll(".imgDet");
        for (let index = 0; index < wholeImages.length; index++) {
          wholeImages[index].classList.remove("!ring-primary");
          wholeImages[index].classList.remove("ring-2");
          wholeImages[index].classList.add("ring-2");
          wholeImages[index].classList.add("ring-white/30");
        }
        document
          .getElementById(`detailsImg${index + 1}`)
          .classList.add("!ring-primary");
        document
          .getElementById(`detailsImg${index + 1}`)
          .classList.add("ring-2");
        let src2 = document
          .getElementById(`detailsImg${index + 1}`)
          .getAttribute("src");
        document.getElementById("detailsImg").setAttribute("src", `${src2}`);
      });
  }
  document
    .getElementById("detailsImg")
    .setAttribute("alt", `${products[i].title}`);
  document
    .getElementById("detailsImg")
    .setAttribute("src", `${products[i].images[0]}`);
  document
    .getElementById("detailsImg1")
    .setAttribute("src", `${products[i].images[0]}`);

  document.getElementById("detailsTitle").innerHTML = `${products[i].title}`;
  document.getElementById(
    "detailsDescription"
  ).innerHTML = `${products[i].description}`;
  document.getElementById("detailsPrice").innerHTML = `${fSToN(
    unitPrice(products[i])
  )}`;
  document.getElementById(
    "detailsPriceBeforDiscount"
  ).innerHTML = `$${products[i].price}`;
  document.getElementById("detailsRating").innerHTML = `(${products[
    i
  ].rating.toFixed(1)})`;
  document.getElementById(
    "detailsBrand"
  ).innerHTML = `Brand: ${products[i].brand}`;
  document.getElementById(
    "detailsCategory"
  ).innerHTML = `Category: ${products[i].category}`;
  document.getElementById("detailsStock").innerHTML = `${products[i].stock}`;
  if (products[i].stock == 0) {
    document.getElementById("detailsStock").innerHTML = "Out of stock";
    document.getElementById("detailsStock").classList.add("!bg-red-500");
    document.getElementById("detailsStock").classList.add("!text-white");
    document.getElementById("counterFoot").classList.add("!hidden");
  }
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
      const scrollY = dialogDetails?.scrollTop ?? 0;

      Toastify({
        text: "You’ve reached the stock limit for this product.",
        duration: 2500,
        gravity: "top",
        position: "right",
        close: true,
        selector: dialogDetails,
        offset: { y: scrollY + 12 },
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
    const scrollY = dialogDetails?.scrollTop ?? 0;

    Toastify({
      text: "You’ve reached the stock limit for this product.",
      duration: 2500,
      gravity: "top",
      position: "right",
      close: true,
      selector: dialogDetails,
      offset: { y: scrollY + 12 },
      className: "toast-z-top",
    }).showToast();
    dialogDetails.close();
    return;
  }

  let toAdd = Math.min(requested, available);

  if (idx > -1) {
    productsCart[idx].numberOfProducts = inCart + toAdd;
  } else {
    let copy = structuredClone(products[i]);
    copy.numberOfProducts = toAdd;
    productsCart.push(copy);
    saveCart();
  }
  updateCountersAndTotals();
  dialogDetails.close();
});

function print(pros) {
  let cards = document.querySelector(".cards");
  cards.innerHTML = "";

  pros.forEach((product) => {
    cards.innerHTML += `
    <div
    
            class="card bg-white max-w-4xs sm:max-w-3xs md:max-w-4xs w-[100%]  gap-2 rounded-xl py-6  hover:shadow-xl transition-all border-0 shadow-md pt-0 sm:h-[440px] flex flex-col opacity-100 translate-y-0 "
            id="${product.id}"
            >
            <div
              
              class="grid auto-rows-min items-start gap-1.5 "
            >
              <div class="relative imgcont">
                <img
                  src="${product.images[0]}"
                  alt="${product.title}"
                  class="imggg w-full sm:h-48 object-fit rounded-t-lg cursor-pointer "
                />
                <div class="absolute imageProduct cursor-pointer inset-0 bg-black/3 rounded-xl "></div>
                <span
                  id="badgeNoStock-${product.id}"
                  class="absolute top-2 left-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-red-500 text-white !hidden"
                  >
                  No Stock
  </span>
                <div class="absolute top-2 right-2 flex gap-1">
                  <button
                  title="Edite"
                    id="e${product.id}"
                    class="edite inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium  bg-base hover:bg-slate-200 hover:cursor-pointer size-9"
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
                    
                </div>
                <span
                  id="percentageBadge${product.id}"
                  class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent absolute bottom-2 left-2 bg-orange-500"
                  >-${Math.round(product.discountPercentage)}%</span
                >
              </div>
            </div>
            <div class="mainCard p-4 flex-1 flex flex-col">
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
              <div class="flex items-center justify-between  flex-wrap">
                <div>
                  <span class="text-2xl font-bold text-neutral">
                  ${fSToN(unitPrice(product))}
                  </span
                  ><span class="text-sm text-gray-500 line-through ml-2"
                    >$${product.price}</span
                  >
                </div>
                <span
                  
                  class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit  border-transparent bg-base"
                  >${product.stock}
                  left</span
                >
              </div>
            </div>
            <div
              
              class="px-4 flex gap-2 footer-product"
            >
              <button
                id="o${product.id}"
                class="view cursor-pointer inline-flex items-center justify-center   rounded-md text-sm font-medium transition-all  bg-neutral text-base shadow-xs hover:bg-slate-900 h-9 px-4 py-2  w-full"
              >
                View Details
              </button>
              <button
                    id="${product.id}"
                    
                    class="like inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium size-9 bg-neutral hover:bg-slate-900 hover:cursor-pointer px-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-heart h-4 w-5 text-white"
                    >
                      <path
                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                      ></path>
                    </svg>
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
    if (product.stock == 0) {
      document.getElementById(`o${product.id}`).innerHTML = "Out of Stock";
      document.getElementById(`o${product.id}`).classList.add("!bg-red-500");
      document
        .getElementById(`badgeNoStock-${product.id}`)
        .classList.remove("!hidden");
      document
        .getElementById(`percentageBadge${product.id}`)
        .classList.add("!hidden");
    }
  });

  var productsView = document.querySelectorAll(".view");
  var productsView2 = document.querySelectorAll(".imageProduct");

  for (let i = 0; i < productsView.length; i++) {
    productsView[i].addEventListener("click", function () {
      dialogDetails.showModal();
      let index = products.indexOf(products.find((p) => p.id == pros[i].id));
      detailsEdite(index);
    });
    productsView2[i].addEventListener("click", function () {
      let dialogDetails = document.getElementById("dialogDetails");

      dialogDetails.showModal();
      let index = products.indexOf(products.find((p) => p.id == pros[i].id));
      detailsEdite(index);
    });
  }

  let likes = document.querySelectorAll(".like");
  let edites = document.querySelectorAll(".edite");
  var DialogEditeProduct = document.getElementById("DialogEditeProduct");
  let closeBtnEdite = document.getElementById("CloseDialogEditeProduct");
  let closeBtnEdite1 = document.getElementById("closeDialogEdite");
  closeBtnEdite.addEventListener("click", () => DialogEditeProduct.close());
  closeBtnEdite1.addEventListener("click", () => DialogEditeProduct.close());

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
        if (Number(document.getElementById("likesCounter").innerHTML) > 9) {
          document.getElementById("likesCounter").innerHTML = "+9";
        }
      }
      var productNumber = document
        .querySelectorAll(".like")
        [i].getAttribute("id");

      let pid = Number(productNumber);
      let inWish = productsWishList.some((p) => p.id === pid);

      if (inWish) {
        // productsWishList = productsWishList.filter((p) => p.id !== pid);
        let index = productsWishList.indexOf(
          productsWishList.find((p) => p.id == pid)
        );
        productsWishList.splice(index, 1);
      } else {
        productsWishList.push(products[pid - 1]);
      }

      printWish(productsWishList);
      saveWish();
    });
    edites[i].addEventListener("click", function () {
      document.getElementById("containerImagesEdite").innerHTML = "";
      document.getElementById("containerImagesEdite").innerHTML = `
      <input
                id="url1Edite"
                class="urlEdite assasy h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] md:text-sm focus:border-primary focus:ring-1 focus:ring-accent focus:outline-none border-secondary"
                placeholder="Image URL 1"
                value=""
              />
      `;

      DialogEditeProduct.showModal();
      DialogEditeProduct.dataset.productIndex = String(i);

      document.querySelectorAll('[name="error-msg"]').forEach(function (msg) {
        msg.remove();
      });
      DialogEditeProduct.dataset.productIndex = String(i);

      document.getElementById("titleEdite").value = pros[i].title;
      document.getElementById("descriptionEdite").value = pros[i].description;
      document.getElementById("priceEdite").value = pros[i].price;
      document.getElementById("stockEdite").value = pros[i].stock;
      document.getElementById("categoryEdite").value = pros[i].category;
      document.getElementById("brandEdite").value = pros[i].brand;
      document.getElementById("url1Edite").value = pros[i].images[0];
      let containerImagesEdite = document.getElementById(
        "containerImagesEdite"
      );
      for (let index = 1; index < pros[i].images.length; index++) {
        let newImage = document.createElement("div");
        newImage.innerHTML = `<input id="url${
          index + 1
        }Edite" class="urlEdite assasy h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] md:text-sm focus:border-primary focus:ring-1 focus:ring-accent focus:outline-none border-secondary url" placeholder="Image URL ${
          index + 1
        }" value="">`;
        containerImagesEdite.append(newImage);
        document.getElementById(`url${index + 1}Edite`).value =
          pros[i].images[index];
      }

      document.getElementById("discountPercentageEdite").value =
        pros[i].discountPercentage;
      document.getElementById("ratingEdite").value = pros[i].rating;
      let urlEditeD = document.querySelectorAll(".urlEdite");
      for (let index = 0; index < urlEditeD.length; index++) {
        if (urlEditeD[index].value.trim() == "") {
          urlEditeD[index].parentElement.remove();
          urlEditeD[index].remove();
        }
      }
    });
  }
  fillWishlistHearts();
}

printCart();
printWish(productsWishList);
updateCountersAndTotals();
fillWishlistHearts();

function printWish(listWishlist) {
  document.getElementById("productsWishlistCount").innerHTML = Number(
    productsWishList.length
  );
  document
    .getElementById("empty")
    .classList.toggle("hidden", listWishlist.length > 0);
  document.getElementById("productCardWishList").innerHTML = "";
  listWishlist.forEach((product) => {
    let wishListCard = document.createElement("div");
    wishListCard.classList.add("space-y-4");
    wishListCard.setAttribute("id", `a${product.id}`);
    wishListCard.innerHTML = `
            
                  
              <div
  class="grid grid-cols-[auto,1fr] md:grid-cols-[96px,1fr,auto] items-start gap-4 p-4
         rounded-xl border bg-[rgb(92,99,120)] shadow-sm
         transition-all hover:shadow-md"
>
 
  <div class="shrink-0">
    <img
      src="${product.thumbnail}"
      alt="${product.title}"
      class="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10"
    />
  </div>

  
  <div class="min-w-0 flex flex-col gap-1">
    <h4 class="font-semibold text-base md:text-lg leading-snug line-clamp-1">
      ${product.title}
    </h4>

    <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
      ${product.description}
    </p>

    <p class="mt-1 md:mt-2 text-lg md:text-xl font-bold text-primary">
     ${fSToN(unitPrice(product))}
    </p>
  </div>

  
  <div class="flex  gap-2 md:gap-3 self-stretch justify-end ">
   
    

  
    <button
      id="view${product.id}"
      class="inline-flex items-center justify-center h-10 px-4 rounded-md
             text-sm font-medium  text-white bg-neutral hover:bg-slate-900
             cursor-pointer
             shadow-xs transition
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      View
    </button>
    <button
      id="close${product.id}"
      class="inline-flex items-center justify-center h-10 px-3 rounded-md
              shadow-xs text-sm font-medium bg-neutral hover:bg-slate-900 text-white
             outline-none cursor-pointer"
    >
      Remove
      
    </button>
  </div>
</div>

            `;
    document.getElementById("productCardWishList").append(wishListCard);
  });
  for (let i = 0; i < listWishlist.length; i++) {
    document
      .getElementById(`view${listWishlist[i].id}`)
      .addEventListener("click", function () {
        detailsEdite(Number(listWishlist[i].id) - 1);
        dialogDetails.showModal();
      });

    document
      .getElementById(`close${listWishlist[i].id}`)
      .addEventListener("click", function () {
        let id = Number(this.id.replace("close", ""));
        console.log(id);

        let cardEl = document.getElementById(`a${id}`);
        if (cardEl) cardEl.remove();
        // productsWishList = productsWishList.filter((p) => p.id !== id);
        console.log(productsWishList);

        let index = productsWishList.indexOf(
          productsWishList.find((p) => p.id == id)
        );
        console.log(index);

        productsWishList.splice(index, 1);
        console.log(productsWishList);

        printWish(productsWishList);
        saveWish();

        let count = productsWishList.length;
        let counterEl = document.getElementById("likesCounter");
        let heartEl = document.getElementById("heart");
        let emptyEl = document.getElementById("empty");

        counterEl.innerHTML = String(count);
        counterEl.classList.toggle("hidden", count === 0);
        heartEl.classList.toggle("!fill-red-500", count > 0);
        heartEl.classList.toggle("!text-red-500", count > 0);
        emptyEl.classList.toggle("hidden", count > 0);

        let likeBtn = document.querySelector(`.like[id="${id}"]`);
        if (likeBtn) {
          likeBtn.children[0].classList.remove("!fill-red-500");
          likeBtn.children[0].classList.remove("!text-red-500");
        }
      });
  }
}

function fillWishlistHearts() {
  let count = productsWishList.length;
  let likesCounter = document.getElementById("likesCounter");
  let heartEl = document.getElementById("heart");
  if (count > 9) {
    likesCounter.innerHTML = "+9";
  } else {
    likesCounter.innerHTML = count;
  }
  likesCounter.classList.toggle("hidden", count === 0);
  heartEl.classList.toggle("!fill-red-500", count > 0);
  heartEl.classList.toggle("!text-red-500", count > 0);

  document.querySelectorAll(".like").forEach((btn) => {
    let id = Number(btn.id);
    if (productsWishList.some((p) => p.id === id)) {
      btn.children[0].classList.add("!fill-red-500", "!text-red-500");
    }
  });
}

function dialogWishlists() {
  let dialogWishlist = document.getElementById("dialogWishlist");
  let openBtn = document.getElementById("openDialog2");
  let closeBtn = document.getElementById("closeDialog3");

  openBtn.addEventListener("click", () => {
    dialogWishlist.showModal();
    printWish(productsWishList);
    fillWishlistHearts();
  });
  closeBtn.addEventListener("click", () => dialogWishlist.close());
}

dialogWishlists();

function dialogCarts() {
  let dialogCart = document.getElementById("dialogCart");
  let openBtn = document.getElementById("openDialog3");
  let closeBtn = document.getElementById("closeDialog4");

  openBtn.addEventListener("click", () => {
    dialogCart.showModal();
    printCart();
    updateCountersAndTotals();
  });
  closeBtn.addEventListener("click", () => dialogCart.close());
}

dialogCarts();
let urlArray = [];
document.getElementById("addProduct").addEventListener("click", function () {
  let titlev = document.getElementById("title").value;
  let descriptionv = document.getElementById("description").value;
  let pricev = document.getElementById("price").value;
  let stockv = document.getElementById("stock").value;
  let categoryv = document.getElementById("category").value;
  let brandv = document.getElementById("brand").value;
  let urls = document.querySelectorAll(".url");

  for (let i = 0; i < urls.length; i++) {
    urlArray.push(urls[i].value);
  }

  let discountPercentagev = document.getElementById("discountPercentage").value;
  let ratingv = document.getElementById("rating").value;
  var inputsElements = document.querySelectorAll(`#DialogAddProduct input`);
  let priceInput = document.getElementById("price");
  let stockInput = document.getElementById("stock");
  if (!validate(inputsElements, priceInput, stockInput)) return;

  let newProduct = {
    id: products.length + 1,
    title: titlev,
    description: descriptionv,
    price: Number(pricev),
    stock: Number(stockv),
    category: categoryv,
    brand: brandv,
    images: urlArray,
    discountPercentage: Number(discountPercentagev),
    rating: Number(ratingv),
  };

  products.push(newProduct);
  saveProducts();

  print(products1);
  dialogAddProduct.close();
});

document.getElementById("updateProduct").addEventListener("click", function () {
  let titleEdite = document.getElementById("titleEdite").value;
  let descriptionEdite = document.getElementById("descriptionEdite").value;
  let priceEdite = document.getElementById("priceEdite").value;
  let stockEdite = document.getElementById("stockEdite").value;
  let discountPercentageEdite = document.getElementById(
    "discountPercentageEdite"
  ).value;
  let ratingEdite = document.getElementById("ratingEdite").value;
  let categoryEdite = document.getElementById("categoryEdite").value;
  let brandEdite = document.getElementById("brandEdite").value;
  var inputsElements = document.querySelectorAll(`#DialogEditeProduct input`);
  let priceInput = document.getElementById("priceEdite");
  let stockInput = document.getElementById("stockEdite");

  let urlArryEdite = [];
  let urlsEdite = document.querySelectorAll(".urlEdite");
  for (let i = 0; i < urlsEdite.length; i++) {
    urlArryEdite.push(urlsEdite[i].value);
  }

  if (!validate(inputsElements, priceInput, stockInput)) return;

  let i = Number(DialogEditeProduct.dataset.productIndex || 0);
  products[i].title = titleEdite;
  products[i].description = descriptionEdite;
  products[i].price = priceEdite;
  products[i].stock = stockEdite;
  products[i].discountPercentage = Number(discountPercentageEdite);
  products[i].rating = Number(ratingEdite);

  products[i].category = categoryEdite;
  products[i].brand = brandEdite;
  products[i].images = urlArryEdite;
  saveProducts();

  print(products);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  DialogEditeProduct.close();
});

function search(userInput, arr, fun) {
  document.getElementById("emptyState").classList.add("hidden");

  var filteredProducts = arr.filter(function (product) {
    return product.title.toLowerCase().includes(userInput.toLowerCase().trim());
  });
  fun(filteredProducts);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  if (filteredProducts.length == 0 && fun == print) {
    document.getElementById("emptyState").classList.remove("hidden");
  }
  if (filteredProducts.length == 0 && fun == printWish) {
    document.getElementById("emptyStateWishlist").classList.remove("hidden");
    document.getElementById("empty").classList.add("hidden");
    if (productsWishList.length == 0) {
      document.getElementById("empty").classList.remove("hidden");
      document.getElementById("emptyStateWishlist").classList.add("hidden");
    }
  }
  if (filteredProducts.length != 0 && fun == printWish) {
    document.getElementById("emptyStateWishlist").classList.add("hidden");
    if (productsWishList.length == 0) {
      document.getElementById("empty").classList.remove("hidden");
    }
  }
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
    console.log(productsWishList);

    search(userInput, productsWishList, printWish);
  });

function validate(inputsElements, priceInput, stockInput) {
  document.querySelectorAll('[name="error-msg"]').forEach(function (msg) {
    msg.remove();
  });
  var requiredElements = [...inputsElements].filter(function (item) {
    if (item.getAttribute("data-validation") == "required") return true;
    return false;
  });
  var isValidate = true;

  requiredElements.forEach(function (item) {
    var itemName = item.getAttribute("name");

    if (item.value.trim().length == 0) {
      var errorMsg = document.createElement("div");
      errorMsg.textContent = `${itemName} is required`;
      errorMsg.classList.add("text-red-500");
      errorMsg.classList.add("text-xs");
      errorMsg.setAttribute("name", "error-msg");

      item.after(errorMsg);

      isValidate = false;
    }
  });
  if (priceInput.value.trim().length != 0) {
    if (Number(priceInput.value) <= 0) {
      var errorMsg = document.createElement("div");
      errorMsg.textContent = `${priceInput.getAttribute(
        "name"
      )} must be greater than 0`;
      errorMsg.classList.add("text-red-500");
      errorMsg.classList.add("text-xs");
      errorMsg.setAttribute("name", "error-msg");
      priceInput.after(errorMsg);
      isValidate = false;
    }
  }
  if (stockInput.value.trim().length != 0) {
    if (Number(stockInput.value) < 0) {
      var errorMsg = document.createElement("div");
      errorMsg.textContent = `${stockInput.getAttribute(
        "name"
      )} must be 0 or greater`;
      errorMsg.classList.add("text-red-500");
      errorMsg.classList.add("text-xs");
      errorMsg.setAttribute("name", "error-msg");
      stockInput.after(errorMsg);
      isValidate = false;
    }
  }

  return isValidate;
}

let addImages = document.getElementById("addImages");
let url11 = document.getElementById("url1");
addImages.addEventListener("click", function () {
  let uurl = document.querySelectorAll(".url");

  let newImage = document.createElement("div");
  newImage.innerHTML = `<input id="url${
    uurl.length + 1
  }" class="h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] md:text-sm focus:border-primary focus:ring-1 focus:ring-accent focus:outline-none border-secondary url" placeholder="Image URL ${
    uurl.length + 1
  }" value="">`;
  containerImages.append(newImage);
});
let addImagesDetails = document.getElementById("addImagesDetails");

addImagesDetails.addEventListener("click", function () {
  let urlll = document.querySelectorAll(".urlEdite");

  let i = Number(dialogDetails.dataset.productIndex || 0);

  let newImage = document.createElement("div");
  newImage.innerHTML = `<input id="url${
    urlll.length + 1
  }Edite" class="urlEdite h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] md:text-sm focus:border-primary focus:ring-1 focus:ring-accent focus:outline-none border-secondary url" placeholder="Image URL ${
    urlll.length + 1
  }" value="">`;
  document.getElementById("containerImagesEdite").append(newImage);
});

let toggle = document.getElementById("menuToggle");
let panel = document.getElementById("mobileMenu");

toggle?.addEventListener("click", () => {
  let expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!expanded));
  panel.style.maxHeight = expanded ? "0px" : panel.scrollHeight + "px";
});

panel?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = "0px";
  });
});

let rowBtn = document.getElementById("rowLayout");
rowBtn.addEventListener("click", rowLayout);

function rowLayout() {
  document.querySelector(".cards").classList.add("flex-col");
  let cards = document.querySelectorAll(".card");
  let mainCard = document.querySelectorAll(".mainCard");
  let imgcont = document.querySelectorAll(".imgcont");
  let imggg = document.querySelectorAll(".imggg");
  let footerProduct = document.querySelectorAll(".footer-product");
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove("sm:h-[440px]");
    cards[i].classList.remove("max-w-4xs");
    cards[i].classList.remove("sm:max-w-3xs");
    cards[i].classList.remove("py-6");
    cards[i].classList.add("sm:flex-row");
    cards[i].classList.add("md:max-w-3xxl");
    cards[i].classList.add("md:!h-[160px]");

    mainCard[i].classList.add("md:w-[30%]");
    mainCard[i].classList.add("sm:w-[20%]");
    imgcont[i].classList.add("md:w-[192px]");
    imgcont[i].classList.add("sm:w-[160px]");
    imggg[i].classList.remove("h-48");
    imggg[i].classList.add("md:h-[160px]");
    footerProduct[i].classList.add("sm:pt-5");
  }
  gridBtn.classList.remove("!bg-primary");
  gridBtn.classList.remove("!text-white");
  rowBtn.classList.add("!bg-primary");
  rowBtn.classList.add("!text-white");
}

let gridBtn = document.getElementById("gridLayout");
gridBtn.addEventListener("click", gridLayout);

function gridLayout() {
  rowBtn.classList.remove("!bg-primary");
  rowBtn.classList.remove("!text-white");
  gridBtn.classList.add("!bg-primary");
  gridBtn.classList.add("!text-white");
  let imggg = document.querySelectorAll(".imggg");

  document.querySelector(".cards").classList.remove("flex-col");
  let cards = document.querySelectorAll(".card");
  let mainCard = document.querySelectorAll(".mainCard");
  let imgcont = document.querySelectorAll(".imgcont");
  let footerProduct = document.querySelectorAll(".footer-product");

  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.add("sm:h-[440px]");
    cards[i].classList.add("max-w-4xs");
    cards[i].classList.add("sm:max-w-3xs");

    cards[i].classList.add("py-6");
    cards[i].classList.remove("sm:flex-row");
    cards[i].classList.remove("md:max-w-3xxl");
    cards[i].classList.remove("md:!h-[160px]");

    mainCard[i].classList.remove("md:w-[30%]");
    mainCard[i].classList.remove("sm:w-[20%]");
    imgcont[i].classList.remove("md:w-[192px]");
    imgcont[i].classList.remove("sm:w-[160px]");
    imggg[i].classList.add("h-48");
    imggg[i].classList.remove("md:h-[160px]");

    footerProduct[i].classList.remove("sm:pt-5");
  }
}

let btn = document.getElementById("dropdownBtn");
let menu = document.getElementById("dropdownMenu");
let explore = document.getElementById("exploreCategories");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (
    !btn.contains(e.target) &&
    !menu.contains(e.target) &&
    !explore.contains(e.target)
  ) {
    menu.classList.add("hidden");
  }
});

let all = document.getElementById("all");
let beauty = document.getElementById("beauty");
let fragrances = document.getElementById("fragrances");
let furniture = document.getElementById("furniture");
let groceries = document.getElementById("groceries");

all.addEventListener("click", function () {
  print(products);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  menu.classList.add("hidden");
  btn.innerHTML = `All Products
  <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>`;
  btn.classList.add("border-primary");
  btn.classList.add("ring-1");
  btn.classList.add("ring-accent");
  btn.classList.add("outline-none");
});
beauty.addEventListener("click", function () {
  let beautyArr = products.filter(function (p) {
    return p.category == "beauty";
  });
  print(beautyArr);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  menu.classList.add("hidden");
  btn.innerHTML = `Beauty
  <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>`;
  btn.classList.add("border-primary");
  btn.classList.add("ring-1");
  btn.classList.add("ring-accent");
  btn.classList.add("outline-none");
});
fragrances.addEventListener("click", function () {
  let fragrancesArr = products.filter(function (p) {
    return p.category == "fragrances";
  });
  print(fragrancesArr);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  menu.classList.add("hidden");
  btn.innerHTML = `Fragrances
  <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>`;
  btn.classList.add("border-primary");
  btn.classList.add("ring-1");
  btn.classList.add("ring-accent");
  btn.classList.add("outline-none");
});
furniture.addEventListener("click", function () {
  let furnitureArr = products.filter(function (p) {
    return p.category == "furniture";
  });
  print(furnitureArr);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  menu.classList.add("hidden");
  btn.innerHTML = `Furniture
  <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>`;
  btn.classList.add("border-primary");
  btn.classList.add("ring-1");
  btn.classList.add("ring-accent");
  btn.classList.add("outline-none");
});
groceries.addEventListener("click", function () {
  let groceriesArr = products.filter(function (p) {
    return p.category == "groceries";
  });
  print(groceriesArr);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  menu.classList.add("hidden");
  btn.innerHTML = `Groceries
  <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>`;
  btn.classList.add("border-primary");
  btn.classList.add("ring-1");
  btn.classList.add("ring-accent");
  btn.classList.add("outline-none");
});

[
  "DialogAddProduct",
  "dialogDetails",
  "dialogCart",
  "dialogWishlist",
  "DialogEditeProduct",
].forEach((id) => {
  let dlg = document.getElementById(id);
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
});

let clearSearchBtn = document.getElementById("clearSearchBtn");
clearSearchBtn.addEventListener("click", function () {
  document.getElementById("searchInputProduct").value = "";
  document.getElementById("searchInputProduct").focus();
  document.getElementById("dropdownBtn").click();

  document.getElementById("dropdownMenu").classList.remove("hidden");

  document.getElementById("emptyState").classList.add("hidden");
  print(products);
});
explore.addEventListener("click", function () {
  document.getElementById("dropdownBtn").focus();
  document.getElementById("dropdownBtn").click();
});

let btnsPag = document.querySelectorAll(".join-item");
function removeActivePag() {
  for (let index = 0; index < btnsPag.length; index++) {
    btnsPag[index].classList.remove("btn-active");
  }
}

document.getElementById("pag1").addEventListener("click", function () {
  removeActivePag();
  document.getElementById("pag1").classList.add("btn-active");
  print(products1);
});

document.getElementById("pag2").addEventListener("click", function () {
  removeActivePag();
  document.getElementById("pag2").classList.add("btn-active");
  print(products2);
});

document.getElementById("pag3").addEventListener("click", function () {
  removeActivePag();
  document.getElementById("pag3").classList.add("btn-active");
  print(products3);
});
