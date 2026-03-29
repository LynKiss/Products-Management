import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

const imageInput = document.querySelector("#chat-images");
const previewImages = document.querySelector(".chat .inner-preview-images");
const formSendData = document.querySelector(".chat .inner-form");
const bodyChat = document.querySelector(".chat .inner-body");
const inputChat = document.querySelector(".chat .inner-form input[name='content']");
const buttonIcon = document.querySelector(".button-icon");
const elementListTyping = document.querySelector(".chat .inner-list-typing");
const myId = document.querySelector("[my-id]")?.getAttribute("my-id");

let selectedImageFiles = [];
let typingTimeout;
let gallery;

const hasSocketClient = () => typeof socket !== "undefined" && socket && typeof socket.emit === "function";
const isRealtimeChatReady = () => hasSocketClient() && socket.connected;

const getSelectedImages = () => selectedImageFiles;

const escapeHtml = (text = "") =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const normalizeImages = (images = []) =>
  images
    .map((image) => image?.secure_url || image?.url || image)
    .filter(Boolean);

const renderImages = (images = []) => {
  const normalizedImages = normalizeImages(images);

  if (!normalizedImages.length) {
    return "";
  }

  const imageItems = normalizedImages
    .map((image) => `<img src="${image}" alt="chat-image">`)
    .join("");

  return `<div class="inner-images">${imageItems}</div>`;
};

const renderSelectedImages = () => {
  if (!previewImages) {
    return;
  }

  if (!selectedImageFiles.length) {
    previewImages.innerHTML = "";
    previewImages.classList.remove("show");
    return;
  }

  previewImages.innerHTML = selectedImageFiles
    .map((file, index) => {
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

  previewImages.classList.add("show");
};

const clearSelectedImages = () => {
  selectedImageFiles = [];

  if (imageInput) {
    imageInput.value = "";
  }

  renderSelectedImages();
};

const renderMessage = (data, currentUserId) => {
  const isMine = currentUserId == data.userId;
  const wrapperClass = isMine ? "inner-outgoing" : "inner-incoming";
  const fullNameHtml = isMine
    ? ""
    : `<div class="inner-name">${escapeHtml(data.fullName || "")}</div>`;
  const content = (data.content || "").trim();
  const contentHtml = content ? `<div class="inner-content">${escapeHtml(content)}</div>` : "";
  const imagesHtml = renderImages(data.images);

  return `
    <div class="${wrapperClass}">
      ${fullNameHtml}
      ${contentHtml}
      ${imagesHtml}
    </div>
  `;
};

const scrollChatToBottom = () => {
  if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
  }
};

const hideTyping = () => {
  if (isRealtimeChatReady()) {
    socket.emit("CLIENT_SEND_TYPING", "hide");
  }
};

const appendMessageToChat = (data) => {
  if (!bodyChat || !myId) {
    return;
  }

  bodyChat.insertAdjacentHTML("beforeend", renderMessage(data, myId));

  if (gallery) {
    gallery.update();
  }

  scrollChatToBottom();
};

const sendMessageByHttp = async (content) => {
  const response = await fetch(formSendData.action, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: new URLSearchParams({ content }).toString()
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success || !result.message) {
    throw new Error(result?.message || "Gui tin nhan that bai.");
  }

  appendMessageToChat(result.message);
};

const typingShow = () => {
  if (!isRealtimeChatReady()) {
    return;
  }

  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hide");
  }, 3500);
};

if (imageInput) {
  imageInput.addEventListener("change", (event) => {
    const newFiles = Array.from(event.target.files || []);

    if (!newFiles.length) {
      return;
    }

    const remainingSlots = Math.max(0, 6 - selectedImageFiles.length);
    selectedImageFiles = selectedImageFiles.concat(newFiles.slice(0, remainingSlots));
    imageInput.value = "";
    renderSelectedImages();
  });
}

if (previewImages) {
  previewImages.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".inner-remove-preview");

    if (!removeButton) {
      return;
    }

    const removeIndex = Number(removeButton.dataset.index);
    selectedImageFiles = selectedImageFiles.filter((_, index) => index !== removeIndex);
    renderSelectedImages();
  });
}

if (formSendData) {
  formSendData.addEventListener("submit", async (event) => {
    const content = event.target.elements.content.value.trim();
    const images = getSelectedImages();

    if (!content && images.length === 0) {
      event.preventDefault();
      return;
    }

    if (!isRealtimeChatReady()) {
      event.preventDefault();

      if (images.length > 0) {
        window.alert("Ket noi realtime dang gap loi. Ban hay gui tin nhan text hoac thu lai sau.");
        return;
      }

      try {
        await sendMessageByHttp(content);
        event.target.elements.content.value = "";
        clearSelectedImages();
        hideTyping();
      } catch (error) {
        window.alert(error.message || "Gui tin nhan that bai.");
      }

      return;
    }

    event.preventDefault();
    socket.emit("CLIENT_SEND_MESSAGE", { content, images });
    event.target.elements.content.value = "";
    clearSelectedImages();
    hideTyping();
  });
}

if (hasSocketClient()) {
  socket.on("SERVER_RETURN_MESSAGE", (data) => {
    appendMessageToChat(data);
  });
}

scrollChatToBottom();

if (buttonIcon) {
  const emojiPopup = document.querySelector(".emoji-picker-popup");

  if (emojiPopup) {
    Popper.createPopper(buttonIcon, emojiPopup, {
      placement: "top-end"
    });
  }

  buttonIcon.onclick = () => {
    if (emojiPopup) {
      emojiPopup.classList.toggle("shown");
    }
  };
}

if (inputChat) {
  const emojiPicker = document.querySelector(".emoji-picker-popup emoji-picker");

  if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (event) => {
      const icon = event.detail.unicode;
      inputChat.value += icon;

      const end = inputChat.value.length;
      inputChat.setSelectionRange(end, end);
      inputChat.focus();
      typingShow();
    });
  }

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

  inputChat.addEventListener("keyup", typingShow);
  inputChat.addEventListener("blur", hideTyping);
  inputChat.addEventListener("click", typingShow);
}

if (elementListTyping && hasSocketClient()) {
  socket.on("SERVER_SEND_TYPING", (data) => {
    if (data.type === "show") {
      if (!elementListTyping.querySelector(`[user-id="${data.userId}"]`)) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
          <div class="inner-name">${escapeHtml(data.fullName || "")}</div>
          <div class="inner-dots">
            <span></span><span></span><span></span>
          </div>
        `;

        elementListTyping.appendChild(boxTyping);
        scrollChatToBottom();
      }
    } else if (data.type === "hide") {
      const existing = elementListTyping.querySelector(`[user-id="${data.userId}"]`);

      if (existing) {
        existing.remove();
      }
    }
  });
}

if (bodyChat && typeof Viewer !== "undefined") {
  gallery = new Viewer(bodyChat);
}
