const app = require("./app")
const port = 5001;

app.listen(port, () => {
    console.log("Server started on port", port)
})