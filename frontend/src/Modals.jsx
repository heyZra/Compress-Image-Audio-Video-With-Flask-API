const Modals = (props) => {
  const { isOpen, onClose, children } = props;
  if (!isOpen) return null;
  return (
    <>
      <div
        className="w-full absolute flex justify-center text-center items-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm z-10"
        onClick={onClose}
        style={{ height: "100vh" }}
      >
        <div
          className="max-w-xs w-full h-fit bg-white p-3 rounded-xl flex flex-col"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Modals;
