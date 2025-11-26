import multer from 'multer'
import { v4 } from 'uuid'
import path from 'path'

// Folder where uploaded images will be stored.
// Uses process.cwd() to ensure the path is relative to the project root.
export const imageFolder = path.join(process.cwd(), 'images')
// Folder where uploaded certificate files will be stored.
export const certificateFolder = path.join(process.cwd(), 'certificates')
// Configure Multer storage engine for handling uploaded files.

const storage = multer.diskStorage({
      // Determine destination folder based on the incoming file's field name.
    // "certificate" files are stored separately from regular images.
    destination: (req, file, cb) => {
        if (file.fieldname == 'certificate') {
            cb(null, certificateFolder);
        } else {
            cb(null, imageFolder);
        }
    },
    filename: (req, file, cb) => {
        const arr = file.originalname.split(".");   
        const ext = arr[arr.length - 1]
        cb(null, `${v4()}.${ext}`)
    }
})

const fileUpload = multer({ storage })
export default fileUpload

// Type definition for expected media file structure for campaigns or similar.
// Helps TypeScript validate the shape of uploaded files.
export type MediaFiles = {
    images: Express.Multer.File[];
    newImages?: Express.Multer.File[];
    movie: Express.Multer.File[];
    mainImage: Express.Multer.File[];

}
// Type definition for NGO-related media uploads such as certificates and logos.

export type NgoMediaFiles = {
    certificate: Express.Multer.File[];
    logo: Express.Multer.File[];
}