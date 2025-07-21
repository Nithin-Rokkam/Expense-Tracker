const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s+/g, '-'); // Replace spaces with underscores
        cb(null, `${timestamp}-${originalName}`);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false);
    }
};

// Optional: limit file size to 5MB
const limits = {
    fileSize: 5 * 1024 * 1024, // 5 MB
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
