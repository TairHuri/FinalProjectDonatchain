import multer from 'multer'
import {v4 } from 'uuid'

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, 'images/');
    },
    filename:(req, file, cb)=>{        
        const arr = file.originalname.split(".");   // my pic.campaign.jpeg
        const ext = arr[arr.length-1]
        cb(null, `${v4()}.${ext}`)
    }
})

const fileUpload = multer({storage})
export default fileUpload

export type MediaFiles={
  images:Express.Multer.File[];
  movie:Express.Multer.File[];
  mainImage:Express.Multer.File[];
  logo:Express.Multer.File[];
}