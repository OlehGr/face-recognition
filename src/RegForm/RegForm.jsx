import { FormProvider, useForm } from "react-hook-form";
import Camera from "../Camera/Camera";
import "../assets/style.css"
import Webcam from "react-webcam";
import { useControl } from "../hooks/useControl";
import { useEffect, useRef, useState } from "preact/hooks";
import { isError, useMutation } from "@tanstack/react-query";

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
    const [isAdvanced, setAdvanced] = useState(false)
    const [invalidName, setInvalidName] = useState('')

    const webcamRef = useRef(null)

    useEffect(() => {
        if(!webcamRef.current) return

        let count = 1

        const getScreensshots = setInterval(() => {
            if(!apply) return
            if(count === 6 || uploads >= 6) {
                clearInterval(getScreensshots)
                setAdvanced(true)
            }

            const imageSrc = webcamRef.current.getScreenshot();
            const imgFile = dataURItoBlob(imageSrc)
            
            setUploads(uploads => [...uploads, [imageSrc, imgFile]])
            count+=1
        }, 2000)

        return () => clearInterval(getScreensshots)
    }, [webcamRef, apply])


    const sliderLineRef = useRef(null)

    const {mutate, isLoading, error, isSuccess, isError} = useMutation({
        mutationFn: async (name) => {
            const data = new FormData()
            uploads.forEach((upload, i) => data.append('files', new File([upload[1]], `image_${i}.jpeg`, {type: upload[1].type})))

            return await fetch(`http://127.0.0.1:8000/?user=${name.replace(/\s/g, '_')}`, {
                method: 'POST',
                body: data
            })
        },

        onError: (error, name) => {
            setInvalidName(name)
        }
    })
    console.log(isLoading, isError);
    
    return (
        <>
            
                <main className="main">
                        <form className="container reg-form slider" >
                                <div className="slider-line" ref={sliderLineRef}>
                                    <div className="slide">
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
                                        <button className="next-btn mobile"  onClick={e => {
                                                            e.preventDefault()
                                                            sliderLineRef.current.style.left = "-100vw"

                                                            setApply(true)
                                                        }} disabled={!name}>Далее</button>
                                        
                                    </div>
                                    
                                    
                                        

                                    
                                    <div className="media">
                                        <div className="video-warpper">
                                            <Webcam ref={webcamRef} className={"video" + (!!apply ? ' ' : ' hide')} screenshotFormat="image/jpeg" />

                                            <div className={"uploads" + (!!apply ? '' : ' hide')}>
                                                {
                                                    uploads?.map(([src, file], i) => <div className="uploads__item">
                                                            <img src={src} className="uploads__img" />
                                                        </div>)
                                                }
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                

                        </form>
                        {
                            isAdvanced && <>
                                <div className="advanced-form">
                                    {
                                        isLoading ? <>
                                            <span class="loader"></span>
                                        </> : <>

                                            {
                                                isError ? <>
                                                    <p>К сожалению пользователь с таким именем уже существует, придумайте новое:</p>

                                                    <div className="field" style={{marginBottom: 12}}>
                                                        <input type="text" className="input" placeholder="Ваше Имя" {...nameModel} />
                                                    </div>

                                                    <button onClick={() => mutate(name)} style={{marginBottom: 100}} className="next-btn" disabled={!name || name === invalidName}>Изменить имя</button>

                                                </> : <>
                                                    {
                                                        isSuccess ? <>
                                                            
                                                            <svg className="camera-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <g data-name="6. Camera" id="_6._Camera">
                                                                    <path d="M20,4H17.721l-.316-.949A3,3,0,0,0,14.559,1H9.441A3,3,0,0,0,6.6,3.052L6.279,4H4A4,4,0,0,0,0,8V19a4,4,0,0,0,4,4H20a4,4,0,0,0,4-4V8A4,4,0,0,0,20,4Zm2,15a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H7a1,1,0,0,0,.949-.684l.544-1.632A1,1,0,0,1,9.441,3h5.118a1,1,0,0,1,.948.684l.544,1.632A1,1,0,0,0,17,6h3a2,2,0,0,1,2,2Z"/>
                                                                    <path d="M12,7a6,6,0,1,0,6,6A6.006,6.006,0,0,0,12,7Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,17Z"/>
                                                                </g>
                                                            </svg>

                                                            <p>Отлично, теперь система умеет узнавать вас на камере ;)</p>
                                                        </> : <>
                                                            <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                <g>
                                                                    <path fill="none" d="M0 0h24v24H0z"/>
                                                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z"/>
                                                                </g>
                                                            </svg>

                                                            <p>Все данные успешно собраны</p>
                                                            <button onClick={() => mutate(name)} className="next-btn next-btn--shadow" disabled={!name}>Зарегистрироваться</button>
                                                        </>
                                                    }
                                                </>
                                            }

                                            
                                        </> 
                                    }
                                    
                                </div>
                            </>
                        }
                        
                </main>
                
                
            
        </>
    );
}

export default RegForm;