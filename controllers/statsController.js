const db = require("../config/db");

exports.getTrendData = async (req, res) => {
  try {
    const { type } = req.params;

    let dateFilter = "";

    if (type === "week") {
      dateFilter = "WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    } 
    else if (type === "month") {
      dateFilter = "WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    } 
    else if (type === "year") {
      dateFilter = "WHERE YEAR(created_at) = YEAR(CURDATE())";
    } 
    else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    const [registrations] = await db.promise().query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as registrations
      FROM users
      ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    const [inquiries] = await db.promise().query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as inquiries
      FROM inquiries
      ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    const trendData = registrations.map(reg => {
      const match = inquiries.find(inq => 
        new Date(inq.date).getTime() === new Date(reg.date).getTime()
      );

      return {
        name: new Date(reg.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        registrations: reg.registrations,
        inquiries: match ? match.inquiries : 0
      };
    });

    res.json({
      success: true,
      data: trendData
    });

  } catch (error) {
    console.log("Trend Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};