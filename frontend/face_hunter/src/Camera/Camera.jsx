import { useCallback, useRef, useState } from "preact/hooks";
import Webcam from "react-webcam";





const Camera = () => {
    const [uploads, setUploads] = useState([])

    const webcamRef = useRef(null);
    const capture = useCallback(
        () => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(dataURItoBlob(imageSrc));
        setUploads(uploads => [...uploads, imageSrc])
        },
        [webcamRef]
    );

    return (
        <>
            
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            <button onClick={capture}>Скрин</button>

            {
                uploads.map((upload, i) => <img style={{width: 200, height: 'auto', display: 'block'}} key={i} src={upload} />)
            }
        </>
    );
}

export default Camera;