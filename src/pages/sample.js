import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useSampleContext } from "src/contexts/sampleContext";
import * as API from "src/api/request";
import * as utils from "src/lib/utils";

import { Spin, Input, Modal, Select, TreeSelect, DatePicker } from "antd";
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";
const { RangePicker } = DatePicker;
const { Option } = Select;

var bg_value = [
  "bg-cyan-200",
  "bg-green-200",
  "bg-amber-200",
  "bg-lime-200",
  "bg-indigo-200",
  "bg-fuchsia-200",
  "bg-teal-200",
  "bg-violet-200",
  "bg-cyan-200",
  "bg-green-200",
  "bg-amber-200",
  "bg-lime-200",
  "bg-indigo-200",
  "bg-fuchsia-200",
  "bg-teal-200",
  "bg-violet-200",
];

const Sample = () => {
  const { state, dispatch, message } = useSampleContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [change, setChange] = useState(0);

  useLayoutEffect(() => {
    API.getParameterList()
      .then((res) => {
        dispatch({ type: "LIST_PARAMETER", data: res });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Үзүүлэлтийн лавлах жасгаалт татаж чадсангүй",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    API.getSampleList({ startdate: "20210101", enddate: "20221231" })
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
    API.getOrganizationList()
      .then((res) => {
        var result = [];
        _.map(res, (item) => {
          result.push({
            ...item,
            title: item.organizationname,
            key: item.id,
            value: item.id,
            id: item.id,
            pId: item.parentid,
          });
        });
        dispatch({ type: "LIST_ORGANIZATION", data: result });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Байгууллагын жасгаалт татаж чадсангүй",
        });
      });

    API.getConditionList()
      .then((res) => dispatch({ type: "LIST_CONDITION", data: res }))
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жасгаалт татаж чадсангүй",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.organization_type) {
      API.getLocationList(state.organization_type)
        .then((res) => {
          dispatch({ type: "LIST_LOCATION", data: res });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: "Байршлын жагсаалт татаж чадсангүй",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.organization_type]);

  useEffect(() => {
    setList(state.list);
  }, [state.list]);

  const tbody = useMemo(() => {
    var aa = _.orderBy(list, ["begindate"], ["desc"]);
    var result = [];
    if (search) {
      aa = _.filter(
        list,
        (a) =>
          _.toLower(a.parentname).includes(_.toLower(search)) ||
          _.toLower(a.organizationname).includes(_.toLower(search)) ||
          _.toLower(a.locationname).includes(_.toLower(search))
      );
    }

    _.map(aa, (item, index) => {
      result.push(
        <tr key={item.id} className="hover:bg-gray-200">
          <td className="p-1 text-center border">{index + 1}</td>
          <td className="w-20 p-1 text-center border">
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
          <td className="px-3 py-1 border">{item.parentname}</td>
          <td className="px-3 py-1 border">{item.organizationname}</td>
          <td className="px-3 py-1 border">{item.locationname}</td>
          <td className="p-1 text-center border">
            {moment(item.begindate).format("YYYY.MM.DD")}
          </td>
          {_.map(
            Object.entries(
              _.groupBy(
                _.orderBy(
                  item.parameter,
                  ["rparametertypeid", "parametername"],
                  ["asc", "asc"]
                ),
                "rparametertypeid"
              )
            ),
            (group) => {
              var result = [];
              var group_list = group[1];
              _.map(group_list, (a) => {
                result.push(
                  <td key={a.id} className="w-10 p-1 text-center border">
                    {/* <Input
                        size="small"
                        value={a.result}
                        onChange={(e) =>
                          change_value(item.id, a.id, e.target.value)
                        }
                      /> */}
                    <input
                      type="text"
                      className="text-center border"
                      value={a?.result === null ? "" : a.result}
                      onChange={(e) =>
                        result_change(item.id, a.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          result_save(item.id, a.id, e.target.value);
                        }
                      }}
                    />
                  </td>
                );
              });
              return result;
            }
          )}
        </tr>
      );
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, search, change]);

  const updateItem = (item) => {
    API.getSample(item.id)
      .then((res) => {
        dispatch({ type: "SET", data: res });
        dispatch({ type: "MODAL", data: true });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Цэсний жасгаалтын мэдээлэл татаж чадсангүй",
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
        API.deleteSample(item.id)
          .then(() => {
            message({
              type: "success",
              title: "Амжилттай устгагдлаа.",
            });
            dispatch({ type: "REFRESH" });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Устгаж чадсангүй",
            });
          });
      }
    });
  };

  const save = () => {
    var error = [];
    state.organization_type || error.push("Байгууллагын төрөл");
    state.organization || error.push("Байгууллага");
    state.location || error.push("Байршил");

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
        locationid: state.location,
        begindate: moment(state.date).format("YYYYMMDD"),
        enddate: moment(state.date).format("YYYYMMDD"),
        rconditionid: state.condition,
      };

      if (state.id === null) {
        API.postSample(data)
          .then(() => {
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
            dispatch({ type: "REFRESH" });
            dispatch({ type: "MODAL", data: false });
            dispatch({ type: "CLEAR" });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Хэмжилт бүртгэж чадсангүй",
            });
          });
      } else {
        API.putSample(state.id, data)
          .then(() => {
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
            dispatch({ type: "REFRESH" });
            dispatch({ type: "MODAL", data: false });
            dispatch({ type: "CLEAR" });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Хэмжилт засварлаж чадсангүй",
            });
          });
      }
    }
  };

  const result_change = (id, paremter_id, value) => {
    var result = list;
    var item = _.find(result, { id: id });
    var index = _.findIndex(result, { id: id });
    var list_paremter = result[index].parameter;
    var parameter = _.find(list_paremter, { id: paremter_id });
    var index_p = _.findIndex(list_paremter, { id: paremter_id });
    list_paremter.splice(index_p, 1, { ...parameter, result: value });
    result.splice(index, 1, { ...item, parameter: list_paremter });
    setList(result);
    setChange((prev) => prev + 1);
  };

  const result_save = (id, paremter_id, value) => {
    API.postSampleResult({
      sampleworkid: id,
      parameterid: paremter_id,
      resulttype: 12,
      result: value,
    })
      .then(() => {
        message({
          type: "success",
          title: "Амжилттай хадгалагдлаа",
        });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Хадгалж чадсангүй",
        });
      });
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
            <span className="block font-semibold">
              Байгууллагын төрөл:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Select
                className="w-full mt-1"
                placeholder="Сонгоно уу."
                value={state.organization_type}
                onChange={(value) =>
                  dispatch({
                    type: "ORGANIZATION_TYPE",
                    data: value,
                  })
                }
              >
                {_.map(state.list_organization_type, (item, index) => {
                  return (
                    <Option key={"organization_type_" + index} value={item.id}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>

          <div className="">
            <span className="block font-semibold">
              Байгууллага: <b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <TreeSelect
                showSearch
                allowClear={true}
                className="w-full"
                placeholder="Сонгоно уу"
                treeDataSimpleMode={true}
                treeData={utils.tree_menu(
                  _.filter(
                    state.list_organization,
                    (a) => a.rorganizationtypeid === state.organization_type
                  )
                )}
                treeLine={(true, { showLeafIcon: false })}
                value={state.organization}
                onChange={(value) =>
                  dispatch({
                    type: "ORGANIZATION",
                    data: value,
                  })
                }
                filterTreeNode={(search, item) =>
                  item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
                }
              />
            </div>
          </div>

          <div className="">
            <span className="block font-semibold">
              Байршил:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Select
                className="w-full mt-1"
                placeholder="Сонгоно уу."
                value={state.location}
                onChange={(value) =>
                  dispatch({
                    type: "LOCATION",
                    data: value,
                  })
                }
              >
                {_.map(
                  _.filter(
                    state.list_location,
                    (a) => a.organizationid === state.organization
                  ),
                  (item, index) => {
                    return (
                      <Option key={"location_" + index} value={item.id}>
                        {item.locationname}
                      </Option>
                    );
                  }
                )}
              </Select>
            </div>
          </div>

          <div className="">
            <span className="block font-semibold">
              Ижил өртөлтийн бүлэг:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Select
                className="w-full mt-1"
                placeholder="Сонгоно уу."
                value={state.condition}
                onChange={(value) =>
                  dispatch({
                    type: "CONDITION",
                    data: value,
                  })
                }
              >
                {_.map(state.list_condition, (item, index) => {
                  return (
                    <Option key={"condition_" + index} value={item.id}>
                      {item.conditionname}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="block font-semibold">
              Огноо:<b className="ml-1 text-red-500">*</b>
            </span>
            <DatePicker
              allowClear={false}
              className="w-3/4 md:w-[150px]"
              format="YYYY.MM.DD"
              value={state.date}
              onChange={(date) =>
                dispatch({
                  type: "DATE",
                  data: moment(date, "YYYY.MM.DD"),
                })
              }
            />
          </div>
        </div>

        <div className="my-3 border" />

        <button
          className="w-full py-1 flex items-center justify-center font-semibold text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <div className="border-b p-3">
          <span className="mr-3 text-md font-semibold">"Хэмжилт"</span>
          <RangePicker
            format="YYYY.MM.DD"
            value={[state.begindate, state.enddate]}
            onChange={(dates) => dispatch({ type: "DATES", data: dates })}
          />
        </div>

        <div className="p-3 flex items-center justify-between">
          <button
            className="px-5 py-1 flex items-center justify-center font-semibold bg-primary text-white border-2 border-primary rounded-md hover:bg-white hover:text-primary focus:outline-none duration-300 text-xs"
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
          <div className="w-1/2 lg:w-1/3 p-2">
            <Input
              size="small"
              placeholder="Хайх..."
              className="w-full text-xs text-right"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-auto mx-3">
          <table className="w-full whitespace-nowrap border text-[11px]">
            <thead className="font-thin">
              <tr>
                <th rowSpan={2} className="w-10 p-1 text-center border">
                  №
                </th>
                <th rowSpan={2} className="w-20 p-1 text-center border"></th>
                <th colSpan={2} rowSpan={2} className="p-1 text-center border">
                  Байгууллага
                </th>
                <th rowSpan={2} className="p-1 text-center border">
                  Ажлын байр
                </th>
                <th rowSpan={2} className="px-5 py-1 text-center border">
                  Огноо
                </th>
                {_.map(
                  Object.entries(
                    _.groupBy(
                      _.orderBy(
                        state.list_parameter,
                        ["rparametertypeid", "parametername"],
                        ["asc", "asc"]
                      ),
                      "rparametertypeid"
                    )
                  ),
                  (item, index) => {
                    var rparametertypeid = _.parseInt(item[0]);
                    var parameterType = _.find(state.list_parameter, {
                      rparametertypeid: rparametertypeid,
                    });
                    return (
                      <th
                        key={index}
                        colSpan={item[1].length}
                        className={"p-1 text-center border " + bg_value[index]}
                      >
                        {parameterType?.parametertypename}
                      </th>
                    );
                  }
                )}
              </tr>
              <tr>
                {_.map(
                  Object.entries(
                    _.groupBy(
                      _.orderBy(
                        state.list_parameter,
                        ["rparametertypeid", "parametername"],
                        ["asc", "asc"]
                      ),
                      "rparametertypeid"
                    )
                  ),
                  (group, index) => {
                    var result = [];
                    var listGroupedParameter = group[1];
                    _.map(listGroupedParameter, (item) => {
                      result.push(
                        <th
                          key={item.id}
                          className={
                            "min-w-[50px] p-1 text-center border " +
                            bg_value[index]
                          }
                        >
                          {item.parameterchar !== null
                            ? item.parameterchar
                            : item.parametername}
                        </th>
                      );
                    });
                    return result;
                  }
                )}
              </tr>
            </thead>
            <tbody>{tbody}</tbody>
          </table>
        </div>
      </Spin>
    </>
  );
};

export default React.memo(Sample);
