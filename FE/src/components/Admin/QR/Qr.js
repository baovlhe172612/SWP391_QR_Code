import React from "react";
import { Col, Input, QRCode, Space } from "antd";
import { LIST_PRODUCT } from "../../../helpers/APILinks";

function Qr(props) {
  const { qr } = props;
//   console.log(qr)
  const [text, setText] = React.useState(`${LIST_PRODUCT}${qr.tableId}`);

  return (
    <>
      <Col span={6}>
        <Space direction="vertical" align="center">
          <QRCode value={text || '-'}/>
          <Input placeholder="-" maxLength={60} value={text}/>
        </Space>
      </Col>
    </>
  );
}

export default Qr;