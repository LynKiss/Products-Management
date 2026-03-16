import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    {
      e.preventDefault();
      const content = e.target.elements.content.value;

      if (content) {
        socket.emit("CLIENT_SEND_MESSAGE", content);
        e.target.elements.content.value = "";
      }
    }
  });
}
// END CLIENT_SEND_MESSAGE
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
  body.appendChild(div)
})
// END SERVER_RETURN_MESSAGE
// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight
}
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


// Insert Icon To Input
const inputChat = document.querySelector(".chat .inner-form input[name='content']");
if (inputChat) {
  const emojiPicker = document.querySelector("emoji-picker");
  if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (event) => {
      const icon = event.detail.unicode;
      inputChat.value = inputChat.value + icon;
    });
  }
  var timeOut;
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hide");
    }, 5000);
  });

  inputChat.addEventListener("blur", () => {
    socket.emit("CLIENT_SEND_TYPING", "hide");
  });
  inputChat.addEventListener("click", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
  });
}
// End Insert Icon To Input

// End Show Icon Chat

// SERVER RETURN TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_SEND_TYPING", (data) => {
    if (data.type === "show") {
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
      }
    } else if (data.type === "hide") {
      const existing = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if (existing) existing.remove();
    }
  });
}
// eND SERVER RETURN TYPING