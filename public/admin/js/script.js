const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href); //hàm URL để phân tích window.location.href
  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}

// tính năng timg kiếm ( file js)
const formSeach = document.querySelector("#form-search");

if (formSeach) {
  let url = new URL(window.location.href);
  formSeach.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");

if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
// Show alert
const showAlert = document.querySelector("[show-alert]");
console.log(showAlert);
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = document.querySelector("[close-alert]");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show alert

//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const uploadImagePreviewWrapper = document.querySelector(
    "[upload-image-preview-wrapper]"
  );
  const closeImage = document.querySelector(
    ".image-preview-container [close-image]"
  );

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      uploadImagePreviewWrapper.style.display = "block";
    }
  });

  // Close image preview
  if (closeImage) {
    closeImage.addEventListener("click", () => {
      uploadImagePreview.src = "";
      uploadImagePreviewWrapper.style.display = "none";
      uploadImageInput.value = "";
    });
  }
}
//End Upload Image
