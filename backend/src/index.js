const server = require("./app");

const PORT = 5174;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
