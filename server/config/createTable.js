const mysql2 = require("../config/db/mySQL");

const createTables = () => {
  const products = `
  CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(40) NOT NULL,
    shortDescription varchar(160) NOT NULL UNIQUE,
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
    name varchar(15) PRIMARY KEY
  );`;

  const product_variations = `
  CREATE TABLE IF NOT EXISTS product_variations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    color varchar(15) NOT NULL,
    capacity INT NOT NULL,
    product_id INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    quantity_variant INT DEFAULT 1 NOT NULL,
    remaining_quantity_variant INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (capacity) REFERENCES capacity (capacity),
    FOREIGN KEY (color) REFERENCES colors (name)
  );
  `;
  const product_images = `
    CREATE TABLE IF NOT EXISTS product_images (
      id INT PRIMARY KEY AUTO_INCREMENT,
      product_id INT NOT NULL,
      color varchar(15),
      path longtext NOT NULL,
      FOREIGN KEY (color) REFERENCES colors (name),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
    `;
  const category = `CREATE TABLE IF NOT EXISTS category (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name varchar(20) NOT NULL
  );`;
  const orders = `CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    addressID INT NOT NULL,
    UserID INT NOT NULL,
    deliveryMethod varchar(20) NOT NULL,
    paymentMenthod tinyINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    note TEXT,
    paymentData longtext NOT NULL,
    totalAmount NUMERIC(12,2) NOT NULL,
    status tinyINT,
    FOREIGN KEY (deliveryMethod) REFERENCES deliveryMethod (name),
    FOREIGN KEY (UserID) REFERENCES users (id),
    FOREIGN KEY (addressID) REFERENCES delivery_address (id)
  );`;
  const deliveryMethod = `CREATE TABLE IF NOT EXISTS deliveryMethod (
    name varchar(20) PRIMARY KEY
  );`;
  const IsvaluedeliveryMethod = `INSERT INTO deliveryMethod (name) VALUES
  ('ngày trong tuần'),
  ('Chủ nhật')
  ON DUPLICATE KEY UPDATE name = name;`;
  const orderDetailsProduct = `CREATE TABLE IF NOT EXISTS orderDetailsProduct (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productID INT NOT NULL,
    quantity INT NOT NULL,
    color varchar(15),
    capacity int,
    totalPrice NUMERIC(12,2) NOT NULL,
    orderID int NOT NULL,
    FOREIGN KEY (orderID) REFERENCES orders (id),
    FOREIGN KEY (productID) REFERENCES products (id)
  );
  `;
  const productDetails = `CREATE TABLE IF NOT EXISTS productDetails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand varchar(25) NOT NULL,
    configuration longtext,
    description longtext,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (brand)  REFERENCES brands (name)
  );`;
  const ProdetailColor = `CREATE TABLE IF NOT EXISTS prodetailColor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    Colorname varchar(15) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (Colorname) REFERENCES colors (name)
  );`;
  const brands = `CREATE TABLE IF NOT EXISTS brands (
    name varchar(25) PRIMARY KEY
  );`;
  const users = `
    CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    facebookId VARCHAR(25) ,
    googleId VARCHAR(25),
    name varchar(45),
    phone varchar(10),
    email varchar(50),
    permission varchar(10),
    isLocked BOOLEAN DEFAULT FALSE,
    loginAttempts INT DEFAULT 0
  );`;
  const delivery_address = `CREATE TABLE IF NOT EXISTS delivery_address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idUser INT Not Null,
    name varchar(45) Not Null,
    city varchar(35) Not Null,
    district varchar(35) Not Null,
    commune varchar(25) Not Null,
    street varchar(30) Not Null,
    email varchar(50),
    phone varchar(10) Not Null,
    setdefault tinyint,
    FOREIGN KEY (idUser) REFERENCES users (id)
  );`;

  const notitications = `CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT null,
    user_id INT NOT NULL, 
    title text NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    type text NOT NULL,
    is_read BOOLEAN DEFAULT 0
  );`;

  const discount_code = `
    CREATE TABLE IF NOT EXISTS discount_code (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content VARCHAR(255) NOT NULL,
      value_vnd numeric(12,2),
      value_percent numeric(5,2),
      start_date timestamp NOT NULL,
      end_date timestamp NOT NULL
    );
  `;
  const sanpham_discountCode = `
    CREATE TABLE IF NOT EXISTS sanpham_discountCode (
      id INT AUTO_INCREMENT PRIMARY KEY,
      products_id INT NOT NULL,
      discountCode_id INT NOT NULL,
    FOREIGN KEY (discountCode_id) REFERENCES discount_code(id),
    FOREIGN KEY (products_id) REFERENCES products(id)
  );
  `;

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
  mysql2.query(discount_code, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });

  mysql2.query(sanpham_discountCode, (error, results, fields) => {
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
  mysql2.query(notitications, (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  });
};
createTables();
