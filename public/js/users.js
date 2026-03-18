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

// Chuc nang chap nhan ket ban
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-accept-friend");
      const boxUser = button.closest(".box-user");

      if (!boxUser || !userId) return;

      boxUser.setAttribute("data-request-status", "add");

      if (typeof socket !== "undefined") {
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      }
    });
  });
}
// End Chuc nang chap nhan ket ban

// Chuc nang tu choi ket ban
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-refuse-friend");
      const boxUser = button.closest(".box-user");

      if (!boxUser || !userId) return;

      boxUser.setAttribute("data-request-status", "refuse");

      if (typeof socket !== "undefined") {
        socket.emit("CLIENT_REFUSE_FRIEND", userId);
      }
    });
  });
}
// End Chuc nang tu choi ket ban

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUsersAccept = document.querySelector("[badge-users-accept]")
if (badgeUsersAccept) {
  const userId = badgeUsersAccept.getAttribute("badge-users-accept")
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    if (userId === data.userId) {

      badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
  })
}
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND
