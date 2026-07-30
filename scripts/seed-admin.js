const path = require("path");
const mongoose = require("mongoose");
const md5 = require("md5");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Account = require("../models/account.model");
const Role = require("../models/role.model");
const generate = require("../helpers/generate");

const adminPermissions = [
  "products-category_view",
  "products-category_create",
  "products-category_edit",
  "products-category_delete",
  "products_view",
  "products_create",
  "products_edit",
  "products_delete",
  "roles_view",
  "roles_create",
  "roles_edit",
  "roles_delete",
  "roles_permission",
  "accounts_view",
  "accounts_create",
  "accounts_edit",
  "accounts_delete",
  "users_view",
  "users_create",
  "users_edit",
  "users_delete",
  "settings-general_view",
  "settings-general_edit",
];

const adminAccount = {
  fullName: "Admin",
  email: "admin@gmail.com",
  password: "123456",
  phone: "",
  avatar: "",
  status: "active",
  deleted: false,
};

const seed = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URL);

  const role = await Role.findOneAndUpdate(
    { title: "Admin" },
    {
      title: "Admin",
      description: "Quyen quan tri he thong",
      permissions: adminPermissions,
      deleted: false,
      $unset: { deletedAt: "" },
    },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
  );

  await Account.findOneAndUpdate(
    { email: adminAccount.email },
    {
      ...adminAccount,
      password: md5(adminAccount.password),
      role_id: role.id,
      token: generate.generateRandomString(20),
      $unset: { deletedAt: "" },
    },
    { upsert: true, setDefaultsOnInsert: true },
  );

  console.log("Seeded admin role and account.");
  console.log(`Email: ${adminAccount.email}`);
  console.log(`Password: ${adminAccount.password}`);
};

seed()
  .catch((error) => {
    console.error("Seed admin failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
