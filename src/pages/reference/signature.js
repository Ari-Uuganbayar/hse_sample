import React, { useEffect, useState } from "react";
import { useSignatureContext } from "src/contexts/reference/signatureContext";
import * as API from "src/api/request";

import { Spin, Modal, Input } from "antd";
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";

const Signature = () => {
  const { state, dispatch, message } = useSignatureContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    setLoading(true);
    API.getSignatureList()
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
    var result = state.list;

    if (search !== "") {
      result = _.filter(
        result,
        (a) =>
          _.toLower(a.typename).includes(_.toLower(search)) ||
          _.toLower(a.description).includes(_.toLower(search))
      );
    }

    setList(result);
  }, [state.list, search]);

  const updateItem = (item) => {
    API.getSignature(item.id)
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
        API.deleteSignature(item.id)
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
    state.name || error.push("Нэр");

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
        typename: state.name,
      };
      if (state.id === null) {
        API.postSignature(data)
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
        API.putSignature(state.id, data)
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
              Нэр:<b className="ml-1 text-red-500">*</b>
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

      <div className="min-h-[calc(100vh-64px)] bg-white text-xs border rounded-lg shadow">
        <div className="border-b p-3">
          <span className="font-semibold">"Гарын үсэг" цонх</span>
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

          <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
            <table className="w-full text-xs">
              <thead className="font-semibold">
                <tr>
                  <th className="w-10 text-center p-1 border">№</th>
                  <th className="text-center p-1 border">Нэр</th>
                  <th className="w-56 text-center p-1 border">Бүртгэсэн</th>
                  <th className="w-20 text-center p-1 border"></th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-1 text-orange-500 italic border"
                    >
                      Мэдээлэл олдсонгүй.
                    </td>
                  </tr>
                )}
                {_.map(list, (item, index) => {
                  return (
                    <tr key={item.id}>
                      <td className="max-w-16 p-1 text-center border">
                        {index + 1}
                      </td>
                      <td className="px-3 py-1 border">{item.typename}</td>
                      <td className="p-1 text-center border">
                        <span className="mr-2 italic">
                          {moment(item.insertdate).format("YYYY.MM.DD")}
                        </span>
                        <span>{item.insertusername}</span>
                      </td>
                      <td className="border">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                            onClick={() => {
                              updateItem(item);
                            }}
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
                })}
              </tbody>
            </table>
          </Spin>
        </div>
      </div>
    </>
  );
};

export default React.memo(Signature);
