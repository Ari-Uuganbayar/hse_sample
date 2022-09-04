import React from "react";
import { useLocationContext } from "src/contexts/locationContext";
import _ from "lodash";

const Filter = () => {
  const { state, dispatch, type } = useLocationContext();

  return (
    <div className="sm:w-80 p-3 border rounded-md shadow">
      <h1 className="font-semibold">Шүүлтүүр</h1>
      <hr className="my-3" />

      <i className="-tracking-wider text-primary_blue">Байгууллагын төрөл</i>
      <div className="flex flex-col justify-center gap-2 mt-1">
        {_.map(state.listOrgType, (item) => {
          return (
            <div
              key={item.id}
              className={
                "px-3 py-1 font-semibold border rounded-lg cursor-pointer duration-300 " +
                (state.selectedOrgType === item.id
                  ? "bg-primary_blue text-white"
                  : "hover:bg-gray-200")
              }
              onClick={() =>
                dispatch({ type: type.CHANGE_SELECTED_ORG_TYPE, data: item.id })
              }
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Filter);
