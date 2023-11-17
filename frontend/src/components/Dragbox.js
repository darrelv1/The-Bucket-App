import {useState} from 'react';
import React from 'react';
import axios from 'axios'
import {typeOf} from "uri-js/dist/esnext/util";


const Dragbox = ({getPostRes}) => {
    const [entryFile, setEntryFile] = useState(null);


    const handleCSVFile = async()=>{

        const postData = new FormData();



        Array.from(entryFile).forEach((file)=>{
            postData.append(`${file.name}`, file, `${file.name}.csv` )
        })
        // postData.append(entryFile[0].name, entryFile[0])

        // console.log(Array.from(postData))
        try {
            console.log(Array.from(postData)[0])
            const response = await axios.post("http://localhost:8000/account/bills", postData)
        } catch (error){
            // console.log(`TESTING  visual on the formData ${postData}`)
            console.log(`Post request sent to the "URL: http://localhost:8000" did not work! because of the following error${error}`)
        }
        console.log(entryFile.constructor.name)
        console.log(Object.getPrototypeOf(entryFile))
        console.log(typeOf(entryFile) === "filelist")

        getPostRes("http://localhost:8000/account/bills", entryFile)

    }

    const handleDrop = (e) => {

        e.preventDefault()
        setEntryFile(e.dataTransfer.files)

    }

    if (entryFile) {

        return (

            <div><h2>List of what has been uploaded</h2>
                <ul>
                    {
                        Array.from(entryFile).map((fileName, idx) => {
                           return <li key={idx}>{fileName.name}</li>
                        })
                    }
                </ul>
                <button onClick={handleCSVFile}>Load Entry</button>
            </div>

        )
    }


    return (
        <div className="dragbox"
             onDragOver={(e) => {
                 e.preventDefault()
             }}
             onDrop={handleDrop}
        >
            <input
                type="file"
                multiple
                hidden
            >

            </input>
            DRAG BOX - WHAT
        </div>

    )
}

export default Dragbox;