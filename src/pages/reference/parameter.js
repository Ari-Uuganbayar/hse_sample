import React, { useEffect, useState, useMemo } from "react";
import { useParameterContext } from "src/contexts/reference/parameterContext";
import * as API from "src/api/request";

import { Spin, Modal, Select, Input } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";
const { Option } = Select;

const Parameter = () => {
  const { state, dispatch, message } = useParameterContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    API.getParameterList()
      .then((res) => dispatch({ type: "LIST", data: res }))
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жасгаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  useEffect(() => {
    API.getParameterTypeList()
      .then((res) => dispatch({ type: "LIST_TYPE", data: res }))
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Үзүүлэлтийн төрлийн жасгаалт татаж чадсангүй",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tbody = useMemo(() => {
    var list = state.list;
    var count = 0;
    var result = [];

    if (search !== "") {
      list = _.filter(
        list,
        (a) =>
          _.toLower(a.parametertypename).includes(_.toLower(search)) ||
          _.toLower(a.parametername).includes(_.toLower(search)) ||
          _.toLower(a.parameterchar).includes(_.toLower(search)) ||
          _.toLower(a.standart).includes(_.toLower(search)) ||
          _.toLower(a.unitname).includes(_.toLower(search)) ||
          _.toLower(a.maxvalue8).includes(_.toLower(search)) ||
          _.toLower(a.maxvalue12).includes(_.toLower(search))
      );
    }

    list.length === 0 &&
      result.push(
        <tr key="empty">
          <td className="p-1 text-orange-500 border italic" colSpan={11}>
            Мэдээлэл олдсонгүй ...
          </td>
        </tr>
      );

    _.map(Object.entries(_.groupBy(list, "parametertypename")), (group1) => {
      var list1 = group1[1];

      _.map(list1, (item, index) => {
        count++;
        result.push(
          <tr key={item.id}>
            <td className="p-1 text-center border">{count}</td>
            {index === 0 && (
              <td className="p-1 text-center border" rowSpan={list1.length}>
                {item.parametertypename}
              </td>
            )}
            <td className="px-3 py-1 border ">{item.parametername}</td>
            <td className="px-3 py-1 border">{item.parameterchar}</td>
            <td className="px-3 py-1 border">{item.standart}</td>
            <td className="p-1 text-center border">{item.unitname}</td>
            <td className="p-1 text-center border">{item.maxvalue8}</td>
            <td className="p-1 text-center border">{item.maxvalue12}</td>
            <td className="border">
              <div className="flex items-center justify-center gap-2">
                <div
                  className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                  onClick={() => updateItem(item)}
                >
                  <ion-icon name="create-outline" />
                </div>
                <div
                  className="flex items-center justify-center text-lg text-red-500 cursor-pointer"
                  onClick={() => deleteItem(item)}
                >
                  <ion-icon name="trash-outline" />
                </div>
              </div>
            </td>
          </tr>
        );
      });
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state.list]);

  const updateItem = (item) => {
    API.getParameter(item.id)
      .then((res) => {
        dispatch({ type: "SET", data: res });
        dispatch({ type: "MODAL", data: true });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Мэдээлэл татаж чадсангүй",
        });
      });
  };

  const deleteItem = (item) => {
    Swal.fire({
      title: "",
      text: "Устгахдаа итгэлтэй байна уу?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "rgb(244, 106, 106)",
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.deleteParameter(item.id)
          .then(() => {
            dispatch({ type: "REFRESH" });
            message({ type: "success", title: "Амжилттай устгагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Устгаж чадсангүй" });
          });
      }
    });
  };

  const save = () => {
    var error = [];
    state.type || error.push("Үзүүлэлтийн төрөл");
    state.name || error.push("Үзүүлэлтийн нэр");

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
        rparametertypeid: state.type,
        parametername: state.name,
        parameterchar: state.char,
        standart: state.standart,
        unitname: state.unit,
        maxvalue8: state.value8,
        maxvalue12: state.value12,
      };

      if (state.id === null) {
        API.postParameter(data)
          .then(() => {
            dispatch({ type: "REFRESH" });
            dispatch({ type: "CLEAR" });
            dispatch({ type: "MODAL", data: false });
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Бүртгэж чадсангүй" });
          });
      } else {
        API.putParameter(state.id, data)
          .then(() => {
            dispatch({ type: "REFRESH" });
            dispatch({ type: "CLEAR" });
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
    <>
      <Modal
        centered
        width={700}
        title={<div className="text-center">Бүртгэл</div>}
        visible={state.modal}
        onCancel={() => dispatch({ type: "MODAL", data: false })}
        footer={null}
      >
        <div className="flex flex-col gap-5 text-xs">
          <div className="">
            <span className="font-semibold">
              Үзүүлэлтийн төрөл:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
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
                value={state.type}
                onChange={(value) =>
                  dispatch({
                    type: "TYPE",
                    data: value,
                  })
                }
              >
                {_.map(state.list_type, (item) => (
                  <Option key={item.id} value={item.id}>
                    <div className="">{item.typename}</div>
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="">
            <span className="font-semibold">
              Үзүүлэлтийн нэр:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Input
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "NAME",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">Химийн нэршил</span>
            <div className="mt-1">
              <Input
                value={state.char}
                onChange={(e) =>
                  dispatch({
                    type: "CHAR",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">Стандарт</span>
            <div className="mt-1">
              <Input
                value={state.standart}
                onChange={(e) =>
                  dispatch({
                    type: "STANDART",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">Хэмжих нэгж</span>
            <div className="mt-1">
              <Input
                value={state.unit}
                onChange={(e) =>
                  dispatch({
                    type: "UNIT",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">ЗДХ 8</span>
            <div className="mt-1">
              <Input
                value={state.value8}
                onChange={(e) =>
                  dispatch({
                    type: "VALUE8",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">ЗДХ 12</span>
            <div className="mt-1">
              <Input
                value={state.value12}
                onChange={(e) =>
                  dispatch({
                    type: "VALUE12",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="my-3 border" />

        <button
          className="w-full py-1 flex items-center justify-center font-semibold text-primary_blue border-2 border-primary_blue rounded-md hover:bg-primary_blue hover:text-white focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <div className="min-h-[calc(100vh-64px)] bg-white text-xs border rounded-lg shadow">
          <div className="border-b p-3">
            <span className="font-semibold">"Үзүүлэлт" цонх</span>
          </div>
          <div className="max-h-[calc(100vh-145px)] p-3 text-xs overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <button
                className="px-5 py-1 flex items-center justify-center font-semibold text-primary_blue border-2 border-primary_blue rounded-md hover:bg-primary_blue hover:text-white focus:outline-none duration-300 text-xs"
                onClick={() => {
                  dispatch({ type: "CLEAR" });
                  dispatch({ type: "MODAL", data: true });
                }}
              >
                <div className="flex items-center font-semibold text-xl">
                  <ion-icon name="add-circle-outline" />
                </div>
                <span className="ml-2">Нэмэх</span>
              </button>
              <input
                type="text"
                placeholder="Хайх..."
                className="w-1/2 lg:w-1/3 px-4 py-1 border rounded-md focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="w-full text-xs">
              <thead className="font-semibold">
                <tr>
                  <th className="w-10 text-center p-1 border">№</th>
                  <th className="text-center p-1 border">Үзүүлэлтийн төрөл</th>
                  <th className="text-center p-1 border">Үзүүлэлтийн нэр</th>
                  <th className="text-center p-1 border">Химийн нэршил</th>
                  <th className="text-center p-1 border">Стандарт</th>
                  <th className="text-center p-1 border">Хэмжих нэгж</th>
                  <th className="text-center p-1 border">ЗДХ 8</th>
                  <th className="text-center p-1 border">ЗДХ 12</th>
                  <th className="w-20 text-center p-1 border"></th>
                </tr>
              </thead>
              <tbody>{tbody}</tbody>
            </table>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default React.memo(Parameter);
