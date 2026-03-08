const db = require("./db");
const bcrypt = require("bcryptjs");

const createTables = async () => {
  try {

    // Drop existing tables to recreate with correct schema
    await db.query(`DROP TABLE IF EXISTS demo_requests`);
    await db.query(`DROP TABLE IF EXISTS brochure_requests`);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        countryCode VARCHAR(10),
        mobile VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        photo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        inquiry VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS demo_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        country_code VARCHAR(10),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS brochure_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        country_code VARCHAR(10),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_profile (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [admins] = await db.query("SELECT * FROM admin_profile WHERE email = ?", ["root@gmail.com"]);
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash("root", 10);
      await db.query(
        "INSERT INTO admin_profile (name, email, password) VALUES (?, ?, ?)",
        ["Root Admin", "root@gmail.com", hashedPassword]
      );
      console.log("✅ Admin user created: root@gmail.com / root");
    }

    console.log("✅ All tables created successfully!");

  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
  }
};

module.exports = createTables;