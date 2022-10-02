import React from "react";

const _404 = () => {
  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-3 bg-white border shadow rounded-md">
      <h3 className="text-3xl font-semibold">404 Хуудас олдсонгүй</h3>
    </div>
  );
};

export default React.memo(_404);
