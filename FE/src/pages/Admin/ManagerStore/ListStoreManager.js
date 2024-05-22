import React, { useEffect, useState } from 'react'
import { Space, Table, Tag } from "antd";
import DeleteStoreManager from './DeleteStoreManager';
import UpdateStoreManager from './UpdateStoreManager';
import { get } from "../../../helpers/API.helper";
function ListStoreManager() {
  // Define the data for the employee table
  const [AccountManager, setAccountManager] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const data = await get("http://localhost:5264/api/Account");
      //
      console.log(data);

      setAccountManager(data);
    };

    fetchApi();
  }, []);
  const columns = [
    {
      title: "AccountID",
      dataIndex: "accountId",
      key: "accountId",
       // Custom text rendering
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      // Custom text rendering
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "user",
    },
    {
      title: "Password",
      dataIndex: "passWord",
      key: "password",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          '1': { text: 'Active', color: 'green' },
          '0': { text: 'Inactive', color: 'red' }
        };
        const { text, color } = statusMap[status] || { text: 'Unknown', color: 'gray' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
      
    {
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleId",
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <Space size="middle">
            <UpdateStoreManager record={record} />
            <DeleteStoreManager record={record} /> {/* Pass the record to the delete component */}
          </Space>
        );
      }
    },
  ];

  console.log("AccountManager: ",AccountManager);
  
  return (
    <>
      <Table columns={columns} dataSource={AccountManager} />
    </>
  );
}

export default ListStoreManager