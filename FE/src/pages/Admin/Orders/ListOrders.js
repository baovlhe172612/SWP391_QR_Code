// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Button, Table, Tag, message } from "antd";
// import { get } from "../../../helpers/API.helper";
// import { LIST_ORDER, LIST_ORDERHaveTableName } from "../../../helpers/APILinks";
// import {
//   getColorText,
//   getDateTime,
//   getStatusText,
// } from "../../../helpers/Text.helper";

// function ListOrders() {
//   const [orders, setOrders] = useState([]);
//   const account = useSelector((state) => state.AccountReducer);
//   console.log("account.storeId",account.storeId)
//   // let data = [];
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     // US English uses month-day-year order
//     // console.log(date.toLocaleDateString('en-US'));
//     // → "12/20/2012"

//     // British English uses day-month-year order
//     // console.log(date.toLocaleDateString('en-GB'));
//     // → "20/12/2012"
//     return date.toLocaleDateString('en-GB');
// };

//   useEffect(() => {
//     const fetchApi = async () => {
//       try {
//         // Get data orders
//         const data = await get(`${LIST_ORDERHaveTableName}/${account.storeId}`);
//         console.log("data list order",data);
//         console.log("OrderID",data.orderID);
//         if (data) {
//           setOrders(data);
//           if (data.length === 0) {
//             message.error("No order in store");
//           }
//         }
//       } catch (error) {
//         // Notification Error
//         console.log(error, "ListOrders");
//         message.error("Server error");
//       }
//     };

//     fetchApi();
//   }, []);
//   const columns = [
//     {
//       title: "Order ID",
//       dataIndex: "orderID",
//       key: "orderID",
//       render: (text) => <a>{text}</a>, // custom text
//     },
//     {
//       title: "Table Name",
//       dataIndex: "tableName",
//       key: "tableName",
//       render: (text) => <strong>{text}</strong>, // custom text
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={getColorText(status)}>{getStatusText(status)}</Tag>
//       ),
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//       render: (date) => <span>{formatDate(getDateTime(date))}</span>,
//     },
//     {
//       title: "Total",
//       dataIndex: "total",
//       key: "total",
//       render: (text) => <strong style={{ fontSize: "1.1rem" }}>${text}</strong>, // custom text
//     },
//     {
//       title: "Detail",
//       dataIndex: "orderID",
//       key: "orderID",
//       render: (orderID) => (
//         <Link to={`/admin/orders/orderdetails/${orderID}/${account.storeId}`}>
//           <Button type="primary">Detail</Button>
//         </Link>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Table
//         columns={columns}
//         dataSource={orders}
//         pagination={{ pageSize: 6 }}
//         rowKey="id"
//       />
//     </>
//   );
// }

// export default ListOrders;




import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Table, Tag, message, Modal, Spin } from "antd";
import { get } from "../../../helpers/API.helper";
import { LIST_ORDERHaveTableName, LIST_ORDERDETAILS } from "../../../helpers/APILinks";
import { getColorText, getDateTime, getStatusText } from "../../../helpers/Text.helper";

function ListOrders() {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const account = useSelector((state) => state.AccountReducer);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await get(`${LIST_ORDERHaveTableName}/${account.storeId}`);
        console.log("LIST_ORDERHaveTableName",data)
        if (data) {
          setOrders(data);
          if (data.length === 0) {
            message.error("No order in store");
          }
        }
      } catch (error) {
        message.error("Server error");
      }
    };
    fetchApi();
  }, [account.storeId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const data = await get(`${LIST_ORDERDETAILS}/${account.storeId}/${orderId}`);
      console.log("LIST_ORDERDETAILS",data)
      setOrderDetails(data);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Error fetching order details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOrderDetails(null);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Table Name",
      dataIndex: "tableName",
      key: "tableName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getColorText(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{formatDate(getDateTime(date))}</span>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <strong style={{ fontSize: "1.1rem" }}>{text.toLocaleString('vi-VN')}đ</strong>,
    },
    {
      title: "Detail",
      dataIndex: "orderID",
      key: "orderID",
      render: (orderID) => (
        <Button type="primary" onClick={() => fetchOrderDetails(orderID)}>
          Detail
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 6 }}
        rowKey="orderID"
      />

      <Modal
        title="Order Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {loading ? (
          <Spin />
        ) : (
          orderDetails && (
            <Table
              columns={[
                {
                  title: "Order ID",
                  dataIndex: "orderID",
                  key: "orderID",
                },
                {
                  title: "Store Name",
                  dataIndex: "storeName",
                  key: "storeName",
                },
                // {
                //   title: "Table",
                //   dataIndex: "tableName",
                //   key: "tableName",
                // },
                {
                  title: "Product Name",
                  dataIndex: "productName",
                  key: "productName",
                },
                {
                  title: "Size",
                  dataIndex: "sizeName",
                  key: "sizeName",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "Price",
                  dataIndex: "price",
                  key: "price",
                  render: (text) => `${text.toLocaleString('vi-VN')} đ`, // Định dạng để thêm chữ "đ" sau giá
                },
              ]}
              dataSource={orderDetails}
              rowKey="id"
              pagination={false}
            />
          )
        )}
      </Modal>
    </>
  );
}

export default ListOrders;
