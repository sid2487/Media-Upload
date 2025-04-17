import multer from "multer";

/*
const storage = multer.memoryStorage(); // memoryStorage() stores files in RAM as a Buffer instead of saving them to disk.
const fileFilter = (req, file, cb) => (null, true); // accept all files

export const upload = multer({ storage, fileFilter});
*/



const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTyped = ["image/", "video/", "application/pdf"];
    if(allowedTyped.some(type => file.mimetype.startswith(type) || file.mimetype == type )) {
        cb(null, true);
    } else{
        cb(new Error("Olny image, videos and pdf files are allowed!"), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // max size 20MB file
    }
});


// Note: Use .startsWith() for groups like "image/", and use === for exact matches like "application/pdf".









































/*
🧠 How Client and Server Communicate(over network):

✅ Ultimately, all data(JSON, images, files) is converted into byte streams.
✅ These byte streams are interpreted as strings or binary based on headers.

📦 JSON / Text Data
    - Sent as: stringified JSON(via application / json)
        - Network sees: string(UTF - 8 encoded)
            - Server parses: back to object(via express.json())

🖼️ Files / Media
    - Sent as: binary + boundaries(via multipart / form - data)
        - Network sees: string - based format with binary parts
            - Server parses: using Multer (gets req.file or buffer)

🛜 HTTP = Text - based protocol
    - Everything is sent as bytes (1s and dyuiop 0s)
- Interpreted as strings or buffers depending on Content - Type

🔑 Rule of Thumb:
> Data on the internet is ** always just bytes **, which often represent ** strings **
> So yes — "client & server talk in strings" is mostly true at the wire level.
*/  