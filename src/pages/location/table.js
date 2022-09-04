import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocationContext } from "src/contexts/locationContext";
import * as API from "src/api/request";
import { Spin } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";

const Table = () => {
  const navigate = useNavigate();
  const { state, dispatch, type } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    API.getLocationList(state.selectedOrgType)
      .then((res) => {
        dispatch({ type: type.CHANGE_LIST_LOCATION, data: res });
      })
      .catch(() => dispatch({ type: type.CHANGE_LIST_LOCATION, data: [] }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedOrgType, state.refresh]);

  const updateItem = (id) => {
    navigate("/location/" + id);
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
        API.deleteLocation(id)
          .then(() => {
            dispatch({ type: type.CHANGE_REFRESH });
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

  const tbody = useMemo(() => {
    var list = state.listLocation;
    var count = 0;
    var result = [];

    if (state.selectedOrgType === 1) {
      if (search !== "")
        list = _.filter(
          list,
          (a) =>
            _.toLower(a.tsehcode).includes(_.toLower(search)) ||
            _.toLower(a.tsehname).includes(_.toLower(search)) ||
            _.toLower(a.negjcode).includes(_.toLower(search)) ||
            _.toLower(a.negjname).includes(_.toLower(search)) ||
            _.toLower(a.locationcode).includes(_.toLower(search)) ||
            _.toLower(a.locationname).includes(_.toLower(search)) ||
            _.toLower(a.description).includes(_.toLower(search))
        );

      list?.length === 0 &&
        result.push(
          <tr>
            <td className="p-1 text-orange-500 border italic" colSpan={7}>
              Мэдээлэл олдсонгүй ...
            </td>
          </tr>
        );

      _.map(Object.entries(_.groupBy(list, "tsehcode")), (level1) => {
        var level1_text = level1[0];
        var level1_list = level1[1];

        _.map(
          Object.entries(_.groupBy(level1_list, "negjcode")),
          (level2, level2_index) => {
            var level2_text = level2[0];
            var level2_list = level2[1];

            _.map(level2_list, (item, index) => {
              count++;
              result.push(
                <tr key={item?.id}>
                  <td className="border text-center p-1">{count}</td>
                  {level2_index === 0 && index === 0 && (
                    <td
                      className="border text-center p-1 font-semibold"
                      rowSpan={level1_list.length}
                    >
                      <div className="text-cyan-500 italic">{level1_text}</div>
                      <div className="">{level1_list[0]?.tsehname}</div>
                    </td>
                  )}
                  {index === 0 && (
                    <td
                      className="border text-center p-1 font-semibold"
                      rowSpan={level2_list.length}
                    >
                      <div className="text-cyan-500 italic">{level2_text}</div>
                      <div className="">{level2_list[0]?.negjname}</div>
                    </td>
                  )}
                  <td className="p-1 text-center border font-semibold text-cyan-500">
                    <div className="flex items-center justify-center">
                      {item?.tsehcode !== null && <div>{item?.tsehcode}.</div>}
                      {item?.negjcode !== null && <div>{item?.negjcode}.</div>}
                      {item?.locationcode !== null && (
                        <div>{item?.locationcode}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-1 border">{item?.locationname}</td>
                  <td className="px-3 py-1 border">{item?.description}</td>
                  <td className="border">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                        onClick={() => updateItem(item.id)}
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
          }
        );
      });
    }

    if (state.selectedOrgType === 2) {
      list = _.filter(
        list,
        (a) =>
          _.toLower(a.organizationname).includes(_.toLower(search)) ||
          _.toLower(a.locationcode).includes(_.toLower(search)) ||
          _.toLower(a.locationname).includes(_.toLower(search)) ||
          _.toLower(a.description).includes(_.toLower(search))
      );

      list.length === 0 &&
        result.push(
          <tr>
            <td className="p-1 text-orange-500 border italic" colSpan={6}>
              Мэдээлэл олдсонгүй ...
            </td>
          </tr>
        );

      _.map(Object.entries(_.groupBy(list, "id")), (group1) => {
        var list1 = group1[1];

        _.map(list1, (item, index) => {
          count++;
          result.push(
            <tr key={item.id}>
              <td className="p-1 text-center border">{count}</td>
              {index === 0 && (
                <td className="px-3 py-1 border" rowSpan={list1.length}>
                  {item.organizationname}
                </td>
              )}
              <td className="p-1 text-center border font-semibold text-cyan-500">
                {item.locationcode}
              </td>
              <td className="px-3 py-1 border">{item.locationname}</td>
              <td className="px-3 py-1 border">{item.description}</td>
              <td className="border">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                    onClick={() => updateItem(item.id)}
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
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state.listLocation]);

  return (
    <div className="w-full max-h-[calc(100vh-145px)] overflow-auto">
      <div className="flex items-center justify-between mb-2">
        <button
          className="flex items-center justify-center gap-2 px-5 py-1 bg-cyan-500 hover:bg-opacity-80 text-white font-semibold duration-300 border rounded-md shadow"
          onClick={() => navigate("add")}
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
              {state.selectedOrgType === 1 && (
                <>
                  <th className="text-center p-1 border">Цех</th>
                  <th className="text-center p-1 border">Хэсэг</th>
                </>
              )}
              {state.selectedOrgType === 2 && (
                <th className="text-center p-1 border">Байгууллага</th>
              )}
              <th className="text-center p-1 border">Байршлын код</th>
              <th className="text-center p-1 border">Байршлын нэр</th>
              <th className="text-center p-1 border">Тайлбар</th>
              <th className="w-20 text-center p-1 border">#</th>
            </tr>
          </thead>
          <tbody>{tbody}</tbody>
        </table>
      </Spin>
    </div>
  );
};

export default React.memo(Table);
