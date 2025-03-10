const app = require("./app");

app.listen(9096, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Running on 9096")
    }
})
