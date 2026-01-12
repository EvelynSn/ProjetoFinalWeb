const app = require("./app");
const sequelize = require("./config/database");
sequelize.sync().then(() => app.listen(3000, () => console.log("API 3000")));
