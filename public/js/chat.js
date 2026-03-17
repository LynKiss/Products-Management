// Import Popper để định vị popup emoji bám theo nút emoji.
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

// Lấy input chọn ảnh trong form chat.
const imageInput = document.querySelector("#chat-images");
// Khu vực hiển thị ảnh xem trước trước khi gửi.
const previewImages = document.querySelector(".chat .inner-preview-images");
// Mảng tạm giữ các file ảnh người dùng đã chọn.
let selectedImageFiles = [];

// Trả về danh sách ảnh đang được chọn.
const getSelectedImages = () => selectedImageFiles;
// Escape HTML để tránh lỗi hiển thị và giảm rủi ro chèn HTML không mong muốn vào chat.
const escapeHtml = (text = "") => text
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");
// Chuẩn hóa dữ liệu ảnh vì có lúc ảnh là object Cloudinary, có lúc là string URL.
const normalizeImages = (images = []) => images
  .map((image) => image?.secure_url || image?.url || image)
  .filter(Boolean);

// Render danh sách ảnh preview ngay phía trên ô nhập.
const renderSelectedImages = () => {
  // Nếu không có vùng preview thì dừng luôn.
  if (!previewImages) {
    return;
  }

  // Nếu chưa chọn ảnh nào thì xóa giao diện preview.
  if (!selectedImageFiles.length) {
    previewImages.innerHTML = "";
    previewImages.classList.remove("show");
    return;
  }

  // Tạo HTML cho từng ảnh preview và nút xóa tương ứng.
  const previewItems = selectedImageFiles
    .map((file, index) => {
      // Tạo URL tạm từ file local để trình duyệt hiển thị preview.
      const imageUrl = URL.createObjectURL(file);
      return `
        <div class="inner-preview-item">
          <img src="${imageUrl}" alt="preview-image">
          <button type="button" class="inner-remove-preview" data-index="${index}" aria-label="Xoa anh">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    })
    .join("");

  // Đưa HTML preview vào DOM.
  previewImages.innerHTML = previewItems;
  // Hiện vùng preview.
  previewImages.classList.add("show");
};

// Xóa toàn bộ ảnh đã chọn sau khi gửi hoặc khi cần reset form.
const clearSelectedImages = () => {
  // Reset mảng file trong bộ nhớ.
  selectedImageFiles = [];
  // Reset luôn input file để người dùng có thể chọn lại cùng một file nếu muốn.
  if (imageInput) {
    imageInput.value = "";
  }
  // Render lại giao diện sau khi xóa.
  renderSelectedImages();
};

// Tạo HTML cho một tin nhắn chat mới nhận từ socket.
const renderMessage = (data, myId) => {
  // Kiểm tra tin nhắn này có phải của chính mình không.
  const isMine = myId == data.userId;
  // Chọn class CSS tương ứng cho tin nhắn gửi đi hoặc nhận vào.
  const wrapperClass = isMine ? "inner-outgoing" : "inner-incoming";
  // Nếu là người khác gửi thì hiện tên, còn của mình thì không cần.
  const fullNameHtml = isMine ? "" : `<div class="inner-name">${escapeHtml(data.fullName || "")}</div>`;
  // Chuẩn hóa nội dung text để loại bỏ khoảng trắng thừa.
  const content = (data.content || "").trim();
  // Chỉ render bubble text nếu thật sự có nội dung.
  const contentHtml = content ? `<div class="inner-content">${escapeHtml(content)}</div>` : "";
  // Render phần ảnh nếu tin nhắn có đính kèm ảnh.
  const imagesHtml = renderImages(data.images);

  // Trả về khối HTML hoàn chỉnh của một message.
  return `
    <div class="${wrapperClass}">
      ${fullNameHtml}
      ${contentHtml}
      ${imagesHtml}
    </div>
  `;
};

// Lắng nghe khi người dùng chọn file ảnh.
if (imageInput) {
  imageInput.addEventListener("change", (event) => {
    // Lấy danh sách file mới vừa chọn.
    const newFiles = Array.from(event.target.files || []);
    // Nếu không có file thì không làm gì.
    if (!newFiles.length) {
      return;
    }

    // Giới hạn tối đa 6 ảnh.
    const remainingSlots = Math.max(0, 6 - selectedImageFiles.length);
    // Gộp ảnh mới vào danh sách ảnh đã chọn trước đó.
    selectedImageFiles = selectedImageFiles.concat(newFiles.slice(0, remainingSlots));
    // Reset input để có thể chọn lại cùng file ở lần sau.
    imageInput.value = "";
    // Cập nhật lại khung preview.
    renderSelectedImages();
  });
}

// Bắt sự kiện xóa từng ảnh ngay trong vùng preview.
if (previewImages) {
  previewImages.addEventListener("click", (event) => {
    // Tìm nút xóa gần nhất được click.
    const removeButton = event.target.closest(".inner-remove-preview");
    // Nếu click không phải nút xóa thì bỏ qua.
    if (!removeButton) {
      return;
    }

    // Lấy vị trí ảnh cần xóa từ data-index.
    const removeIndex = Number(removeButton.dataset.index);
    // Lọc bỏ ảnh tương ứng khỏi mảng đã chọn.
    selectedImageFiles = selectedImageFiles.filter((_, index) => index !== removeIndex);
    // Render lại giao diện preview sau khi xóa.
    renderSelectedImages();
  });
}

// Lấy form gửi tin nhắn.
const formSendData = document.querySelector(".chat .inner-form");
// CLIENT_SEND_MESSAGE
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    {
      // Chặn form submit theo kiểu tải lại trang.
      e.preventDefault();
      // Lấy nội dung text và bỏ khoảng trắng dư ở đầu/cuối.
      const content = e.target.elements.content.value.trim();
      // Lấy danh sách ảnh đang chọn.
      const images = getSelectedImages();

      // Chỉ gửi khi có text hoặc có ít nhất một ảnh.
      if (content || images.length > 0) {
        // Gửi dữ liệu qua socket lên server.
        socket.emit("CLIENT_SEND_MESSAGE", { content: content, images: images });
        // Xóa text trong input sau khi gửi.
        e.target.elements.content.value = "";
        // Xóa ảnh preview sau khi gửi.
        clearSelectedImages();
        // Báo cho server biết đã ngừng gõ.
        socket.emit("CLIENT_SEND_TYPING", "hide");
      }
    }
  });
}
// END CLIENT_SEND_MESSAGE

// Cuộn khung chat xuống cuối để luôn thấy tin nhắn mới nhất.
const scrollChatToBottom = () => {
  // Lấy phần thân của khung chat.
  const body = document.querySelector(".chat .inner-body");
  // Nếu phần thân tồn tại thì kéo xuống cuối.
  if (body) {
    body.scrollTop = body.scrollHeight;
  }
};

// Tạo HTML cho danh sách ảnh trong một tin nhắn.
const renderImages = (images = []) => {
  // Chuẩn hóa dữ liệu ảnh về dạng URL.
  const normalizedImages = normalizeImages(images);

  // Nếu không có ảnh thì không render gì.
  if (!normalizedImages.length) {
    return "";
  }

  // Tạo thẻ img cho từng ảnh.
  const imageItems = normalizedImages
    .map((image) => `<img src="${image}" alt="chat-image">`)
    .join("");

  // Bọc các ảnh vào container chung để CSS xử lý layout.
  return `<div class="inner-images">${imageItems}</div>`;
};

// SERVER_RETURN_MESSAGE
// Nhận tin nhắn mới từ server và append ngay vào khung chat.
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  // Lấy id của user hiện tại từ HTML.
  const myId = document.querySelector("[my-id]").getAttribute("my-id")
  // Lấy phần body chat để chèn message mới.
  const body = document.querySelector(".chat .inner-body")
  // Chèn tin nhắn mới vào cuối danh sách.
  body.insertAdjacentHTML("beforeend", renderMessage(data, myId));
  // Nếu đã khởi tạo Viewer thì cập nhật để nhận diện luôn ảnh mới thêm.
  if (gallery) {
    gallery.update();
  }
  // Cuộn xuống cuối sau khi có tin nhắn mới.
  scrollChatToBottom();
});
// END SERVER_RETURN_MESSAGE

// Scroll chat to bottom on first render
// Khi mới vào trang, tự cuộn tới cuối đoạn chat cũ.
scrollChatToBottom();
// END Scroll chat to bottom

// Show Icon Chat
// Show Popup
// Lấy nút emoji trên form chat.
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  // Lấy popup emoji.
  const emojiPopup = document.querySelector(".emoji-picker-popup");
  // Nếu popup tồn tại thì dùng Popper để đặt vị trí bám theo nút emoji.
  if (emojiPopup) {
    Popper.createPopper(buttonIcon, emojiPopup, {
      placement: "top-end"
    });
  }

  // Click vào nút emoji thì bật/tắt popup.
  buttonIcon.onclick = () => {
    if (emojiPopup) {
      emojiPopup.classList.toggle("shown");
    }
  };
}
// End Show Popup

// Typing indicator helpers
// Lấy ô input text để theo dõi trạng thái đang gõ.
const inputChat = document.querySelector(".chat .inner-form input[name='content']");
// Biến giữ timer debounce cho trạng thái typing.
let timeOut;
// Hàm thông báo lên server rằng user đang gõ.
const typingShow = () => {
  // Báo hiển thị typing.
  socket.emit("CLIENT_SEND_TYPING", "show");
  // Xóa timer cũ để tránh gọi hide quá sớm.
  clearTimeout(timeOut);
  // Nếu ngừng thao tác một lúc thì tự động gửi hide.
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hide");
  }, 3500);
};
if (inputChat) {
  // Lấy web component chọn emoji trong popup.
  const emojiPicker = document.querySelector(".emoji-picker-popup emoji-picker");
  if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (event) => {
      // Lấy emoji vừa click.
      const icon = event.detail.unicode;
      // Chèn emoji vào cuối nội dung đang nhập.
      inputChat.value += icon;
      // Lấy vị trí cuối chuỗi sau khi thêm emoji.
      const end = inputChat.value.length;
      // Đưa con trỏ về cuối ô input.
      inputChat.setSelectionRange(end, end);
      // Focus lại input để người dùng tiếp tục gõ.
      inputChat.focus();
      // Đồng thời bật trạng thái đang gõ.
      typingShow();
    });
  }

  // Click ra ngoài popup và nút emoji thì đóng popup.
  document.addEventListener("click", (event) => {
    const emojiPopup = document.querySelector(".emoji-picker-popup");
    if (
      emojiPopup &&
      emojiPopup.classList.contains("shown") &&
      !emojiPopup.contains(event.target) &&
      !buttonIcon?.contains(event.target)
    ) {
      emojiPopup.classList.remove("shown");
    }
  });

  // Khi gõ phím thì hiển thị typing.
  inputChat.addEventListener("keyup", typingShow);
  // Khi blur khỏi input thì ẩn typing.
  inputChat.addEventListener("blur", () => socket.emit("CLIENT_SEND_TYPING", "hide"));
  // Khi click vào input cũng tính là bắt đầu gõ.
  inputChat.addEventListener("click", typingShow);
}
// End Insert Icon To Input

// End Show Icon Chat

// SERVER RETURN TYPING
// Lấy vùng chứa danh sách người đang gõ.
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  // Nhận trạng thái typing từ server.
  socket.on("SERVER_SEND_TYPING", (data) => {
    // Nếu server báo "show" thì thêm box typing của user đó.
    if (data.type === "show") {
      const bodyChat = document.querySelector(".chat .inner-body");
      // Chỉ thêm nếu chưa có box typing của user này.
      if (!elementListTyping.querySelector(`[user-id="${data.userId}"]`)) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span><span></span><span></span>
          </div>
        `;
        // Gắn box typing vào DOM.
        elementListTyping.appendChild(boxTyping);
        // Cuộn xuống cuối để thấy typing indicator.
        bodyChat.scrollTop = bodyChat.scrollHeight

      }
      // Nếu server báo "hide" thì xóa box typing của user đó.
    } else if (data.type === "hide") {
      const existing = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if (existing) existing.remove();
    }
  });
}
// eND SERVER RETURN TYPING

// PREVIEWER FULL IMAGE
// Khởi tạo Viewer một lần cho toàn bộ vùng chat để click ảnh xem lớn.
const bodychatPreviewImage = document.querySelector(".chat .inner-body");
let gallery;
if (bodychatPreviewImage) {
  gallery = new Viewer(bodychatPreviewImage);
}
// END PREVIEWER FULL IMAGE
