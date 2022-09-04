import React, { useEffect, useState } from "react";
import { useConditionContext } from "src/contexts/conditionContext";
import * as API from "src/api/request";

import Detail from "src/pages/condition/detail";

import { Spin, Modal } from "antd";
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";

const Index = () => {
  const { state, dispatch, type } = useConditionContext();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    setLoading(true);
    API.getConditionList()
      .then((res) => dispatch({ type: type.CHANGE_LIST, data: res }))
      .catch(() => dispatch({ type: type.CHANGE_LIST, data: [] }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  useEffect(() => {
    var result = state.list;

    if (search !== "") {
      result = _.filter(
        result,
        (a) =>
          _.toLower(a.conditionname).includes(_.toLower(search)) ||
          _.toLower(a.description).includes(_.toLower(search))
      );
    }

    setList(result);
  }, [state.list, search]);

  const deleteItem = (id) => {
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
        API.deleteCondition(id)
          .then(() => {
            dispatch({ type: type.CHANGE_REFRESH });
            dispatch({ type: type.CHANGE_DETAIL_MODAL, data: false });
            Swal.fire({
              icon: "success",
              title: "Амжилттай устгагдлаа.",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(() =>
            Swal.fire({
              icon: "error",
              title: "Устгахад алдаа гарлаа.",
              showConfirmButton: false,
              timer: 1500,
            })
          );
      }
    });
  };

  return (
    <>
      <Modal
        title={<div className="text-center">Бүртгэлийн цонх</div>}
        width="70%"
        centered
        visible={state.detail.modal}
        onCancel={() =>
          dispatch({ type: type.CHANGE_DETAIL_MODAL, data: false })
        }
        footer={false}
      >
        <Detail />
      </Modal>

      <div className="min-h-[calc(100vh-64px)] bg-white text-xs border rounded-lg shadow">
        <div className="border-b p-3">
          <span className="font-semibold">"Ижил өртөлтийн бүлэг" цонх</span>
        </div>
        <div className="max-h-[calc(100vh-145px)] p-3 text-xs overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center justify-center gap-2 px-5 py-1 bg-cyan-500 hover:bg-opacity-80 text-white font-semibold duration-300 border rounded-md shadow"
              onClick={() => {
                dispatch({ type: type.CHANGE_DETAIL_ID, data: null });
                dispatch({ type: type.CLEAR_DETAIL });
                dispatch({ type: type.CHANGE_DETAIL_MODAL, data: true });
              }}
            >
              <div className="flex items-center font-semibold text-xl">
                <ion-icon name="add-circle-outline" />
              </div>
              <span>Бүртгэх</span>
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
                  <th className="text-center p-1 border">
                    Ижил өртөлтийн бүлэг
                  </th>
                  <th className="w-56 text-center p-1 border">Бүртгэсэн</th>
                  <th className="w-20 text-center p-1 border">#</th>
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
                      <td className="px-3 py-1 border">{item.conditionname}</td>
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
                              dispatch({
                                type: type.SET_DETAIL,
                                data: item,
                              });
                              dispatch({
                                type: type.CHANGE_DETAIL_MODAL,
                                data: true,
                              });
                            }}
                          >
                            <ion-icon name="create-outline" />
                          </div>
                          <div
                            className="flex items-center justify-center text-lg text-red-500 cursor-pointer"
                            onClick={() => deleteItem(item.id)}
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

export default React.memo(Index);
