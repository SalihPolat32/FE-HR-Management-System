/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

/**
 * =========================================================
 * HR Management System React - v2.2.0
 * =========================================================
 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)
 * Coded by www.creative-tim.com
 * =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// HR Management System React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import jwt_decode from "jwt-decode";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function Data() {
  const [data, setData] = useState(null);
  const token = String(localStorage.getItem("Authorization"));
  const [maasValues, setMaasValues] = useState({});
  const decodedToken = jwt_decode(token);
  const [userInfo, setUserInfo] = useState({});

  const handleEdit = (id, name, surName, companyid, maas) => {
    console.log("Author ID to edit:", id, " ", typeof id);

    if (id !== null) {
      // URL'yi oluşturun ve parametreleri ekleyin
      console.log("companyid");
      console.log(companyid);
      console.log("companyid");
      const apiUrl = `http://localhost:7073/api/v1/company/addsalary?authorId=${id}&maas=${maas}&name=${name}&surname=${surName}&companyid=${companyid}`;

      // Axios ile POST isteği gönderin
      Axios.post(apiUrl, null, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Başarılı yanıtı burada işleyin
        })
        .catch((error) => {
          console.error("Veri düzenleme hatası:", error);
        });
    } else {
      console.error("authorId değeri null. İstek gönderilemiyor.");
    }
  };

  useEffect(() => {
    Axios.post(
      "http://localhost:7072/api/v1/user/findallguestbycompanymanager",
      { token },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        const apiData = response.data;
        setData(apiData);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, []);

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const rows = data
    ? data.map((author, index) => ({
        author: <Author image={team2} name={author.username} email={""} />,
        function: <Job title={author.title} description={author.description} />,
        maas: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {author.izinsuresi} days
          </MDTypography>
        ),
        maasduzenle: (
          <input
            type="text"
            id={`sebep-${author.id}`}
            value={maasValues[author.id] || ""}
            onChange={(e) => setMaasValues({ ...maasValues, [author.id]: e.target.value })}
          />
        ),
        Active: (
          <button
            onClick={() =>
              handleEdit(
                author.id,
                author.name,
                author.surName,
                author.companyId,
                maasValues[author.id]
              )
            }
          >
            Onayla
          </button>
        ),
      }))
    : [];

  return {
    columns: [
      { Header: "author", accessor: "author", width: "15%", align: "left" },
      { Header: "function", accessor: "function", align: "left" },
      { Header: "maas", accessor: "maas", align: "center" },
      { Header: "maasduzenle", accessor: "maasduzenle", align: "center" },
      { Header: "Active", accessor: "Active", align: "center" },
    ],
    rows: rows,
  };
}