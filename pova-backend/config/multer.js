import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fspromises} from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosDir = './uploads/images';
const vidoesDir = './uploads/videos'
await fspromises.mkdir(photosDir, { recursive: true });
await fspromises.mkdir(vidoesDir, { recursive: true });

// Defined storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        let parentFolder;
        if (file.mimetype.startsWith('image/')){
            parentFolder = path.join('../', photosDir);
        } else {
            parentFolder = path.join('../', vidoesDir);
        }

        cb(null, path.join(__dirname, parentFolder));
    },
    filename: function(req, file, cb){
        // Append timestamp to avoid filename conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // get the file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // e.g., image-1633029381234.jpg
    }
});

// File filtering to restrict uploads to certain types (e.g images and vidoes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startswith('video')){
        cb(null, true);
    } else {
        cb( new Error('Only images and videos are allowed!'), false);
    }
};

// set the maximum file size (in bytes)
const limits = {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
};

// Intialize the multer middleware with the storage options
const upload = multer({storage, fileFilter, limits});

export default upload;
