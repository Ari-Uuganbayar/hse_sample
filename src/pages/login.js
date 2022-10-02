import React, { useState } from "react";
import * as API from "src/api/request";
import "src/pages/login.css";

import { notification } from "antd";
import _ from "lodash";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();

  const [show, setShow] = useState(false);
  const [tn, setTn] = useState("");
  const [password, setPassword] = useState("");

  const auth = () => {
    var error = [];
    tn || error.push("Нэвтрэх нэр");
    password || error.push("Нууц үг");

    if (error.length > 0) {
      api.info({
        message: (
          <div className="text-orange-500 font-semibold">
            Дараах мэдээлэл дутуу байна
          </div>
        ),
        description: (
          <div className="flex flex-col gap-1">
            {_.map(error, (item, index) => (
              <div key={"error_" + index}>
                - <span className="ml-1">{item}</span>
              </div>
            ))}
          </div>
        ),
        placement: "topRight",
        duration: 5,
      });
    } else {
      API.logIn({ username: tn, password: password })
        .then((res) => {
          window.localStorage.clear();
          localStorage.setItem("token", res.data.access_token);
          window.location.replace("/");
        })
        .catch((error) => {
          api.error({
            message: "Хэрэгчийн нэр эсвэл нууц үг буруу байна",
            description:
              _.toString(error.toJSON().status) +
              " - " +
              (error?.response?.data?.message
                ? error?.response?.data?.message
                : error.toJSON().message),
            placement: "topRight",
            duration: 5,
          });
        });
    }
  };

  return (
    <div className="w-full min-h-screen flex text-xs">
      {contextHolder}
      <div className="w-2/3 min-h-screen bg-violet-500 flex items-center justify-center">
        <div className="text-white text-3xl font-bold">Энд зураг оруулна</div>
      </div>
      <div className="w-1/3 h-screen flex flex-col items-center justify-center bg-gray-200">
        <div className="w-96 px-10 py-48 bg-white border rounded shadow-2xl">
          <div className="w-full text-center">
            <span className="text-lg">Нэвтрэх хуудас</span>
          </div>

          <div className="relative mt-5 border-b">
            <div className="absolute text-primary left-2 top-1 text-xl">
              <ion-icon name="person-circle-sharp" />
            </div>
            <input
              type="text"
              className="w-full pl-10 py-1.5"
              placeholder="Нэвтрэх нэр"
              value={tn}
              onChange={(e) => setTn(e.target.value)}
            />
          </div>
          <div className="relative mt-5 border-b">
            <div className="absolute text-primary left-2 top-1 text-xl">
              <ion-icon name="lock-closed-sharp" />
            </div>
            <input
              type={show ? "text" : "password"}
              className="w-full pl-10 py-1.5"
              placeholder="Нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  auth();
                }
              }}
            />
            <div
              className={
                "absolute right-2 top-1 text-xl cursor-pointer " +
                (password ? "visible" : "invisible")
              }
              onClick={() => setShow(!show)}
            >
              <ion-icon name={show ? "eye-off-sharp" : "eye-sharp"} />
            </div>
          </div>
          <button
            type="button"
            className="w-full mt-5 px-5 py-1 flex items-center justify-center font-semibold text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white focus:outline-none duration-300 text-xs"
            onClick={(e) => auth()}
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
