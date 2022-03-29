function restricted(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        next({
            status: 401,
            message: 'you are not authorized to access this API!',
        });
    }
}

module.exports = {
    restricted,
}