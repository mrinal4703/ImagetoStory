import React, {useEffect, useRef, useState} from "react";
import {BallTriangle} from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="loader-container justify-between align-center items-center mt-4 text-blue-950 font-bold">
            <BallTriangle
                height={50}
                width={50}
                radius={5}
                color="#172554"
                ariaLabel="ball-triangle-loading"
                className={'font-bold'}
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
};
export const ImageCaption = () => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const uploadInputRef = useRef(null);
    const textareaRef = useRef(null);
    const [wordCount, setWordCount] = useState(100);
    const [storyType, setStoryType] = useState('caption');
    const [includeTitle, setIncludeTitle] = useState(false);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [caption]);
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);

        const file = uploadInputRef.current.files[0];
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer sk-06832a66a3c647dd8759b2726b670205");

        const formdata = new FormData();
        formdata.append("images", file, file.name);
        formdata.append("output_type", "text");
        formdata.append("stream_data", "false");

        let question = `Generate a ${storyType}`;
        if (storyType === 'story' && includeTitle) {
            question += ' with a title';
        }
        question += ` with ${wordCount} words.`;
        formdata.append("question", question);

        const options = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://api.worqhat.com/api/ai/images/v2/image-analysis", options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            console.log(responseData.content);
            setCaption(responseData.content.replace(/^"|"$/g, ''));
        } catch (error) {
            console.error('Error occurred:', error);
            setStatus('Error occurred during upload or analysis');
        } finally {
            setLoading(false); // Set loading status to false when fetch is complete
        }
    };

    return (
        <>
            <div className="relative bg-white w-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div
                        className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <a href="#">
                                <span className="sr-only">Workflow</span>
                                <img
                                    className="h-8 w-auto sm:h-10"
                                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                    alt=""
                                />
                            </a>
                            <h1 className="text-blue-950 mx-3 text-2xl">Image to Description as a Caption</h1>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <div className={"flex flex-col items-center justify-center"}>
                <form onSubmit={handleSubmit}
                      className="shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] bg-gray-50 p-10 flex flex-col items-center justify-center w-1/2">
                    <p className={'text-lg'}><b>Upload your Image</b></p><br/>
                    <label htmlFor="dropzone-file"
                           className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX.
                                800x400px)</p>
                        </div>
                        <input ref={uploadInputRef} id="dropzone-file" type="file" className="hidden" accept="image/*"
                               required/>
                    </label><br/>

                    <div className="flex flex-col items-start w-full mb-4">
                        <label htmlFor="wordCount" className="mb-2 text-md text-gray-700">Word Count</label>
                        <input type="range" id="wordCount" min="6" max="1000" step="1" value={wordCount}
                               onChange={(e) => setWordCount(e.target.value)} className="w-full" required/>
                        <span className="text-gray-700">{wordCount} words</span>
                    </div>

                    {!loading && (
                        <>
                            <div className="flex flex-col items-start w-full mb-4">
                                <label className="mb-2 text-md text-gray-700">Type</label>
                                <div className="flex items-center">
                                    <input type="radio" id="caption" name="type" value="caption"
                                           checked={storyType === 'caption'} onChange={() => setStoryType('caption')}
                                           className="mr-2"/>
                                    <label htmlFor="caption" className="mr-4 text-gray-700">Caption</label>
                                    <input type="radio" id="description" name="type" value="description"
                                           checked={storyType === 'description'}
                                           onChange={() => setStoryType('description')}
                                           className="mr-2"/>
                                    <label htmlFor="description" className="mr-4 text-gray-700">Description</label>
                                    <input type="radio" id="story" name="type" value="story"
                                           checked={storyType === 'story'}
                                           onChange={() => setStoryType('story')} className="mr-2"/>
                                    <label htmlFor="story" className="text-gray-700">Story</label>
                                </div>
                            </div>

                            {storyType === 'story' && (
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="includeTitle" checked={includeTitle}
                                           onChange={() => setIncludeTitle(!includeTitle)} className="mr-2"/>
                                    <label htmlFor="includeTitle" className="text-gray-700">Include Title</label>
                                </div>
                            )}
                        </>
                    )}

                    <button type="submit"
                            className="bg-blue-600 hover:bg-orange-500 py-3 px-8 rounded-full text-orange-100 transition duration-500">Create
                    </button>
                    {loading && <Loader/>}
                    {status !== '' && <p>{status}</p>}

                    <div
                        className="mt-6 w-full grid text-sm after:px-3.5 after:py-2.5 [&>textarea]:text-inherit after:text-inherit [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:[grid-area:1/1/2/2] after:[grid-area:1/1/2/2] after:whitespace-pre-wrap after:invisible after:content-[attr(data-cloned-val)_'_'] after:border">
                        <textarea
                            readOnly
                            ref={textareaRef}
                            className="w-full h-full text-slate-600 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded px-3.5 py-2.5 outline-none focus:bg-white focus:border-blue-600 focus:ring-2"
                            name="message"
                            id="message"
                            rows="2"
                            placeholder="The generated caption will appear here..."
                            required
                            value={caption}
                        ></textarea>
                    </div>
                </form>
                <br/>
            </div>
        </>
    );
}