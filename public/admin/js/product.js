// Change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      console.log(id);
      let statusChange = statusCurrent == "active" ? "inactive" : "active";
      const active = path + `/${statusChange}/${id}?_method=PATCH`;
      console.log(active);
      formChangeStatus.action = active; // Có thể dùng setAttribute
      formChangeStatus.submit();
    });
  });
}
