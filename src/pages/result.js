import React from "react";
import { useParams } from "react-router-dom";

const Result = () => {
  const { id } = useParams();
  console.log("id: ", id);
  return <div>Result</div>;
};

export default Result;
