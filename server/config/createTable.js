const mysql2 = require("../config/db/mySQL");

const createTables = () => {
  const products = `
  CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    shortDescription varchar(255) NOT NULL UNIQUE,
    CategoryID INT NOT NULL,
    main_image longtext,
    release_date DATE,
    status boolean NOT NULL,
    FOREIGN KEY (CategoryID) REFERENCES category (id)
  );`;

  const capacity = `CREATE TABLE IF NOT EXISTS capacity (
    capacity INT PRIMARY KEY
  );`;

  const colors = `CREATE TABLE IF NOT EXISTS colors (
    name varchar(255) PRIMARY KEY
  );`;

  const product_variations = `
  CREATE TABLE IF NOT EXISTS product_variations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    color varchar(255) NOT NULL,
    capacity INT NOT NULL,
    product_id INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (capacity) REFERENCES capacity (capacity),
    FOREIGN KEY (color) REFERENCES colors (name)
  );
  `;
    const product_images = `
    CREATE TABLE IF NOT EXISTS product_images (
      id INT PRIMARY KEY AUTO_INCREMENT,
      product_id INT,
      color varchar(255),
      path longtext,
      FOREIGN KEY (color) REFERENCES colors (name),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
    `;
  const category = `CREATE TABLE IF NOT EXISTS category (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name varchar(255)
  );`;
  const orders = `CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    addressID INT,
    UserID INT,
    deliveryMethod varchar(255),
    paymentMenthod tinyINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    note TEXT,
    paymentData longtext,
    totalAmount NUMERIC(12,2),
    status tinyINT,
    FOREIGN KEY (deliveryMethod) REFERENCES deliveryMethod (name),
    FOREIGN KEY (UserID) REFERENCES users (id),
    FOREIGN KEY (addressID) REFERENCES delivery_address (id)
  );`;
  const deliveryMethod = `CREATE TABLE IF NOT EXISTS deliveryMethod (
    name varchar(255) PRIMARY KEY
  );`;
  const IsvaluedeliveryMethod = `INSERT INTO deliveryMethod (name) VALUES
  ('ngày trong tuần'),
  ('Chủ nhật')
  ON DUPLICATE KEY UPDATE name = name;`;
  const orderDetailsProduct = `CREATE TABLE IF NOT EXISTS orderDetailsProduct (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productID INT,
    quantity INT,
    color varchar(255),
    capacity int,
    totalPrice NUMERIC(12,2),
    orderID int,
    FOREIGN KEY (orderID) REFERENCES orders (id),
    FOREIGN KEY (productID) REFERENCES products (id)
  );
  `;
  const productDetails = `CREATE TABLE IF NOT EXISTS productDetails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantity INT,
    remaining_quantity INT,
    brand varchar(255),
    configuration longtext,
    description longtext,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (brand)  REFERENCES brands (name)
  );`;
  const ProdetailColor = `CREATE TABLE IF NOT EXISTS prodetailColor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    Colorname varchar(255),
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (Colorname) REFERENCES colors (name)
  );`;

  const brands = `CREATE TABLE IF NOT EXISTS brands (
    name varchar(255) PRIMARY KEY
  );`;
  const users = `
    CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    phone varchar(255),
    email varchar(255) UNIQUE,
    permission varchar(50)
  );`;
  const delivery_address = `CREATE TABLE IF NOT EXISTS delivery_address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idUser INT,
    name varchar(255),
    city varchar(255),
    district varchar(255),
    commune varchar(255),
    street varchar(255),
    email varchar(255),
    phone varchar(255),
    setdefault tinyINT,
    FOREIGN KEY (idUser) REFERENCES users (id)
  );`;
  const promotional = `CREATE TABLE IF NOT EXISTS promotional (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    percent_discount FLOAT
  );`;
  const promotional_product = `CREATE TABLE IF NOT EXISTS promotional_product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    promotional_id INT,
    FOREIGN KEY (promotional_id) REFERENCES promotional(id),
    FOREIGN KEY  (product_id) REFERENCES products(id)
  );`;

  const notitications = `CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT null,
    user_id INT NOT NULL, 
    title text NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    type text NOT NULL,  
    is_read BOOLEAN DEFAULT 0
  );`;

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
  mysql2.query(brands, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(colors, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(category, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });

  mysql2.query(products, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(capacity, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(product_variations, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
  mysql2.query(product_images, (error, results, fields) => {
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
  mysql2.query(notitications, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
};
createTables();
