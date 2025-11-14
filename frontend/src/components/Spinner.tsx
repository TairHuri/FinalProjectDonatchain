import { useState } from 'react'
import '../css/Spinner.css'

const Spinner = () => {
    return (
        <div className='spinner-container' >

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