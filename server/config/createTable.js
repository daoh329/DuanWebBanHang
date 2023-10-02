const mysql2 = require("../config/db/mySQL");

const createTables = () => {
  const product = `
  CREATE TABLE IF NOT EXISTS product (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) UNIQUE,
    price float,
    shortDescription varchar(255),
    CategoryID int,
    status boolean,
    FOREIGN KEY (CategoryID) REFERENCES category (id)
  );
  `;
  const category = `CREATE TABLE IF NOT EXISTS category (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255)
  );
  `;
  const orders = `CREATE TABLE IF NOT EXISTS orders (
    id int PRIMARY KEY AUTO_INCREMENT,
    UserID int,
    deliveryMethod varchar(255),
    paymentMenthod tinyint,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    note TEXT,
    status tinyint,
    FOREIGN KEY (deliveryMethod) REFERENCES deliveryMethod (name),
    FOREIGN KEY (UserID) REFERENCES users (id)
  );
  `;
  const deliveryMethod = `CREATE TABLE IF NOT EXISTS deliveryMethod (
    name varchar(255) PRIMARY KEY
  );`;
  const orderDetailsProduct = `CREATE TABLE IF NOT EXISTS orderDetailsProduct (
    id int PRIMARY KEY AUTO_INCREMENT,
    productID int,
    quantity int,
    orderID int,
    FOREIGN KEY (orderID) REFERENCES orders (id),
    FOREIGN KEY (productID) REFERENCES product (id)
    
  );
  `;
  const productDetails = `CREATE TABLE IF NOT EXISTS productDetails (
    id int PRIMARY KEY AUTO_INCREMENT,
    quantity int,
    brand varchar(255),
    configuration longtext,
    description longtext,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_id int,
    FOREIGN KEY (product_id) REFERENCES product (id),
    FOREIGN KEY (brand)  REFERENCES brand (name)
  );
  `;
  const galery = `CREATE TABLE IF NOT EXISTS galery (
    id int PRIMARY KEY AUTO_INCREMENT,
    thumbnail varchar(255),
    product_id int,
    FOREIGN KEY (product_id) REFERENCES product (id)
  );
  `;
  const ProdetailColor = `CREATE TABLE IF NOT EXISTS ProdetailColor (
    id int PRIMARY KEY AUTO_INCREMENT,
    ProductDetailId int,
    Colorname varchar(255),
    FOREIGN KEY (ProductDetailId) REFERENCES productDetails (id),
    FOREIGN KEY (Colorname) REFERENCES color (name)
  );
  `;
  const color = `CREATE TABLE IF NOT EXISTS color (
    name varchar(255) PRIMARY KEY
  );
  `;
  const brand = `CREATE TABLE IF NOT EXISTS brand (
    name varchar(255) PRIMARY KEY
  );
  `;
  const user = `
    CREATE TABLE IF NOT EXISTS users (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    phone varchar(255),
    address varchar(255),
    email varchar(255) UNIQUE
  );`


  mysql2.query(deliveryMethod, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(user, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(brand, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(color, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(deliveryMethod, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(category, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  
  mysql2.query(product, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(galery, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(productDetails, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(ProdetailColor, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(orders, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(orderDetailsProduct, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
};
createTables();