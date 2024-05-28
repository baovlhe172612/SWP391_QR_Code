import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { get } from "../../../helpers/API.helper";
import { Link } from "react-router-dom";

function MenuCategory({categories}) {

  const items = categories.map((data, index) => {
    return {
      // thêm logic gì đó ở đây
      label: <Link to={`http://localhost:5264/api/Category?category=${data.categoryName}`}>{data.categoryName}</Link>,
      key: index,
    };
  });

  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        trigger={["click"]}
      >
        <Button size="large">
          Phân Loại
          <DownOutlined />
        </Button>
      </Dropdown>
    </>
  );
}

export default MenuCategory;
