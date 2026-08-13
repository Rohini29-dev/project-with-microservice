const ImageKit = require('@imagekit/nodejs')
const { v4: uuid } = require('uuid');



async function uploadFile({fileName,folder= "/products" ,buffer}) {
    try {
        
        console.log("📤 Uploading to ImageKit...");
        // console.log("File:", fileName);
        // console.log("Size:", buffer.length);
    const client = new ImageKit({
        privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], 
    });
    
    const response = await client.files.upload({
        file:buffer.toString('base64'),
        fileName: uuid(),
        folder
    });
    
    
    return response 
    
} catch (error) {
    console.error("❌ Upload error:", error.message);
    throw error;
}
}


module.exports = {uploadFile}