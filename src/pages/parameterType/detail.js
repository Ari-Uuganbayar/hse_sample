import React from "react";
import { useParameterTypeContext } from "src/contexts/parameterTypeContext";
import * as API from "src/api/request";

import { Input } from "antd";
import Swal from "sweetalert2";

const Detail = () => {
  const { state, dispatch, type } = useParameterTypeContext();

  const save = () => {
    var error = "";
    if (state.detail.name === null) error += "Үзүүлэлтийн төрөл <br/>";

    if (error !== "") {
      Swal.fire({
        icon: "warning",
        title: "<b class='text-red-400'>*</b> талбарыг бөглөнө үү.",
        html: error,
      });
    } else {
      var data = {
        typename: state.detail.name,
      };

      if (state.detail.id === null) {
        API.postParameterType(data).then(() => {
          dispatch({ type: type.CHANGE_REFRESH });
          dispatch({ type: type.CHANGE_DETAIL_MODAL, data: false });
          Swal.fire({
            icon: "success",
            title: "Амжилттай хадгалагдлаа.",
            timer: 1000,
          });
        });
      } else {
        API.putParameterType(state.detail.id, data).then(() => {
          dispatch({ type: type.CHANGE_REFRESH });
          dispatch({ type: type.CHANGE_DETAIL_MODAL, data: false });
          Swal.fire({
            icon: "success",
            title: "Амжилттай хадгалагдлаа.",
            timer: 1000,
          });
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">
          Үзүүлэлтийн төрөл:<b className="ml-1 text-red-500">*</b>
        </span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            placeholder="Үзүүлэлтийн төрөл"
            value={state.detail.name}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_NAME,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <button
        className="w-full py-2 bg-primary_blue hover:bg-opacity-80 text-white font-semibold text-xs border rounded-md shadow duration-300"
        onClick={() => save()}
      >
        Хадгалах
      </button>
    </div>
  );
};

export default React.memo(Detail);
