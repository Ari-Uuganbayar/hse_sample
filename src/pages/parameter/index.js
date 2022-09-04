import React, { useEffect, useState, useMemo } from "react";
import { useParameterContext } from "src/contexts/parameterContext";
import * as API from "src/api/request";

import Detail from "src/pages/parameter/detail";

import { Spin, Modal } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";

const Index = () => {
  const { state, dispatch, type } = useParameterContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    API.getParameterList()
      .then((res) => dispatch({ type: type.CHANGE_LIST, data: res }))
      .catch(() => dispatch({ type: type.CHANGE_LIST, data: [] }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

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
        <tr>
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
                  onClick={() => deleteItem(item.id)}
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
    dispatch({
      type: type.SET_DETAIL,
      data: item,
    });
    dispatch({
      type: type.CHANGE_DETAIL_MODAL,
      data: true,
    });
  };

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
        API.deleteParameter(id)
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
        width="65%"
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
          <span className="font-semibold">"Үзүүлэлт" цонх</span>
        </div>
        <div className="max-h-[calc(100vh-145px)] p-3 text-xs overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center justify-center gap-2 px-5 py-1 bg-cyan-500 hover:bg-opacity-80 text-white font-semibold duration-300 border rounded-md shadow"
              onClick={() => {
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
                  <th className="text-center p-1 border">Үзүүлэлтийн төрөл</th>
                  <th className="text-center p-1 border">Үзүүлэлтийн нэр</th>
                  <th className="text-center p-1 border">Химийн нэршил</th>
                  <th className="text-center p-1 border">Стандарт</th>
                  <th className="text-center p-1 border">Хэмжих нэгж</th>
                  <th className="text-center p-1 border">ЗДХ 8</th>
                  <th className="text-center p-1 border">ЗДХ 12</th>
                  <th className="w-20 text-center p-1 border">#</th>
                </tr>
              </thead>
              <tbody>{tbody}</tbody>
            </table>
          </Spin>
        </div>
      </div>
    </>
  );
};

export default React.memo(Index);
