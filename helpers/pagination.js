module.exports = (objectPagination, query, countProducts) => {
  // Pagination
  if (query.page) {
    objectPagination.curruntPage = parseInt(query.page); // Chuyển về kiểu int
  }
  objectPagination.skip =
    (objectPagination.curruntPage - 1) * objectPagination.limitItems; // số sản phẩm bỏ qua = (số trang -1 ) * số sản phẩm mỗi trang

  const totalPage = Math.ceil(countProducts / objectPagination.limitItems); // Chia cho số trang và làm tròn lên
  objectPagination.totalPage = totalPage; // gắn vào obj
  return objectPagination;
};
