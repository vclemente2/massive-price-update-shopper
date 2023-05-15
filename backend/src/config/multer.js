import multer from 'multer'

const upload = multer({ dest: './backend/src/uploads/' })

export default upload
