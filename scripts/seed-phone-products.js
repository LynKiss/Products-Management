const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Product = require("../models/product.model");
const ProductCategory = require("../models/product-category");

const categoryData = {
  title: "Dien thoai",
  description: "Danh muc dien thoai mau cho trang client.",
  thumbnail: "/image/products/phone-category.svg",
  status: "active",
  position: 100,
  deleted: false,
};

const products = [
  {
    title: "Aurora X Pro 256GB",
    description: "<p>Man hinh OLED 6.7 inch, camera 48MP, chip cao cap va pin dung thoai mai ca ngay.</p>",
    price: 1099,
    discountPercentage: 12,
    stock: 28,
    thumbnail: "/image/products/phone-aurora-pro.svg",
    featured: "1",
    status: "active",
    position: 106,
    deleted: false,
  },
  {
    title: "Silver Mini S 128GB",
    description: "<p>Thiet ke gon nhe, hieu nang muot, phu hop cho nguoi thich dien thoai nho va sang.</p>",
    price: 699,
    discountPercentage: 10,
    stock: 36,
    thumbnail: "/image/products/phone-silver-mini.svg",
    featured: "1",
    status: "active",
    position: 105,
    deleted: false,
  },
  {
    title: "Cobalt Gaming Z 512GB",
    description: "<p>Man hinh tan so quet cao, tan nhiet tot, pin lon va bo nho rong cho game nang.</p>",
    price: 899,
    discountPercentage: 15,
    stock: 18,
    thumbnail: "/image/products/phone-cobalt-gaming.svg",
    featured: "1",
    status: "active",
    position: 104,
    deleted: false,
  },
  {
    title: "Blush Lite 5G 128GB",
    description: "<p>Mau sac tre trung, camera dep, ket noi 5G va muc gia de tiep can.</p>",
    price: 399,
    discountPercentage: 8,
    stock: 42,
    thumbnail: "/image/products/phone-blush-lite.svg",
    featured: "0",
    status: "active",
    position: 103,
    deleted: false,
  },
  {
    title: "Fold Edge Duo 256GB",
    description: "<p>Thiet ke gap mo linh hoat, khong gian hien thi rong hon cho lam viec va giai tri.</p>",
    price: 1299,
    discountPercentage: 14,
    stock: 12,
    thumbnail: "/image/products/phone-fold-edge.svg",
    featured: "0",
    status: "active",
    position: 102,
    deleted: false,
  },
  {
    title: "Power Max Green 256GB",
    description: "<p>Pin ben bi, sac nhanh, man hinh lon va hieu nang on dinh cho nhu cau hang ngay.</p>",
    price: 549,
    discountPercentage: 11,
    stock: 31,
    thumbnail: "/image/products/phone-power-max.svg",
    featured: "0",
    status: "active",
    position: 101,
    deleted: false,
  },
];

const seed = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URL);

  const category = await ProductCategory.findOneAndUpdate(
    { title: categoryData.title },
    categoryData,
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );

  for (const product of products) {
    await Product.findOneAndUpdate(
      { title: product.title },
      {
        ...product,
        product_category_id: category.id,
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${products.length} phone products in category "${category.title}".`);
};

seed()
  .catch((error) => {
    console.error("Seed phone products failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
