<template>
  <div id="supervisor">
    <NotificationBox 
      @closeNotif='closeNotif'
      @getMessage='onGetMessage' 
      :notifVisible='notifVisible'
    />
    <Header @clickedItem="onSearch"/>

    <div class="body">
      <div class="header-body">
        <p class="text-body">
          Selamat Datang, <br />
          {{ nama }}
        </p>
        <p class="text-body-bawah">Kamu telah login sebagai {{ hak_akses }}</p>
      </div>
      <div class="search-body">
        <UISearch @handleSearch="onSearch" id="spv-search" />
      </div>
      <div class="table-body">
        <a-table
          :data-source="dataTable"
          :columns="columns"
          :pagination="pagination"
          :row-key="(record) => record.id_leave_request"
          @change="onChange"
          :loading="loading"
          id="spv-table"
        >
          <a-button
            class="detail"
            slot="action"
            slot-scope="data"
            type="primary"
            @click="showModal(data.id_leave_request)"
            id="spv-open-modal"
            >Detail</a-button
          >
        </a-table>
      </div>
      <div class="footer">
        <p class="jumlah">Jumlah Data : {{ pagination.total }}</p>
        <p class="keterangan">
          ** Klik <span class="span-detail">“Detail”</span> untuk melihat data
          yang lebih lengkap dan melakukan approval
        </p>
      </div>
    </div>
    <a-modal
      width="60%"
      :visible="visible"
      :title="null"
      @cancel="handleOk"
      @ok="handleOk"
      :footer="null"
      style="border-radius: 20px !important"
      id="spv-modal"
    >
      <div class="text-body-modal">
        <p>
          {{ dataSatu.employee && dataSatu.employee.employee_name }}
          ({{ dataSatu.employee && dataSatu.employee.nip }})
        </p>
        <p>{{ dataSatu.employee && dataSatu.employee.email }}</p>
      </div>
      <hr />
      <div class="keterangan" style="color: black">
        <p
          class="text-body-bawah"
          style="text-align: center; font-weight: bold"
        >
          Keterangan Cuti
        </p>
        <b-container class="bv-example-row">
          <b-row>
            <b-col cols="3"> <p>Keterangan</p> </b-col>
            <b-col cols="1"> <p>:</p> </b-col>
            <b-col>
              <p>{{ dataSatu.description && dataSatu.description }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"> <p>Lama Cuti</p> </b-col>
            <b-col cols="1"> <p>:</p> </b-col>
            <b-col>
              <p>{{ dataSatu.total_date && dataSatu.total_date }} Hari</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"> <p>Sisa Cuti</p> </b-col>
            <b-col cols="1"> <p>:</p> </b-col>
            <b-col>
              <p>
                Tahunan
                {{ dataSatu.sisa_cuti && dataSatu.sisa_cuti.annual_leave }} Hari
              </p>
              <p>
                Lintas tahun
                {{ dataSatu.sisa_cuti && dataSatu.sisa_cuti.last_year_leave }}
                Hari
              </p>
            </b-col>
          </b-row>
        </b-container>
        <a-table
          :data-source="dateDate"
          :columns="columnsDate"
          :pagination="{ pageSize: 5 }"
          id="spv-date-table"
        ></a-table>
      </div>
      <hr />
      <div class="buttons">
        <a-button
          class="reject"
          type="primary"
          @click="rejectSPV"
          :disabled="isDisable()"
          id="spv-reject"
          >Reject</a-button
        >
        <a-button
          class="accept"
          type="primary"
          @click="accSVP"
          :disabled="isDisable()"
          id="spv-accept"
          >Approve</a-button
        >
      </div>
    </a-modal>
  </div>
</template>

<script>
import Header from "./Header";
import { MatrixServices } from "../global/sevices";
import UISearch from "./UISearch";
import NotificationBox from "./NotificationBox";

export default {
  data() {
    return {
      idLeaveRequest: "",
      dataTable: [],
      dataSatu: {},
      dateDate: [],
      loading: false,
      notifVisible: false,
      nama: sessionStorage.getItem("userName"),
      hak_akses: sessionStorage.getItem("role"),
      token: sessionStorage.getItem("at"),
      empID: sessionStorage.getItem("empID"),
      search: "",
      sort: 'id_leave_request asc',
      visible: false,
      pagination: {
        defaultCurrent: 1,
        current: 1,
        pageSize: 5,
        size: "small",
        total: 0,
      },
      columns: [
        {
          title: "NIP",
          dataIndex: "employee.nip",
          key: "employee.nip",
        },
        {
          title: "Nama",
          dataIndex: "employee.employee_name",
          key: "employee_name",
          sorter: true,
        },
        {
          title: "Deskripsi",
          dataIndex: "description",
          key: "description",
          sorter: true,
        },
        {
          title: "Status",
          dataIndex: "status_leave_request",
          key: "status_leave_request",
          sorter: true,
        },
        {
          title: "Details",
          align: "center",
          dataIndex: "",
          key: "",
          scopedSlots: { customRender: "action" },
        },
      ],
      columnsDate: [
        {
          title: "ID Leave Date",
          dataIndex: "id_leave_date",
          key: "id_leave_date",
        },
        {
          title: "Tanggal",
          dataIndex: "leave_date",
          key: "leave_date",
        },
      ],
    };
  },
  mounted() {
    const param = {
      page: 1,
      size: 5,
      sort: this.sort,
      search: '',
      token: this.token
    };
    this.getData(param);
  },
  methods: {
    getData(param) {
      this.loading = true;
      MatrixServices.getUserLeaveRequest(param).then((res) => {
        if (res.status === 200) {
          // console.log(res.data)
          this.dataTable = res.data.attributes;
          this.pagination = {
            pageSize: param.size,
            current: param.page,
            total: res.data.totalItems,
          };
          this.loading = false;
        }
      });
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    showModal(ids) {
      const param = {
        id: ids,
      };
      this.idLeaveRequest = ids;
      MatrixServices.getUserLeaveRequestOne(param, this.token).then((res) => {
        if (res.status === 200) {
          this.visible = true;
          this.dataSatu = res.data.attributes;
          this.dateDate = res.data.attributes.leave_date;
        }
      });
    },
    handleOk() {
      this.visible = false;
    },
    accSVP() {
      const param = {
        page: this.pagination.current,
        size: 5,
        sort: this.sort,
        search: this.search,
        token: this.token,
      };

      const data = {
        id: this.idLeaveRequest,
      };

      const body = {
        userid: this.empID,
      };

      MatrixServices.approveSPV(data, this.token, body).then(() => {
        this.getData(param);
        this.visible = false;
      });
    },
    rejectSPV() {
      const param = {
        page: this.pagination.current,
        size: 5,
        sort: this.sort,
        search: this.search,
        token: this.token,
      };
      const data = {
        id: this.idLeaveRequest,
      };

      const body = {
        userid: this.empID,
      };

      MatrixServices.rejectSPV(data, this.token, body).then(() => {
        this.getData(param);
        this.visible = false;
      });
    },
   isDisable() {
      let disable = true
      if (this.dataSatu.status_leave_request) {
        if (this.dataSatu.status_leave_request === "Open") {
          disable = false;
        }
      }
      return disable
    },
    onChange(value, filters, sorter) {
      if (sorter.order === "ascend") {
        sorter.order = "asc";
      } else if (sorter.order === "descend") {
        sorter.order = "desc";
      }
      const sortingPage = `${
        sorter.order
          ? `${sorter.columnKey} ${sorter.order}`
          : "id_leave_request asc"
      }`;
      this.sort = sortingPage
      this.pagination.current = value.current
      const param = {
        page: value.current,
        size: 5,
        sort: sortingPage,
        search: this.search,
        token: this.token
      };
      this.getData(param);
    },
    onSearch(data) {
      this.search = data;
      const param = {
        id: this.empID,
        page: 1,
        size: 5,
        sort: this.sort,
        search: data,
        token: this.token,
      };
      this.getData(param);
    },
    onGetMessage(data) {
      switch(data) {
        case 'Open' :
          this.notifVisible = true
          break;
        case 'Canceled' :
          this.notifVisible = true
          break;
        case 'Rejected by HRD' :
          this.notifVisible = true
          break;
        case 'Approved' :
          this.notifVisible = true
          break;
        default :
          this.notifVisible = false
      }
    },
    closeNotif(data) {
      this.notifVisible = data
    }
  },
  name: "supervisor",
  components: {
    Header,
    UISearch,
    NotificationBox,
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap%27");

.nav-judul {
  margin-left: 20px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 1.5;
  line-height: 38px;
  color: #f0f7f4;
}
.logo {
  margin-left: 50px;
}
.nav-parent {
  background-color: #32292f;
}
.ml-auto {
  margin-right: 35px;
}
.header-body {
  text-align: left;
  margin-bottom: 20px;
  color: #705d55 !important;
}
.text-body {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 34px;
  line-height: 1.5;
  color: #705d55 !important;
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
.body {
  padding: 20px 50px;
}
.text-body-bawah {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 1.5;
  color: #705d55 !important;
}
.jumlah {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 36px;

  color: #705d55;
}
.keterangan {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 27px;
  /* identical to box height */
  margin-top: -15px;
  color: #705d55;
}
.footer {
  text-align: left;
}
.span-detail {
  font-weight: bold;
}
.detail:hover {
  color: cyan;
  text-decoration: underline;
  cursor: pointer;
}
.search-body {
  width: 50%;
  margin-bottom: 20px;
}
.buttons {
  text-align: right;
}
.reject {
  background-color: red;
  width: 150px;
  height: 40px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  color: #101111;
}
.accept {
  background-color: green;
  width: 150px;
  height: 40px;
  margin-left: 20px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  color: #101111;
}

.bv-example-row {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 1.5;
  margin-top: 8px !important;
  color: #705d55 !important;
}

.text-body-modal {
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.5;
  margin-top: 8px !important;
  color: #705d55 !important;
}
</style>