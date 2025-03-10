const http = require("http");

const server = http.createServer((request, response) => {
    response.setHeader("content-type", "app/json")
    response.statusCode = 200
    response.write(JSON.stringify({msg: "Server is now running"}))
    response.end();
});


server.listen(9096, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Running on 9096")
    }
})