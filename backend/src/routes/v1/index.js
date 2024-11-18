const express = require("express");
const multer = require("multer");
const router = express.Router();
const File = require('../../model/userModel')
const path = require("path")
const {v4: uuid4} = require('uuid');
const { APP_BASE_URL } = require("../../config/config");



let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    } 
})

let upload = multer({
    storage,
    limit: {fileSize: 1000000 * 100}
}).single('myfile')

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({
            uuid: req.params.uuid
        })
        if(!file) {
            return res.render("download", { error: "Link has been expired."});
        }
        return res.render('download',{
            uuid: file.uuid, 
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/api/v1/download/${file.uuid}`
        })
    } catch (error) {
        return res.render('download', {error: "Something went wrong"});
    }
    
});

router.get('/download/:uuid', async (req, res) => {
   
        const file = await File.findOne({
            uuid: req.params.uuid
        })
        if(!file) {
            return res.render("download", { error: "Link has been expired."});
        }

        const filePath = `${__dirname}/../../${file.path}`
        console.log(filePath)
        res.download(filePath)

        
    
});

router.post('/',(req,res)=> {
    try {
        

        upload(req, res, async (err) => {

            if(!req.file) {
                console.log(req)
                return res.status(201).json({
                     error: 'All fields are required'
                })
            }

            if(err) {
                return res.status(500).json({
                    error: err.message
                })
            }

            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            })

            const response = await file.save();
            return res.json({
                //download link
                //file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
                file: response.uuid
            })
        })
    } catch (error) {
        
    }
    
})
router.post('/send', async (req, res) => {
    console.log(req.body);
    const { uuid, emailTo, emailFrom } = req.body;

    // Validate input fields
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(400).send({
            error: "All fields are required!",
        });
    }

    // Find the file by uuid
    const file = await File.findOne({
        uuid,
    });

    if (!file) {
        return res.status(404).send({
            error: "File not found",
        });
    }

    // Update file details
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    // Prepare and send the email
    const sendEmail = require('../../services/mailService');
    try {
        // Send email with the correct "from" and "to"
        await sendEmail({
            from: emailFrom,  // This is the sender's email address
            to: emailTo,      // This is the recipient's email address
            subject: 'Inshare file Sharing',
            text: `${emailFrom} shared a file with you.`,
            html: require('../../services/emailTemplate')({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/api/v1/download/${file.uuid}`,
                size: parseInt(file.size / 1000) + 'KB',
                expires: "24 hours",
            }),
        });

        // Send success response
        return res.status(200).send("Mail Sent");
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({
            error: "Failed to send email. Please try again.",
        });
    }
});



module.exports = {router};