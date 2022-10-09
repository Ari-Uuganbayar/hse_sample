import React, { useState, useEffect } from "react";
import { useSampleContext } from "src/contexts/sampleContext";
import * as API from "src/api/request";
import * as utils from "src/lib/utils";

import { Spin, Input, Modal, Select, TreeSelect, DatePicker } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";
const { RangePicker } = DatePicker;
const { Option } = Select;

const Sample = () => {
  const { state, dispatch, message } = useSampleContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);

  const headerTemplate = (data) => {
    return (
      <div key={data.rparametertypeid} className="text-primary font-semibold">
        <span className="text-[12px]">
          {data.rparametertypeid === null
            ? "Тодорхогүй үзүүлэлтийн бүлэг"
            : data.typename}
        </span>
      </div>
    );
  };

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

  useEffect(() => {
    var result = _.orderBy(state.list, ["begindate"], ["desc"]);
    if (search) {
      result = _.filter(
        list,
        (a) =>
          _.toLower(a.parentname).includes(_.toLower(search)) ||
          _.toLower(a.organizationname).includes(_.toLower(search)) ||
          _.toLower(a.locationname).includes(_.toLower(search)) ||
          _.toLower(a.locationcodes).includes(_.toLower(search)) ||
          _.toLower(moment(a.begindate).format("YYYY.MM.DD")).includes(
            _.toLower(search)
          )
      );
    }
    setList(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list, search]);

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

  const resultItem = (item) => {
    dispatch({ type: "RESULT_ID", data: item.id });
    dispatch({ type: "RESULT_LIST", data: item.parameter });
    dispatch({ type: "RESULT_MODAL", data: true });
  };

  const result_change = (paramter_id, value) => {
    var result = state.result_list;
    var item = _.find(result, { id: paramter_id });
    var index = _.findIndex(result, { id: paramter_id });
    result.splice(index, 1, { ...item, result: value });
    dispatch({ type: "RESULT_LIST", data: result });
  };

  const result_save = (paremter_id, value) => {
    API.postSampleResult({
      sampleworkid: state.result_id,
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
          className="w-full py-1 flex items-center justify-center font-semibold bg-primary text-white border-2 border-primary rounded-md hover:bg-white hover:text-primary focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Modal
        centered
        width={800}
        title={<div className="text-center">Үр дүн</div>}
        visible={state.result_modal}
        onCancel={() => dispatch({ type: "RESULT_MODAL", data: false })}
        footer={null}
      >
        <div className=" datatable-rowgroup-demo">
          <DataTable
            size="small"
            className="text-xs"
            value={state.result_list}
            rowGroupMode="subheader"
            groupRowsBy="rparametertypeid"
            sortMode="single"
            sortField="rparametertypeid"
            sortOrder={1}
            scrollable
            scrollHeight="600px"
            rowGroupHeaderTemplate={headerTemplate}
            responsiveLayout="scroll"
            showGridlines
          >
            <Column
              header="Үзүүлэлтийн нэр"
              field="parametername"
              headerStyle={{
                minWidth: "200px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              bodyStyle={{ minWidth: "200px", fontSize: "10px" }}
            />
            <Column
              field="parameterchar"
              header="Химийн нэршил"
              headerStyle={{
                minWidth: "100px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              bodyStyle={{ minWidth: "100px", fontSize: "10px" }}
            />
            <Column
              header="Хариу"
              field="result"
              headerStyle={{
                minWidth: "150px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              bodyClassName="uppercase"
              bodyStyle={{
                minWidth: "150px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              body={(item) => {
                return (
                  <Input
                    size="small"
                    className="text-center text-xs"
                    placeholder="Enter дарна уу"
                    value={item?.result === null ? "" : item.result}
                    onChange={(e) => result_change(item.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        result_save(item.id, e.target.value);
                      }
                    }}
                  />
                );
              }}
            />
            <Column
              header="Хэмжих нэгж"
              field="unitname"
              headerStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              bodyStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
            />
            <Column
              header="ЗДХ 8"
              field="maxvalue8"
              headerStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              bodyStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
            />
            <Column
              header="ЗДХ 12"
              field="maxvalue12"
              headerStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              bodyStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
            />
            <Column
              header="Стандарт"
              field="standart"
              headerStyle={{
                minWidth: "100px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
              bodyStyle={{ minWidth: "100px", fontSize: "10px" }}
            />
          </DataTable>
        </div>
      </Modal>

      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <div className="border-b p-3">
          <span className="mr-3 text-md font-semibold">Огноо:</span>
          <RangePicker
            size="small"
            format="YYYY.MM.DD"
            allowClear={false}
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
                <th className="w-10 p-1 text-center border">№</th>
                <th colSpan={2} className="p-1 text-center border">
                  Байгууллага
                </th>
                <th className="p-1 text-center border">Ажлын байрны нэр</th>
                <th className="w-10 p-1 text-center border">
                  Ажлын байрны код
                </th>
                <th className="px-5 py-1 text-center border">Огноо</th>
                <th className="px-5 py-1 text-center border"></th>
              </tr>
            </thead>
            <tbody>
              {_.map(list, (item, index) => {
                return (
                  <tr key={item.id} className="hover:bg-gray-200">
                    <td className="p-1 text-center border">{index + 1}</td>
                    <td className="px-3 py-1 border">{item.parentname}</td>
                    <td className="px-3 py-1 border">
                      {item.organizationname}
                    </td>
                    <td className="px-3 py-1 border">{item.locationname}</td>
                    <td className="p-1 text-center border">
                      {item.locationcode}
                    </td>
                    <td className="p-1 text-center border">
                      {moment(item.begindate).format("YYYY.MM.DD")}
                    </td>
                    <td className="w-20 p-1 text-center border">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="flex items-center justify-center text-lg text-blue-500 cursor-pointer"
                          onClick={() => resultItem(item)}
                        >
                          <ion-icon name="search-outline"></ion-icon>
                        </div>

                        <div
                          className="mr-2 flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
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
              })}
            </tbody>
          </table>
        </div>
      </Spin>
    </>
  );
};

export default React.memo(Sample);
