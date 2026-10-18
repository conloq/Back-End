import multer from "multer";

const storage = multer.memoryStorage();

const typesImgage = /jpeg|jpg|png/;

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (file, cb) => {
        const isValidType = typesImgage.test(file.mimetype);

        if(isValidType) return cb(null, true);
        return cb(new Error("Only JPEG, JPG and PNG are true!"))
    }
})

export default upload;