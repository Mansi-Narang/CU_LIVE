function errorHandler(func){
    return function(req, res){
        try{
            func(req, res);
        }catch(e){
            res.json({ error : e, success : false });
        }
    }
}

module.exports = errorHandler;