import { CloudUploadOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import Modals from "./Modals";
import ResizeImage from "./Menu/ResizeImage";
import CompressImage from "./Menu/CompressImage";
import RotateImage from "./Menu/RotateImage";
import CompressAudio from "./Menu/CompressAudio";
import handleImages from "./utils/handleImages";
import BoxLog from "./BoxLog";
import handleCompressAudio from "./utils/handleCompressAudio";
import BoxAlgorithm from "./BoxAlgorithm";
import Chart from "./Component/Chart";
import ChooseMode from "./Component/ChooseMode";
import CompressWithApi from "./Menu/CompressWithApi";

const App = () => {
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(null);
  const [algorithm, setAlgorithm] = useState("1. Algorithm Using CSS"); //default algoImage1
  const [widthImage, setWidthImage] = useState(null);
  const [heightImage, setHeightImage] = useState(null);
  const [isImageMode, setIsImageMode] = useState(true); //default mode Image
  const [isMusicMode, setIsMusicMode] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [fileSrc, setFileSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [music, setMusic] = useState(null);
  const [video, setVideo] = useState(null);
  const [quality, setQuality] = useState(100); //default 100%
  const [rotate, setRotate] = useState(0); //default 0 derajat
  const [percentageAudio, setPercentageAudio] = useState(100); //default 100%
  const [logArray] = useState([]);
  const uploadRef = useRef(null);
  const [chooseMenu, setChooseMenu] = useState(null);
  const [responseApi, setResponseApi] = useState({});

  useEffect(() => {
    const clickHandler = (event) => {
      const file = event.target.files[0];
      if (isImageMode) {
        if (!image && !imageBlob) {
          // for image
          const img = new Image();
          img.src = URL.createObjectURL(file);
          setFileSrc(URL.createObjectURL(file));
          img.onload = () => {
            setWidthImage(img.naturalWidth);
            setHeightImage(img.naturalHeight);
          };
          setImageBlob(img);
          setImage(file);
          console.log("set image");
          console.log(file);
        } else {
          console.log("error, not file found");
        }
      } else if (isMusicMode) {
        setMusic(file);
        setFileSrc(true);
        console.log("set music");
        console.log(file);
      } else {
        setVideo(file);
        setFileSrc(true);
        console.log("set video");
        console.log(file);
      }
      console.log("succed click upload");
    };

    if (uploadRef.current) {
      uploadRef.current.addEventListener("change", clickHandler);
    }

    return () => {
      if (uploadRef.current) {
        uploadRef.current.removeEventListener("change", clickHandler);
      }
    };
  }, [
    image,
    music,
    video,
    quality,
    rotate,
    logArray,
    isMusicMode,
    percentageAudio,
    imageBlob,
  ]);

  const handleBoxClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const reset = () => {
    //reset all
    setFileSrc(null);
    setHeightImage(null);
    setWidthImage(null);
    setImage(null);
    setMusic(null);
    setMenu(null);
    setImageBlob(null);
    setQuality(100);
    setRotate(0);
    setPercentageAudio(100);
    setResponseApi({});
    console.log("clear");
  };

  const toggleMode = (mode) => {
    if (mode === "Image") {
      setAlgorithm("1. Algorithm Using CSS"); // default algo 1
      setIsImageMode(true);
      setIsMusicMode(false);
      setIsVideoMode(false);
      console.log("mode: ", mode);
    } else if (mode === "Audio") {
      setAlgorithm("1. Algorithm Using JS (.mp3)"); // default algo 1
      setIsMusicMode(true);
      setIsImageMode(false);
      setIsVideoMode(false);
      console.log("mode: ", mode);
    } else {
      setAlgorithm("1. Algorithm AAC (.m4a)"); // default algo 1
      setIsVideoMode(true);
      setIsImageMode(false);
      setIsMusicMode(false);
      console.log("mode: ", mode);
    }
    reset();
  };

  const handleClose = () => {
    setModal(false);
  };
  const handleMenu = (menu) => {
    setMenu(menu);
    setModal(true);
  };
  const handleAlgorithm = (algorithm) => {
    setAlgorithm(algorithm);
    console.log(algorithm);
  };
  const handleSaveWidthHeight = (width, height, log) => {
    setWidthImage(width);
    setHeightImage(height);
    logArray.push(log);
    console.log(widthImage, heightImage, "app");
  };
  const handleSavedQuality = (quality, log) => {
    setQuality(quality);
    logArray.push(log);
    console.log(quality);
  };
  const handleSavedRotate = (deg, log) => {
    logArray.push(log);
    setRotate(deg);
    console.log(rotate);
  };
  const handleSavedPercentageAudio = (percentage, log) => {
    logArray.push(log);
    setPercentageAudio(percentage);
    console.log(percentage);
  };
  const handleResponseApi = async (response, log) => {
    logArray.push(log);
    setResponseApi(response);
    // console.log(response);
    // console.log(responseApi);
  };
  useEffect(() => {
    console.log(responseApi); // Log nilai responseApi yang diperbarui
  }, [responseApi]);

  const handleDownload = async (dataApi) => {
    for (let i = 0; i < dataApi.url.length; i++) {
      const response = await fetch("http://localhost:5000" + dataApi.url[i]);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = dataApi.compressedName[i] || `file_${i}`; // Fallback to default names if compressedName is not available
      link.click();

      // Delay for a moment to ensure the download completes
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }
    console.log("download file from responseApi");
  };

  const clickDownload = () => {
    if (imageBlob !== null && imageBlob !== undefined) {
      if (algorithm === "1. Algorithm Using CSS") {
        handleImages(imageBlob, widthImage, heightImage, quality, rotate);
      } else {
        handleDownload(responseApi);
      }
      console.log("download image");
    } else if (music !== null && music !== undefined) {
      if (algorithm === "1. Algorithm Using JS (.mp3)") {
        handleCompressAudio({ music, percentageAudio });
      } else {
        handleDownload(responseApi);
      }
      console.log("download music");
    } else if (video !== null && video !== undefined) {
      handleDownload(responseApi);
      console.log("download video");
    } else {
      setModal(true);
      <Modals isOpen={modal} onClose={handleClose}>
        <h1>Choose File First</h1>
      </Modals>;
    }
  };

  useEffect(() => {
    if (isImageMode) {
      if (algorithm === "1. Algorithm Using CSS")
        setChooseMenu(
          <>
            <h1
              className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
              onClick={() => handleMenu("resize")}
            >
              Resize
            </h1>
            <h1
              className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
              onClick={() => handleMenu("compress")}
            >
              Compress
            </h1>
            <h1
              className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
              onClick={() => handleMenu("rotate")}
            >
              Rotate
            </h1>
          </>
        );
      else {
        setChooseMenu(
          <h1
            className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
            onClick={() => handleMenu("request-api")}
          >
            Compress Algorithm 2
          </h1>
        );
      }
    } else if (isMusicMode) {
      if (algorithm === "1. Algorithm Using JS (.mp3)") {
        setChooseMenu(
          <h1
            className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
            onClick={() => handleMenu("compress-audio")}
          >
            Compress Algorithm 1
          </h1>
        );
      } else {
        setChooseMenu(
          <h1
            className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
            onClick={() => handleMenu("request-api")}
          >
            Compress Algorithm 2
          </h1>
        );
      }
    } else {
      if (algorithm === "1. Algorithm AAC (.m4a)") {
        setChooseMenu(
          <h1
            className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
            onClick={() => handleMenu("request-api")}
          >
            Compress Algorithm 1
          </h1>
        );
      } else {
        setChooseMenu(
          <h1
            className="font-bold cursor-pointer hover:text-xl transition-all duration-300"
            onClick={() => handleMenu("request-api")}
          >
            Compress Algorithm 2
          </h1>
        );
      }
    }
  }, [isImageMode, isMusicMode, isVideoMode, algorithm]);

  return (
    <>
      <div className="w-full h-96 flex justify-center">
        <div className="h-full content-center">
          {isImageMode ? (
            <BoxAlgorithm mode="Image" clickAlgorithm={handleAlgorithm} />
          ) : isMusicMode ? (
            <BoxAlgorithm mode="Audio" clickAlgorithm={handleAlgorithm} />
          ) : (
            <BoxAlgorithm mode="Video" clickAlgorithm={handleAlgorithm} />
          )}
        </div>
        <div className="content-center">
          <div className="flex gap-5 mb-3">
            <ChooseMode name="Image" onClick={() => toggleMode("Image")} />
            <ChooseMode name="Audio" onClick={() => toggleMode("Audio")} />
            <ChooseMode name="Video" onClick={() => toggleMode("Video")} />
          </div>
          <div
            className="max-w-lg w-screen h-64 bg-white border rounded-xl shadow-xl text-center content-center cursor-pointer"
            onClick={handleBoxClick}
          >
            {fileSrc ? (
              isImageMode ? (
                <div className="h-full w-full flex p-2 flex justify-center">
                  <img
                    src={fileSrc}
                    alt="uploaded"
                    className={`max-w-full max-h-full  p-5 transform rotate-[${rotate}deg]`}
                  ></img>
                </div>
              ) : isMusicMode ? (
                <div className="h-full w-full flex p-2 justify-center items-center">
                  <h1 className="font-bold text-sm">
                    {music ? music.name : ""}
                  </h1>
                </div>
              ) : (
                <div className="h-full w-full flex p-2 justify-center items-center">
                  <h1 className="font-bold text-sm">
                    {video ? video.name : ""}
                  </h1>
                </div>
              )
            ) : (
              <>
                <input
                  type="file"
                  ref={uploadRef}
                  accept={
                    isImageMode
                      ? "image/jpg, image/jpeg, image/png"
                      : isMusicMode
                      ? "audio/mp3"
                      : "video/mp4, video/m4a"
                  }
                  className="hidden"
                />
                <CloudUploadOutlined style={{ fontSize: 90 }} />
                <h1 className="text-xl font-bold">
                  Choose{" "}
                  <span className="underline underline-offset-4">
                    {isImageMode ? "Image" : isMusicMode ? "Audio" : "Video"}
                  </span>{" "}
                  File to Upload
                </h1>
              </>
            )}
          </div>
          <div className="mt-5 flex gap-5 justify-center">{chooseMenu}</div>
        </div>
        <div className="h-full content-center">
          <BoxLog
            clickDownload={clickDownload}
            log={logArray}
            dataApi={responseApi}
          />
        </div>
        <Modals isOpen={modal} onClose={handleClose}>
          {imageBlob && isImageMode && (
            <>
              {algorithm === "1. Algorithm Using CSS" && (
                <>
                  {menu === "resize" && (
                    <ResizeImage
                      height={heightImage}
                      width={widthImage}
                      onClose={handleClose}
                      image={imageBlob}
                      saveToParent={handleSaveWidthHeight}
                    />
                  )}
                  {menu === "compress" && (
                    <CompressImage
                      qualityParent={quality}
                      onClose={handleClose}
                      saveToParent={handleSavedQuality}
                      dataResponse={handleResponseApi}
                      image={image}
                    />
                  )}
                  {menu === "rotate" && (
                    <RotateImage
                      parentRotate={rotate}
                      onClose={handleClose}
                      saveToParent={handleSavedRotate}
                    />
                  )}
                </>
              )}
              {algorithm === "2. Algorithm JPEG Compression" &&
                menu === "request-api" && (
                  <CompressWithApi
                    onClose={handleClose}
                    saveToParent={handleResponseApi}
                    type="image"
                    file={image}
                  />
                )}
            </>
          )}
          {music && isMusicMode && (
            <>
              {algorithm === "1. Algorithm Using JS (.mp3)" && (
                <>
                  {menu === "compress-audio" && (
                    <CompressAudio
                      onClose={handleClose}
                      percentageAudio={percentageAudio}
                      saveToParent={handleSavedPercentageAudio}
                    />
                  )}
                </>
              )}
              {algorithm === "2. Algorithm Downsampling (.mp3)" &&
                menu === "request-api" && (
                  <CompressWithApi
                    onClose={handleClose}
                    saveToParent={handleResponseApi}
                    type="mp3"
                    file={music}
                  />
                )}
            </>
          )}
          {video && isVideoMode && (
            <>
              {algorithm === "1. Algorithm AAC (.m4a)" &&
                menu === "request-api" && (
                  <CompressWithApi
                    onClose={handleClose}
                    saveToParent={handleResponseApi}
                    type="m4a"
                    file={video}
                  />
                )}
              {algorithm === "2. Algorithm Codec H.264 (.mp4)" &&
                menu === "request-api" && (
                  <CompressWithApi
                    onClose={handleClose}
                    saveToParent={handleResponseApi}
                    type="mp4"
                    file={video}
                  />
                )}
            </>
          )}
          {!image && !music && !video && <h1>Choose File First</h1>}
        </Modals>
      </div>
      <div className="flex justify-center gap-3">
        <div className="border-y-4 border-stone-200 w-1/5"></div>
        <div className="border-y-4 border-stone-400 w-4"></div>
        <div className="border-y-4 border-stone-200 w-1/5"></div>
      </div>
      <div className="mt-5 flex justify-center">
        {Object.keys(responseApi).length > 0 && <Chart dataApi={responseApi} />}
      </div>
    </>
  );
};

export default App;
