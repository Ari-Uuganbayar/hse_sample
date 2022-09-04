import React, { useEffect } from "react";
import { useParameterContext } from "src/contexts/parameterContext";
import * as API from "src/api/request";

import { Select, Input } from "antd";
import Swal from "sweetalert2";
import _ from "lodash";
const { Option } = Select;

const Detail = () => {
  const { state, dispatch, type } = useParameterContext();

  useEffect(() => {
    API.getParameterTypeList()
      .then((res) =>
        dispatch({ type: type.CHANGE_DETAIL_LIST_PARAMETER_TYPE, data: res })
      )
      .catch(() =>
        dispatch({ type: type.CHANGE_DETAIL_LIST_PARAMETER_TYPE, data: [] })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    var error = "";
    if (state.detail.parameterType === null) error += "Үзүүлэлтийн төрөл <br/>";
    if (state.detail.parameterName === null) error += "Үзүүлэлтийн нэр <br/>";

    if (error !== "") {
      Swal.fire({
        icon: "warning",
        title: "<b class='text-red-400'>*</b> талбарыг бөглөнө үү.",
        html: error,
      });
    } else {
      var data = {
        rparametertypeid: state.detail.parameterType,
        parametername: state.detail.parameterName,
        parameterchar: state.detail.parameterChar,
        standart: state.detail.standart,
        unitname: state.detail.unit,
        maxvalue8: state.detail.maxValue8,
        maxvalue12: state.detail.maxValue12,
      };

      if (state.detail.id === null) {
        API.postParameter(data).then(() => {
          dispatch({ type: type.CHANGE_REFRESH });
          dispatch({ type: type.CHANGE_DETAIL_MODAL, data: false });
          Swal.fire({
            icon: "success",
            title: "Амжилттай хадгалагдлаа.",
            timer: 1000,
          });
        });
      } else {
        API.putParameter(state.detail.id, data).then(() => {
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
          <Select
            showSearch
            className="w-full"
            placeholder="Сонгоно уу."
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            value={state.detail.parameterType}
            onChange={(value) =>
              dispatch({
                type: type.CHANGE_DETAIL_PARAMETER_TYPE,
                data: value,
              })
            }
          >
            {_.map(state.detail.listParameterType, (item) => (
              <Option key={item.id} value={item.id}>
                <div className="">{item.typename}</div>
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">
          Үзүүлэлтийн нэр:<b className="ml-1 text-red-500">*</b>
        </span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            value={state.detail.parameterName}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_PARAMETER_NAME,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">Химийн нэршил:</span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            value={state.detail.parameterChar}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_PARAMETER_CHAR,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">Стандарт:</span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            value={state.detail.standart}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_STANDART,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">Хэмжих нэгж:</span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            value={state.detail.unit}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_UNIT,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">ЗДХ 8:</span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            value={state.detail.maxValue8}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_MAX_VALUE8,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
        <span className="lg:w-1/4 flex items-center">ЗДХ 12:</span>
        <div className="lg:w-3/4 flex items-center">
          <Input
            value={state.detail.maxValue12}
            onChange={(e) =>
              dispatch({
                type: type.CHANGE_DETAIL_MAX_VALUE12,
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
