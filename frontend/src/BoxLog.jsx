import Box from "./Component/Box";

const BoxLog = ({ clickDownload, log }) => {
  return (
    <>
      <Box title="LOG ACTIVITY" margin="ml-10">
        <div className="w-full h-2/3 border text-left rounded-xl bg-white overflow-y-auto">
          {log.map((item, index) => (
            <p className="text-sm" key={item}>{`${index + 1}. ${item}`}</p>
          ))}
        </div>
        <button
          className="bg-green-300 rounded-lg p-1 w-full font-bold text-red mt-3 hover:bg-green-400"
          onClick={clickDownload}
        >
          DOWNLOAD
        </button>
      </Box>
    </>
  );
};
export default BoxLog;
