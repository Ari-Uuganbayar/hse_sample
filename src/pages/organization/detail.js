import React from "react";
import { useOrganizationContext } from "src/contexts/organizationContext";
import * as API from "src/api/request";

import { Input } from "antd";
import _ from "lodash";
const { TextArea } = Input;

const Detail = () => {
  const { state, dispatch, message } = useOrganizationContext();

  const save = () => {
    var error = [];
    state.organizationName || error.push("Байгууллагын нэр");

    if (error.length > 0) {
      message({
        type: "warning",
        title: (
          <div className="text-orange-500 font-semibold">
            Дараах мэдээлэл дутуу байна
          </div>
        ),
        description: (
          <div className="flex flex-col gap-1">
            {_.map(error, (item, index) => (
              <div key={index}>
                - <span className="ml-1">{item}</span>
              </div>
            ))}
          </div>
        ),
      });
    } else {
      var data = {
        organizationname: state.organizationName,
        description: state.description === null ? "" : state.description,
      };

      if (state.id === null) {
        API.postOrganization(data)
          .then(() => {
            dispatch({ type: "REFRESH" });
            dispatch({ type: "MODAL", data: false });
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Бүртгэж чадсангүй" });
          });
      } else {
        API.putOrganization(state.id, data)
          .then(() => {
            dispatch({ type: "REFRESH" });
            dispatch({ type: "MODAL", data: false });
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Засварлаж чадсангүй" });
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
            value={state.organizationName}
            onChange={(e) =>
              dispatch({
                type: "ORGANIZATION_NAME",
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
            value={state.description}
            onChange={(e) =>
              dispatch({
                type: "DESCRIPTION",
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <button
        className="w-full py-1 flex items-center justify-center font-semibold text-primary_blue border-2 border-primary_blue rounded-md hover:bg-primary_blue hover:text-white focus:outline-none duration-300 text-xs"
        onClick={() => save()}
      >
        <i className="fas fa-save" />
        <span className="ml-2">Хадгалах</span>
      </button>
    </div>
  );
};

export default React.memo(Detail);
