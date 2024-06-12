import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag, message, Input } from "antd";
import { LIST_Employee } from "../../../helpers/APILinks";
import { get } from "../../../helpers/API.helper";
import { Link } from "react-router-dom";
import UpdateIsDelete from "./UpdateIsDelete";

const { Search } = Input;

function ListEmployee() {
  const [accountEmployee, setAccountEmployee] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]); // State to store selected filters
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term

  const fetchApi = async () => {
    try {
      const data = await get(LIST_Employee);
      setAccountEmployee(data);
    } catch (error) {
      message.error("Error fetching accounts");
      setAccountEmployee([]);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const onReload = () => {
    fetchApi();
  };

  const handleFilterChange = (status) => {
    console.log("status: ",status)
    
//  prevStatus.includes(status) kiểm tra xem trạng thái hiện tại có bao gồm status hay không.
// Nếu có, hàm sẽ trả về một mảng trống [] để loại bỏ bộ lọc.
// Nếu không, hàm sẽ trả về một mảng chứa trạng thái được chọn [status].
    setFilterStatus((prevStatus) => 
      prevStatus.includes(status) ? [] : [status]
    
    );
    console.log("filterStatus after",filterStatus)
  };

  const getFilteredData = () => {

    // Khởi tạo biến filteredData và gán nó với toàn bộ danh sách nhân viên 
    let filteredData = accountEmployee;

    console.log("filterStatus.length",filterStatus.length)
    // Apply status filter
    if (filterStatus.length > 0) {
     
      const statusMap = {
        active: 1,
        inactive: 0,
      };

      filteredData = filteredData.filter(
       
        (employee) => employee.status === statusMap[filterStatus[0]]
      );
      // console.log("filterStatus[0]",filterStatus[0]),
      console.log("filteredData",filteredData)
      console.log("----------------------------------------------------------",)
    }

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((employee) =>
        Object.keys(employee).some((key) =>
          String(employee[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filteredData;
  };

  const columns = [
    {
      title: "AccountID",
      dataIndex: "accountId",
      key: "accountId",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleId",
    },
    {
      title: "Store Name",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          1: { text: "Active", color: "green" },
          0: { text: "Inactive", color: "red" },
        };
        const { text, color } = statusMap[status] || { text: "Unknown", color: "gray" };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <UpdateIsDelete record={record} onReload={onReload} />
          <Link to={`/admin/employee/edit/${record.accountId}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Link to={`/admin/employee/detail/${record.accountId}`}>
            <Button type="primary">Detail</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        {/** Filter buttons for Active and Inactive */}
        <Button.Group>
          <Button
            type={filterStatus.includes("active") ? "primary" : ""}
            onClick={() => handleFilterChange("active")}
          >
            Active
          </Button>
          <Button
            type={filterStatus.includes("inactive") ? "primary" : ""}
            onClick={() => handleFilterChange("inactive")}
          >
            Inactive
          </Button>
        </Button.Group>

        {/** Search input */}
        <Search
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
      </Space>

      <Table columns={columns} dataSource={getFilteredData()} />
    </>
  );
}

export default ListEmployee;