import { FormProvider, useForm } from "react-hook-form";
import Camera from "../Camera/Camera";
import "../assets/style.css"
import Webcam from "react-webcam";
import { useControl } from "../hooks/useControl";
import { useEffect, useRef, useState } from "preact/hooks";

function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1]);

    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});
}

const RegForm = () => {
    const [uploads, setUploads] = useState([])
    const [name, setName, nameModel] = useControl()
    const [apply, setApply] = useState(false)

    const webcamRef = useRef(null)

    useEffect(() => {
        if(!webcamRef.current) return

        let count = 1

        const getScreensshots = setInterval(() => {
            if(!apply) return
            if(count === 6) clearInterval(getScreensshots)

            const imageSrc = webcamRef.current.getScreenshot();
            const imgFile = dataURItoBlob(imageSrc)
            setUploads(uploads => [...uploads, [imageSrc, imgFile]])
            count+=1
        }, 1500)

        return () => clearInterval(getScreensshots)
    }, [webcamRef, apply])
    
    return (
        <>
            
                <main className="main">
                        <form className="container reg-form" >
                                <div className="field">
                                    <input type="text" className="input" placeholder="Ваше Имя" {...nameModel} />

                                    {
                                        !!name && <button className="next" onClick={e => {
                                            e.preventDefault()
                                            setApply(true)
                                        }}>
                                            <svg viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M24.391 8.9845L20.3597 13.0574C20.2629 13.1551 20.1477 13.2325 20.0207 13.2854C19.8938 13.3383 19.7576 13.3655 19.6201 13.3655C19.4826 13.3655 19.3465 13.3383 19.2195 13.2854C19.0926 13.2325 18.9774 13.1551 18.8805 13.0574V13.0574C18.6865 12.8622 18.5776 12.5982 18.5776 12.323C18.5776 12.0478 18.6865 11.7838 18.8805 11.5887L22.5889 7.84908H1.34928C1.07302 7.84908 0.808065 7.73934 0.612714 7.54399C0.417364 7.34863 0.307617 7.08368 0.307617 6.80742H0.307617C0.307617 6.53115 0.417364 6.2662 0.612714 6.07085C0.808065 5.8755 1.07302 5.76575 1.34928 5.76575H22.6514L18.8805 2.00533C18.7829 1.9085 18.7054 1.79329 18.6525 1.66635C18.5996 1.53941 18.5724 1.40326 18.5724 1.26575C18.5724 1.12824 18.5996 0.992085 18.6525 0.865148C18.7054 0.738211 18.7829 0.623001 18.8805 0.526165C18.9774 0.428531 19.0926 0.351037 19.2195 0.298153C19.3465 0.245269 19.4826 0.218042 19.6201 0.218042C19.7576 0.218042 19.8938 0.245269 20.0207 0.298153C20.1477 0.351037 20.2629 0.428531 20.3597 0.526165L24.391 4.56783C24.9762 5.15377 25.3049 5.94804 25.3049 6.77617C25.3049 7.60429 24.9762 8.39856 24.391 8.9845V8.9845Z" fill="#414042"/>
                                            </svg>
                                        </button>
                                        
                                    }
                                </div>

                                

                                <Webcam ref={webcamRef} className={"video" + (!!apply ? ' ' : ' hide')} screenshotFormat="image/jpeg" />

                                <div className={"uploads" + (!!apply ? '' : ' hide')}>
                                    {
                                        uploads?.map(([src, file], i) => <img src={src} className="uploads__item" />)
                                    }
                                </div>
                        </form>
                </main>
                
                
            
        </>
    );
}

export default RegForm;