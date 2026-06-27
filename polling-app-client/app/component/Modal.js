import React from "react";

function Modal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">End Voting</h2>
        <p className="text-sm text-gray-400 mb-4">
          Enter your poll password to close voting permanently.
        </p>
        <input
          type="password"
          value={closePassword}
          onChange={(e) => setClosePassword(e.target.value)}
          placeholder="Enter password"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
        />
        {closeError && (
          <p className="text-xs text-red-500 mb-3">{closeError}</p>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              setShowModal(false);
              setCloseError("");
              setClosePassword("");
            }}
            className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleClose}
            disabled={closing}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {closing ? "Closing..." : "End Voting"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
