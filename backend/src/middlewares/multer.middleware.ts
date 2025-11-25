import multer from 'multer'
import { v4 } from 'uuid'
import path from 'path'

export const imageFolder = path.join(process.cwd(), 'images')
export const certificateFolder = path.join(process.cwd(), 'certificates')

const storage = multer.diskStorage({
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

export type MediaFiles = {
    images: Express.Multer.File[];
    newImages?: Express.Multer.File[];
    movie: Express.Multer.File[];
    mainImage: Express.Multer.File[];

}

export type NgoMediaFiles = {
    certificate: Express.Multer.File[];
    logo: Express.Multer.File[];
}