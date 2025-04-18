import multer from "multer";

/*
const storage = multer.memoryStorage(); // memoryStorage() stores files in RAM as a Buffer instead of saving them to disk.
const fileFilter = (req, file, cb) => (null, true); // accept all files

export const upload = multer({ storage, fileFilter});
*/



const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/", "video/", "application/pdf"];
    if(allowedTypes.some(type => file.mimetype.startsWith(type) || file.mimetype == type )) {
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
-----How client and server talks-----
    Step 1: Requesting Data (Client to Server)
    You open your browser and visit a website, or maybe you click a button on a page to upload something, like a photo. Here's what happens:
    Client Side (Browser): You interact with a form, select a file (image, document, etc.), or type some text, and hit "submit".
    FormData: Behind the scenes, the browser creates a FormData object that collects all your form data — both text inputs and media files (like images, videos, or PDFs). FormData is a special object that the browser understands, which holds all this data in a structured format.
    const formData = new FormData(this);
    Sending Data: This data is packaged as a POST request (or GET for fetching text or files) to the server. The file you selected (image/video) and any text you typed will be part of this request, and it will be sent over the internet in a format that the server can understand, even though the internet only communicates with strings (i.e., plain text).
    The key here is that the browser (client-side) converts all types of data (text, images, documents) into a string format that can be transmitted.

    Step 2: The Server’s Role
    Now, your request reaches the server. What happens next?
    Server Side (Backend): The server receives the request. It notices that there's both text (strings) and media (files) within the data.
    Text: The text data (like your name, message, or post content) is sent in a string format. For example:
    { "username": "John", "message": "Hello world!" }
     Media: For images or documents, the data is encoded in a format called multipart/form-data. This is a special type of data encoding that allows both text and files to be sent together in one request. The browser transforms the image or document into a binary stream (a sequence of bytes) before sending it.
     Binary Data: The image, for instance, is not just a string of text. It's binary data (0s and 1s), and the browser sends it in chunks, so the server can reconstruct it into a complete file.
     Processing Data: The server processes this data. If it’s a file upload, it could save it to the disk or even upload it to a third-party service (e.g., Cloudinary, AWS S3).
     The server might handle the text (like saving a user's message to a database) and also work with the media (e.g., upload the image to Cloudinary and get a URL in return).

     Step 3: Server Responds Back (Server to Client)
     Once the server finishes processing your request, it sends back a response to the client. Here’s how it works:
     Text Responses: The server might return a JSON response (which is a string) containing information about the upload status, or any data you requested (like a confirmation message or user data).
        Example of a JSON response:
        { 
  "success": true, 
  "message": "Upload successful", 
  "media_url": "https://cloudinary.com/my_image_url.jpg" 
}
    The client-side (your browser) receives this response as a string (JSON in this case).
    The browser parses the JSON string into a JavaScript object using JSON.parse().
    Media Responses: If the server uploaded your image or document to a service like Cloudinary, it might send back the media URL in the JSON response. This URL is a string, and you can use it to display the image, video, or document on the client-side.
    Example of a media URL:
    { "url": "https://cloudinary.com/my_image_url.jpg" }
     Displaying Media: The client-side (your browser) now uses this URL (which is a string) to load the media and display it. For images, you can set this URL as the src for an <img> tag, or for videos, you can use it in the <video> tag.
     const mediaElement = `<img src="${data.url}" width="200" />`;

     Step 4: The Cycle Continues




     How It Works with String, JSON, and Other Formats
    Text Data: When you send simple text (e.g., a user comment or name), it's sent as a string over HTTP. The server processes this string and can send it back to the client as a string too, usually in a JSON format.

    Media Files: Media files (images, videos, PDFs) are sent as binary data. However, to make it easier for the server to handle, they are often wrapped in an HTTP request as multipart/form-data. This is a special encoding that allows the server to differentiate between text and binary data. The server can then decode the binary and store it in a file system or cloud storage.

    JSON Format: JSON (JavaScript Object Notation) is commonly used because it’s lightweight, human-readable, and can easily be parsed into a JavaScript object on the client-side. It’s also easy to send structured data (like arrays, objects, and other nested data) over the internet in a string format.
*/




































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