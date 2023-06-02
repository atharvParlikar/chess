import { useState } from "react"

const Dialog = (props) => {
  const [isDialogVisible, setDialogVisible] = useState(true);

  return (
    <div>
      {
        isDialogVisible && (
          <div className="px-4 py-3 border-2 border-black bg-gray-300 rounded">
            <p>{props.message}</p>
            <div className="flex justify-center">
              <button className="bg-white rounded px-2 mt-2 border-2 border-black" onClick={() => setDialogVisible(false)}>ok</button>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Dialog;
