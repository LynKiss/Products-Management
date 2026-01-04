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
// End Change-status

//CheckBox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]"); // thuộc tính có 1 lên không cần dùng all ( cả đoạn html)
if (checkboxMulti) {
  const inputcheckAll = checkboxMulti.querySelector("input[name='checkall']"); // Lấy ra nút check all trong checkboxmulti
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']"); // lấy ra nhiều nút check id
  inputcheckAll.addEventListener("click", () => {
    if (inputcheckAll.checked) {
      inputIds.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputIds.forEach((input) => {
        input.checked = false;
      });
    }
  });
  inputIds.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      if (countChecked == inputIds.length) {
        inputcheckAll.checked = true;
      } else {
        inputcheckAll.checked = false;
      }
    });
  });
}
//End CheckBox Multi

// Change-multi
const formChangeMulti = document.querySelector("[form-change-multi]"); // Lấy ra cái ô combo-box
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]"); // Lấy ra toàn bộ thẻ trong checkboxmulti
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked" // Lấy ra các ô đã checked
    );
    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']"); // cái ô text input lấy ra để gắn mảng vào
      inputsChecked.forEach((input) => {
        // lặp qua để lấy dữ liệu
        const id = input.value; // có thể dùng các tương tự như input.setAttribute("value")
        ids.push(id);
      });
      inputIds.value = ids.join(","); // convert mảng sang dạng string cách nhau dấu ,
      formChangeMulti.submit(); // gọi submit để gửi đi ( gọi đến file pug xong action gửi đi đến trang tiếp  action=`${prefixAdmin}/products/change-multi?_method=PATCH`)
    } else {
      console.log(" Vui lòng chọn 1 mục ");
    }
  });
}
//End Change-multi

//Delete Item
buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDelteItem = document.querySelector("#form-delete-item");
  const path = formDelteItem.getAttribute("data-path");
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Có xác nhận xóa không ?");
      if (isComfirm) {
        const id = button.getAttribute("data-id");

        const action = `${path}/${id}?_method=DELETE`;
        formDelteItem.action = action;
        formDelteItem.submit();
      }
    });
  });
}
//End Delete Item
