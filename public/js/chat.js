import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
//file-upload-with-preview
//END file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
  multiple: true,
  maxFilecount: 6
});
// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    {
      e.preventDefault();
      const content = e.target.elements.content.value;
      const images = upload.cachedFileArray;

      if (content || images.length > 0) {
        socket.emit("CLIENT_SEND_MESSAGE", { content: content, images: images });
        e.target.elements.content.value = "";
        socket.emit("CLIENT_SEND_TYPING", "hide");
      }
    }
  });
}
// END CLIENT_SEND_MESSAGE

const scrollChatToBottom = () => {
  const body = document.querySelector(".chat .inner-body");
  if (body) {
    body.scrollTop = body.scrollHeight;
  }
};

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id")
  const body = document.querySelector(".chat .inner-body")
  const div = document.createElement("div");
  let htmlFullName = ""
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName} </div>`
    div.classList.add("inner-incoming");
  }

  div.innerHTML =
    `
  ${htmlFullName}
  <div class="inner-content">${data.content} </div>
  `
  body.appendChild(div);
  scrollChatToBottom();
});
// END SERVER_RETURN_MESSAGE

// Scroll chat to bottom on first render
scrollChatToBottom();
// END Scroll chat to bottom

// Show Icon Chat
// Show Popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
// End Show Popup

// Typing indicator helpers
const inputChat = document.querySelector(".chat .inner-form input[name='content']");
let timeOut;
const typingShow = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hide");
  }, 3500);
};
if (inputChat) {
  const emojiPicker = document.querySelector("emoji-picker");
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

  inputChat.addEventListener("keyup", typingShow);
  inputChat.addEventListener("blur", () => socket.emit("CLIENT_SEND_TYPING", "hide"));
  inputChat.addEventListener("click", typingShow);
}
// End Insert Icon To Input

// End Show Icon Chat

// SERVER RETURN TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_SEND_TYPING", (data) => {
    if (data.type === "show") {
      const bodyChat = document.querySelector(".chat .inner-body");
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
        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight

      }
    } else if (data.type === "hide") {
      const existing = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if (existing) existing.remove();
    }
  });
}
// eND SERVER RETURN TYPING