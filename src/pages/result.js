import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as API from "src/api/request";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import { notification } from "antd";
import moment from "moment";
import _ from "lodash";
import "./result.css";

const Result = () => {
  const params = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState(null);
  const [list, setList] = useState([]);
  console.log("list: ", list);

  useEffect(() => {
    if (params?.qr) {
      API.getLocationResultByQR(params.qr)
        .then((res) => {
          setData(res);
          setList(_.filter(res.parameter, (a) => a.result !== null));
        })
        .catch((error) => {
          setData(null);
          api.error({
            message: "Хэмжилтийн үр дүн татаж чадсангүй",
            description:
              error.toJSON().status +
              " - " +
              (error?.response?.data?.message
                ? error?.response?.data?.message
                : error.toJSON().message),
            placement: "topRight",
            duration: 5,
          });
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.qr]);

  const headerTemplate = (data) => {
    console.log("data: ", data);
    return (
      <React.Fragment>
        <span className="text-[15px]">{data.typename}</span>
      </React.Fragment>
    );
  };

  return (
    <div className="w-full h-screen p-3 bg-gray-200">
      {contextHolder}

      <div className="p-3 h-full bg-white border rounded-md shadow">
        <div className="sm:w-[480px] mb-5 p-3 flex flex-col gap-2 border rounded shadow">
          <h2 className="text-lg">Ерөнхий мэдээлэл</h2>
          <div className="flex items-center gap-2">
            <span className="w-2/5">Хэмжилтийн огноо: </span>
            <span className="w-3/5 font-semibold border-b">
              {moment(data?.begindate).format("YYYY.MM.DD")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2/5">Байгууллага: </span>
            <span className="w-3/5 font-semibold border-b">
              {data?.parentname ? data?.parentname + "-" : ""}
              {data?.organizationname}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2/5">Байршлын нэр: </span>
            <span className="w-3/5 font-semibold border-b">
              {data?.locationname}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2/5">Байршлын код: </span>
            <span className="w-3/5 font-semibold border-b">
              {data?.locationcode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2/5">Ижил өртөлтийн бүлэг: </span>
            <span className="w-3/5 font-semibold border-b">
              {data?.conditionname}
            </span>
          </div>
        </div>

        <div className=" datatable-rowgroup-demo">
          <DataTable
            value={list}
            rowGroupMode="subheader"
            groupRowsBy="typename"
            sortMode="single"
            sortField="typename"
            sortOrder={1}
            scrollable
            scrollHeight="400px"
            rowGroupHeaderTemplate={headerTemplate}
            responsiveLayout="scroll"
            showGridlines
            className="text-xs"
          >
            <Column
              headerStyle={{
                minWidth: "200px",
                textAlign: "center",
                justifyContent: "center",
              }}
              bodyStyle={{ minWidth: "200px", fontSize: "13px" }}
              alignHeader="center"
              headerClassName="text-center"
              className="text-center"
              field="parametername"
              header="Үзүүлэлтийн нэр"
            ></Column>
            <Column
              headerStyle={{
                minWidth: "100px",
                textAlign: "center",
                justifyContent: "center",
              }}
              bodyStyle={{ minWidth: "100px", fontSize: "13px" }}
              alignHeader="center"
              className="text-center"
              field="parameterchar"
              header="Химийн нэршил"
            ></Column>
            <Column
              headerStyle={{
                minWidth: "100px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
              bodyStyle={{
                minWidth: "100px",
                textAlign: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "15px",
              }}
              alignHeader="center"
              className="text-center"
              field="result"
              header="Хариу"
            ></Column>
            <Column
              headerStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
              }}
              bodyStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
              alignHeader="center"
              className="text-center"
              field="unitname"
              header="Хэмжих нэгж"
            ></Column>
            <Column
              headerStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
              }}
              bodyStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
              alignHeader="center"
              className="text-center"
              field="maxvalue8"
              header="ЗДХ 8"
            ></Column>
            <Column
              headerStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
              }}
              bodyStyle={{
                minWidth: "50px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
              alignHeader="center"
              className="text-center"
              field="maxvalue12"
              header="ЗДХ 12"
            ></Column>
            <Column
              headerStyle={{
                minWidth: "100px",
                textAlign: "center",
                justifyContent: "center",
              }}
              bodyStyle={{ minWidth: "100px", fontSize: "13px" }}
              alignHeader="center"
              className="text-center"
              field="standart"
              header="Стандарт"
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Result;
