exports.handlePsqlErrors = (error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ msg: "400 Bad Request"});
    } else if (error.code === '23503') {
        response.status(404).send({ msg: "404 Not Found"})
    } else {
    next(error);
    }
}

exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status) {
        response.status(error.status).send({ msg: error.msg });
    } else {
    next(error);
    }
}

exports.handleServerErrors = (error, request, response, next) => {
    console.error(error);
    response.status(500).send({msg: "500 Internal Server Error"})
}