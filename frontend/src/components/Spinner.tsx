import { useState } from 'react'
import '../css/Spinner.css'

const Spinner = () => {
    return (
        <div style={{alignItems:'center', display:'flex', justifyContent:'center', height:'100%'}}>

            <span className="loader"></span>
        </div>
    )
}

export const useSpinner = () =>{
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const start = () => setIsLoading(true);
    const stop = () => setIsLoading(false);

    return{isLoading, start, stop}
}

export default Spinner;