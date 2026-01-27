//Update quantity cart
const inputQuantity = document.querySelectorAll("input[name='quantity']");

if (inputQuantity.length > 0) {
  inputQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("item-id");
      const quantity = e.target.value;
      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
//End Update quantity cart
