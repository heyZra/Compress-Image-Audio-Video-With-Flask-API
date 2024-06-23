import Box from "./Component/Box";

const BoxAlgorithm = (props) => {
  const { mode, clickAlgorithm } = props;
  const listAlgorithmImage = [
    "1. Algorithm Using CSS",
    "2. Algorithm JPEG Compression",
  ];
  const listAlgorithmAudio = [
    "1. Algorithm Using JS (.mp3)",
    "2. Algorithm Downsampling (.mp3)",
  ];
  const listAlgorithmVideo = [
    "1. Algorithm AAC (.m4a)",
    "2. Algorithm Codec H.264 (.mp4)",
  ];

  const renderAlgorithms = (algorithmList) => {
    return algorithmList.map((item) => (
      <div
        key={item}
        className="w-full h-12 p-2 content-center my-2 bg-blue-300 font-semibold text-sm rounded-full hover:bg-blue-400 cursor-pointer"
        onClick={() => clickAlgorithm(item)}
      >
        {item}
      </div>
    ));
  };

  return (
    <Box title="SELECT ALGORITHM" margin="mr-10">
      <div className="mt-3">
        {mode === "Image" && renderAlgorithms(listAlgorithmImage)}
        {mode === "Audio" && renderAlgorithms(listAlgorithmAudio)}
        {mode === "Video" && renderAlgorithms(listAlgorithmVideo)}
      </div>
    </Box>
  );
};

export default BoxAlgorithm;
