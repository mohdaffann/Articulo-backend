import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = process.env.NODE_ENV === 'production' ? '/tmp' : './uploads'
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const upload = multer({ storage: storage })

