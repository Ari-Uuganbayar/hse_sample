import React from "react";
import { useOrganizationContext } from "src/contexts/organizationContext";
import * as API from "src/api/request";

import { Input } from "antd";
import Swal from "sweetalert2";
const { TextArea } = Input;

const Detail = () => {
  const { state, dispatch, type } = useOrganizationContext();

  const save = () => {
    var error = "";
    if (state.detail.organizationName === null)
      error += "Байгууллагын нэр <br/>";

    if (error !== "") {
      Swal.fire({
        icon: "warning",
        title: "<b class='text-red-400'>*</b> талбарыг бөглөнө үү.",
        html: error,
      });
    } else {
      var data = {
        organizationname: state.detail.organizationName,
        description:
          state.detail.description === null ? "" : state.detail.description,
      };

      if (state.detail.id === null) {
        API.postOrganization(data).then(() => {
          dispatch({ type: type.CHANGE_REFRESH });
          dispatch({ type: type.CHANGE_DETAIL_MODAL, data: false });
          Swal.fire({
            icon: "success",
            title: "Амжилттай хадгалагдлаа.",
            timer: 1000,
          });
        });
      } else {
        API.putOrganization(state.detail.id, data).then(() => {
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
          Байгууллагын нэр:<b className="ml-1 text-red-500">*</b>
        </span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            placeholder="Байршлын нэр"
            value={state.detail.organizationName}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_ORGANIZATION_NAME,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">Тайлбар:</span>
        <div className="lg:w-3/4 flex items-center">
          <TextArea
            rows={4}
            placeholder="Тайлбар"
            value={state.detail.description}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_DESCRIPTION,
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
