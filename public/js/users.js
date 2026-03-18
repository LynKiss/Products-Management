// Chuc nang gui yeu cau ket ban
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-add-friend");
      const boxUser = button.closest(".box-user");

      if (!boxUser) return;

      boxUser.setAttribute("data-request-status", "pending");

      if (typeof socket !== "undefined") {
        socket.emit("CLIENT_ADD_FRIEND", userId);
      }
    });
  });
}
// End Chuc nang gui yeu cau ket ban

// Chuc nang huy yeu cau ket ban
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-cancel-friend");
      const boxUser = button.closest(".box-user");

      if (!boxUser) return;

      boxUser.setAttribute("data-request-status", "none");

      if (typeof socket !== "undefined") {
        socket.emit("CLIENT_CANCEL_FRIEND", userId);
      }
    });
  });
}
// End Chuc nang huy yeu cau ket ban
