import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/contexts/appContext";
import * as API from "src/api/request";
import "src/pages/login.css";
import Logo from "src/assets/image/logo.png";

import { notification } from "antd";
import _ from "lodash";

import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch, message } = useAppContext();
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
          localStorage.setItem("menu1", 17);
          localStorage.setItem("menu2", 0);

          API.getUserInfo()
            .then((info) => {
              dispatch({
                type: "LOG_IN",
                data: info,
              });
            })
            .catch((error) => {
              message({
                type: "error",
                error,
                title: "Хэрэглэгчийн мэдээлэл татаж чадсангүй",
              });
            });
          API.getUserMenu()
            .then((menu) => {
              dispatch({ type: "LIST_MENU", data: menu });
            })
            .catch((error) => {
              message({
                type: "error",
                error,
                title: "Хэрэглэгчийн цэс татаж чадсангүй",
              });
            });

          navigate("/sample");
        })
        .catch((error) => {
          api.error({
            message: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна",
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
    <div className="w-full min-h-screen flex items-center justify-center text-md m-auto bg-primary">
      {contextHolder}
      <div className="w-[480px] h-full py-[50px] px-16 bg-white border rounded-xl shadow-2xl">
        <div className="mt-10 flex items-center justify-center">
          <img src={Logo} className="w-24 h-16" alt="" />
        </div>
        <div className="mt-5 text-center text-primary text-xl font-bold uppercase">
          Ажлын байрны хэмжилт
        </div>

        <div className="relative mt-10 flex flex-col gap-2">
          <div className="font-semibold text-md">Нэвтрэх нэр</div>
          <div className="relative border rounded-md">
            <div className="absolute text-primary left-2 top-2 text-xl">
              <FaUserCircle />
            </div>
            <input
              type="text"
              className="w-full pl-10 py-1.5 focus:outline-none"
              placeholder="Нэвтрэх нэрээ оруулна уу"
              value={tn}
              onChange={(e) => setTn(e.target.value)}
            />
          </div>
        </div>

        <div className="relative mt-5 flex flex-col gap-2">
          <div className="font-semibold text-md">Нууц үг</div>
          <div className="relative border rounded-md">
            <div className="absolute text-primary left-2 top-2 text-xl">
              <RiLockPasswordFill />
            </div>
            <input
              type={show ? "text" : "password"}
              className="w-full pl-10 py-1.5 focus:outline-none"
              placeholder="Нууц үгээ оруулна уу"
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
                "absolute right-2 top-2 text-primary text-xl cursor-pointer " +
                (password ? "visible" : "invisible")
              }
              onClick={() => setShow(!show)}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full mt-5 px-5 py-1 mb-10 flex items-center justify-center font-semibold bg-primary text-white border-2 border-primary rounded-md hover:bg-white hover:text-primary focus:outline-none duration-300"
          onClick={() => auth()}
        >
          Нэвтрэх
        </button>
      </div>
    </div>
  );
};

export default React.memo(Login);
