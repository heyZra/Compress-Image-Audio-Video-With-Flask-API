const Box = (props) => {
  const { title, children, margin } = props;

  return (
    <>
      <div
        className={`max-w-56 w-56 h-64 bg-gray-100 border rounded-xl shadow-xl text-center p-3 block ${margin}`}
      >
        <h1 className="text-sm font-bold">{title}</h1>
        {children}
      </div>
    </>
  );
};
export default Box;
