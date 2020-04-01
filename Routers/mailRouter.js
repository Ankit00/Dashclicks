const {
    fetchTenMails,
    getMailById
} = require('../Controllers/mailController');


exports.getTopTenMails = async (req, res) => {
    try {
        const mails = await fetchTenMails();
        res.status(200).json({
            messages: 'success',
            result: mails.length,
            mails
        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error
        })
    }

}

exports.getMailById = async (req, res) => {
    try {
        const mail = await getMailById(req.params.id);
        res.status(200).json({
            status: "success",
            mail
        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error
        })
    }
};