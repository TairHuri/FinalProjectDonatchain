import { div } from "framer-motion/client"
import type { ReactNode } from "react"

import '../../css/Modal.css'

const Modal = ({component, show}:{component:ReactNode, show:boolean}) =>{

    if(!show)return null;
    return(
        <div className="modal">
            {component}
        </div>
    )
}

export default Modal