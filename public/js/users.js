const createAcceptFriendCard = (user) => {
  const div = document.createElement("div");
  div.classList.add("col-6");
  div.setAttribute("data-user-id", user._id);
  div.innerHTML = `
    <div class="box-user" data-request-status="pending">
      <div class="inner-avatar">
        <img src="${user.avatar || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=2000"}" alt="${user.fullName}">
      </div>
      <div class="inner-info">
        <div class="inner-name">${user.fullName}</div>
        <div class="inner-buttons">
          <button class="btn btn-sm btn-primary mr-1 btn-add-friend" btn-accept-friend="${user._id}">Chấp nhận</button>
          <button class="btn btn-sm btn-success mr-1" btn-accepted-friend disabled>Đã chấp nhận</button>
          <button class="btn btn-sm btn-secondary mr-1 btn-cancel-friend" btn-refuse-friend="${user._id}">Xóa</button>
          <button class="btn btn-sm btn-secondary mr-1 btn-cancel-friend" btn-deleted-friend disabled>Đã xóa</button>
        </div>
      </div>
    </div>`;

  return div;
};

document.addEventListener("click", (event) => {
  const buttonAdd = event.target.closest("[btn-add-friend]");
  if (buttonAdd) {
    const userId = buttonAdd.getAttribute("btn-add-friend");
    const boxUser = buttonAdd.closest(".box-user");

    if (!boxUser || !userId) return;

    boxUser.setAttribute("data-request-status", "pending");

    if (typeof socket !== "undefined") {
      socket.emit("CLIENT_ADD_FRIEND", userId);
    }

    return;
  }

  const buttonCancel = event.target.closest("[btn-cancel-friend]");
  if (buttonCancel && buttonCancel.hasAttribute("btn-cancel-friend")) {
    const userId = buttonCancel.getAttribute("btn-cancel-friend");
    const boxUser = buttonCancel.closest(".box-user");

    if (!boxUser || !userId) return;

    boxUser.setAttribute("data-request-status", "none");

    if (typeof socket !== "undefined") {
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    }

    return;
  }

  const buttonAccept = event.target.closest("[btn-accept-friend]");
  if (buttonAccept) {
    const userId = buttonAccept.getAttribute("btn-accept-friend");
    const boxUser = buttonAccept.closest(".box-user");

    if (!boxUser || !userId) return;

    boxUser.setAttribute("data-request-status", "add");

    if (typeof socket !== "undefined") {
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    }

    return;
  }

  const buttonRefuse = event.target.closest("[btn-refuse-friend]");
  if (buttonRefuse) {
    const userId = buttonRefuse.getAttribute("btn-refuse-friend");
    const boxUser = buttonRefuse.closest(".box-user");

    if (!boxUser || !userId) return;

    boxUser.setAttribute("data-request-status", "refuse");

    if (typeof socket !== "undefined") {
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    }
  }
});

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


// SERVER_RETURN_INFO_ACCEPT_FRIEND
const dataUsersAccept = document.querySelector("[data-users-accept]")
if (dataUsersAccept) {
  const userId = dataUsersAccept.getAttribute("data-users-accept")
  socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    if (userId === data.userId) {
      const existingUser = dataUsersAccept.querySelector(`[data-user-id="${data.infoUserA._id}"]`);

      if (!existingUser) {
        const div = createAcceptFriendCard(data.infoUserA);
        dataUsersAccept.prepend(div);
      }
    }
  })
}
// END SERVER_RETURN_INFO_ACCEPT_FRIEND


//SERVER_RETURN_USER_ID_CANCEL_ACCEPT_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_ACCEPT_FRIEND", (data) => {
  const boxUserRemove = document.querySelector(`[data-user-id='${userIdA}']`);
  if (boxUserRemove) {
    const dataUsersAccept = document.querySelector("[data-users-accept]")
    const userIdB = dataUsersAccept.getAttribute("data-users-accept")
    if (userIdB === data.userIdB) {

      dataUsersAccept.removeChild(boxUserRemove)
    }
  }
})
//END SERVER_RETURN_USER_ID_CANCEL_ACCEPT_FRIEND



