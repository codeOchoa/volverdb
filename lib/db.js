import Datastore from "nedb-promises";
import path from "path";

const dataPath = "./models";

export const usersDB = Datastore.create({
    filename: path.join(dataPath, "users.db"),
    autoload: true,
});

export const productsDB = Datastore.create({
    filename: path.join(dataPath, "products.db"),
    autoload: true,
});

export const salesDB = Datastore.create({
    filename: path.join(dataPath, "sales.db"),
    autoload: true,
});

export const cashDB = Datastore.create({
    filename: path.join(dataPath, "cash.db"),
    autoload: true,
});