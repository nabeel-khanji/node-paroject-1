module.exports = function serverError(obj = {}) {

    var req = this.req;
    var res = this.res;
    
    if (req.wantsJSON) {

        let errorObj = obj;

        let message = errorObj.message ? errorObj.message : 'Error occurred';

        if (typeof message == 'object') {

            res.status(400).send(customServices.createMsgForClient(message.message, {}));

        } else {

            res.status(400).send(errorObj)
        }


    } else {
        return res.status(500).view('500');
    }

};
