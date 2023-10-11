const mysql2 = require("../config/db/mySQL");

const createTables = () => {
  const product = `
  CREATE TABLE IF NOT EXISTS product (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) UNIQUE,
    price NUMERIC(10,2),
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
    addressID int,
    UserID int,
    deliveryMethod varchar(255),
    paymentMenthod tinyint,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    note TEXT,
    status tinyint,
    FOREIGN KEY (deliveryMethod) REFERENCES deliveryMethod (name),
    FOREIGN KEY (UserID) REFERENCES users (id),
    FOREIGN KEY (addressID) REFERENCES delivery_address (id)
  );`;
  const deliveryMethod = `CREATE TABLE IF NOT EXISTS deliveryMethod (
    name varchar(255) PRIMARY KEY
  );`;
  const IsvaluedeliveryMethod=`INSERT INTO deliveryMethod (name) VALUES
  ('ngày trong tuần'),
  ('cuối tuần'),
  ('Chủ nhật')
  ON DUPLICATE KEY UPDATE name = name;`;
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
  );`;
  const galery = `CREATE TABLE IF NOT EXISTS galery (
    id int PRIMARY KEY AUTO_INCREMENT,
    thumbnail varchar(255),
    product_id int,
    FOREIGN KEY (product_id) REFERENCES product (id)
  );`;
  const ProdetailColor = `CREATE TABLE IF NOT EXISTS ProdetailColor (
    id int PRIMARY KEY AUTO_INCREMENT,
    product_id int,
    Colorname varchar(255),
    FOREIGN KEY (product_id) REFERENCES product (id),
    FOREIGN KEY (Colorname) REFERENCES color (name)
  );`;
  const color = `CREATE TABLE IF NOT EXISTS color (
    name varchar(255) PRIMARY KEY
  );`;
  const brand = `CREATE TABLE IF NOT EXISTS brand (
    name varchar(255) PRIMARY KEY
  );`;
  const users = `
    CREATE TABLE IF NOT EXISTS users (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    phone varchar(255),
    email varchar(255) UNIQUE
  );`
  const delivery_address =`CREATE TABLE IF NOT EXISTS delivery_address (
    id int PRIMARY KEY AUTO_INCREMENT,
    idUser int,
    name varchar(255),
    city varchar(255),
    district varchar(255),
    commune varchar(255),
    street varchar(255),
    email varchar(255),
    phone varchar(255),
    FOREIGN KEY (idUser) REFERENCES users (id)
  );`
  const promotional =`CREATE TABLE IF NOT EXISTS promotional (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    percent_discount FLOAT
  );`
  const promotional_product=`CREATE TABLE IF NOT EXISTS promotional_product (
    id int PRIMARY KEY AUTO_INCREMENT,
    product_id int,
    promotional_id int,
    FOREIGN KEY (promotional_id) REFERENCES promotional(id),
    FOREIGN KEY  (product_id) REFERENCES product(id)
  );`
  mysql2.query(deliveryMethod, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  // Value trực tiếp vào database
  mysql2.query(IsvaluedeliveryMethod, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(users, (error, results, fields) => {
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
  mysql2.query(delivery_address, (error, results, fields) => {
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
  mysql2.query(promotional, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(promotional_product, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
};
createTables();