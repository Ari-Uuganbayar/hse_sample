import React from "react";
import Table from "src/pages/location/table";
import Filter from "src/pages/location/filter";

const Location = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white border rounded-lg shadow">
      <div className="border-b p-3">
        <span className="font-semibold">Байршил цонх</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-3 p-3 text-xs">
        <Filter />
        <Table />
      </div>
    </div>
  );
};

export default React.memo(Location);
