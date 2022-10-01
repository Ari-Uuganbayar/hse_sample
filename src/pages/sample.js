import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useSampleContext } from "src/contexts/sampleContext";
import * as API from "src/api/request";

import { Spin, Input } from "antd";
import _ from "lodash";
import moment from "moment";

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
  }, []);

  useEffect(() => {
    setList(state.list);
  }, [state.list]);

  const tbody = useMemo(() => {
    var aa = list;
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
                        change_value(item.id, a.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          save(item.id, a.id, e.target.value);
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

  const change_value = (id, paremter_id, value) => {
    var result = list;
    var item = _.find(result, { id: id });
    var index = _.findIndex(result, { id: id });
    var list_paremter = result[index].parameter;
    var parameter = _.find(list_paremter, { id: paremter_id });
    var index_p = _.findIndex(list_paremter, { id: paremter_id });
    list_paremter.splice(index_p, 1, { ...parameter, result: value });
    result.splice(index, 1, { ...item, parameter: list_paremter });
    setList(result);
    setChange((prev) => setChange(prev + 1));
  };

  const save = (id, paremter_id, value) => {
    console.log("id, paremter_id, value: ", id, paremter_id, value);
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
    <div className="min-h-[calc(100vh-64px)] bg-white text-xs border rounded-lg shadow">
      <div className="border-b p-3">
        <span className="text-md font-semibold">"Хэмжилт"</span>
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
          <div className="w-1/2 lg:w-1/3">
            <Input
              size="small"
              placeholder="Хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
          <div className="text-[10px] overflow-auto">
            <table className="w-full whitespace-nowrap border">
              <thead className="font-thin">
                <tr>
                  <th rowSpan={2} className="w-10 p-1 text-center border">
                    №
                  </th>
                  <th
                    colSpan={2}
                    rowSpan={2}
                    className="p-1 text-center border"
                  >
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
                          className={
                            "p-1 text-center border " + bg_value[index]
                          }
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
      </div>
    </div>
  );
};

export default React.memo(Sample);
