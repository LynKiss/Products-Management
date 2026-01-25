const ProductCategory = require("../models/product-category");
module.exports.getSubCategory = async (parentId) => {
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    let allSub = [...subs];

    for (const sub of subs) {
      // đệ quê để lấy các thằng con của tk con trong thằng cha nữa
      const childs = await getCategory(sub.id); // rồi lại truyền cái id của thằng con của thằng cha
      allSub = allSub.concat(childs); // rồi lại gắn lại vào allSub tiếp
    }

    return allSub;
  };
  const result = await getCategory(parentId);
  return result;
};
