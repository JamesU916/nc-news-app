exports.handlePsqlErrors = (error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ msg: "400 Bad Request"});
    }
    next(error);
}

exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status) {
        response.status(error.status).send({ msg: error.msg });
    }
    next(error);
}

exports.handleServerErrors = (error, request, response, next) => {
    console.error(error);
    response.status(500).send({msg: "500 Internal Server Error"})
}