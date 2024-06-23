const ChooseMode = (props) => {
  const { name, onClick } = props;
  return (
    <>
      <div
        className="font-bold relative cursor-pointer group"
        onClick={onClick}
      >
        {name}
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 ease-in-out group-hover:w-full group-focus:w-full"></span>
      </div>
    </>
  );
};
export default ChooseMode;
