const Notification = ({message}) => {
  return (
    <div className="border-2 border-black p-6 rounded-md bg-gray-300 text-bold font-mono z-10 fixed top-6 right-6 ">
      {message}
    </div>
  );
}

export default Notification;
