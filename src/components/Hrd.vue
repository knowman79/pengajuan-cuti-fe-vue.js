<template>
  <div id="hrd">
    <NotificationBox 
      @closeNotif='closeNotif'
      @getMessage='onGetMessage' 
      :notifVisible='notifVisible'
    />
    <Header @clickedItem="onSearch" />
    <div class="body-title">
      <div class="header-body-title">
        <p class="text-body-h1">
          Selamat Datang, <br />
          {{ name }}
        </p>
        <p class="text-body-h2">Kamu telah login sebagai {{ hak_akses }}</p>
      </div>
      <div class="search-body">
        <UISearch @handleSearch="onSearch" id="search-hrd" />
      </div>
      <div class="table-body">
        <a-table
          :data-source="dataTable"
          :columns="columns"
          :pagination="pagination"
          :row-key="(record) => record.id_leave_request"
          @change="onChange"
          :loading="loading"
          id="table-hrd"
        >
          <a-button
            class="detail"
            slot="action"
            slot-scope="data"
            style="primary"
            id="button-modal-hrd"
            @click="showModal(data.id_leave_request)"
          >
            Detail</a-button
          >
        </a-table>
      </div>
      <div class="table-footer">
        <p class="total-data-employee">Jumlah Data : {{ pagination.total }}</p>
        <p class="table-footer-detail">
          ** Klik <span class="span-detail-footer">“Detail”</span> untuk melihat
          data yang lebih lengkap dan melakukan approval
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
      id="modal-hrd"
    >
      <div class="text-body-modal">
        <p>
          {{ dataHrd.employee && dataHrd.employee.employee_name }}
          ({{ dataHrd.employee && dataHrd.employee.nip }})
        </p>
        <p>{{ dataHrd.employee && dataHrd.employee.email }}</p>
      </div>
      <hr />
      <div class="keterangan" style="color: black">
        <p class="text-body-h2" style="text-align: center; font-weight: bold">
          Keterangan Cuti
        </p>
        <b-container class="bv-example-row">
          <b-row>
            <b-col cols="3"> <p class="text-">Keterangan</p> </b-col>
            <b-col cols="1"> <p>:</p> </b-col>
            <b-col>
              <p>{{ dataHrd.description && dataHrd.description }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"> <p>Lama Cuti</p> </b-col>
            <b-col cols="1"> <p>:</p> </b-col>
            <b-col>
              <p>{{ dataHrd.total_date && dataHrd.total_date }} Hari</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"> <p>Sisa Cuti</p> </b-col>
            <b-col cols="1"> <p>:</p> </b-col>
            <b-col>
              <p>
                Tahunan
                {{ dataHrd.sisa_cuti && dataHrd.sisa_cuti.annual_leave }} Hari
              </p>
              <p>
                Lintas tahun
                {{
                  dataHrd.sisa_cuti && dataHrd.sisa_cuti.last_year_leave
                }}
                Hari
              </p>
            </b-col>
          </b-row>
        </b-container>
        <a-table
          id="table-date-hrd"
          :data-source="dateDate"
          :columns="columnsDate"
          :pagination="{ pageSize: 5 }"
        ></a-table>
      </div>
      <hr />
      <div class="button-modal">
        <a-button
          id="button-reject-hrd"
          class="button-reject"
          type="primary"
          @click="rejectHRD"
          :disabled="isDisable()"
          >Reject</a-button
        >
        <a-button
          id="button-accept-hrd"
          class="button-accept"
          type="primary"
          @click="accHRD"
          :disabled="isDisable()"
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
      dateDate: [],
      dataHrd: {},
      loading: false,
      name: sessionStorage.getItem("userName"),
      hak_akses: sessionStorage.getItem("role"),
      token: sessionStorage.getItem("at"),
      empID: sessionStorage.getItem("empID"),
      search: "",
      notifVisible: false,
      sort: 'id_leave_request asc',
      visible: false,
      pagination: {
        defaultCurrent: 1,
        current: 1,
        pageSize: 5,
        size: 'small',
        total: 0
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
    }
    this.getData(param);
  },
  methods: {
    getData(param) {
      this.loading = true;
      MatrixServices.getUserLeaveRequestHrd(param).then((res) => {
        if (res.status === 200) {
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
    
    showModal(ids){
      const param = {
        id: ids,
      };
      this.idLeaveRequest = ids;
      MatrixServices.getUserLeaveRequestHrdCoba(param, this.token).then(
        (res) => {
          if (res.status === 200) {
            this.visible = true;
            this.dataHrd = res.data.attributes;
            this.dateDate = res.data.attributes.leave_date;
          }
        }
      );
    },
    handleOk() {
      this.visible = false;
    },

    accHRD() {
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

      MatrixServices.approveHRD(data, this.token, body).then(() => {
        this.getData(param);
        this.visible = false;
      });
    },

    rejectHRD() {
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

      MatrixServices.rejectHRD(data, this.token, body).then(() => {
        this.getData(param);
        this.visible = false;
      });
    },

    isDisable() {
      let disable = true
      if (this.dataHrd.status_leave_request) {
        if (this.dataHrd.status_leave_request === "In Progress") {
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
		const sortingPage = `${sorter.order ? `${sorter.columnKey} ${sorter.order}` : 'id_leave_request asc'}`
			this.sort = sortingPage
      this.pagination.current = value.current
      const param = {
				page: value.current,
        size: 5,
        sort: sortingPage,
        search: this.search,
        token: this.token
      }
      this.getData(param)
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
        case 'In Progress' :
          this.notifVisible = true
          break;
        case 'Rejected by Supervisor' :
          this.notifVisible = true
          break;
        case 'Rejected by HRD' :
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
  name: "hrd",
  components: {
    Header,
    UISearch,
    NotificationBox,
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap%27");

.nav-header {
  background-color: #32292f;
}

.search-body {
  width: 60%;
  margin-bottom: 20px;
}

.Icon {
  margin-left: 50px;
}

.ml-auto {
  margin-right: 35px;
  color: #f0f7f4;
}

.nav-title-header {
  margin-left: 20px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 38px;
  color: #f0f7f4;
}

.body-title {
  padding: 20px 50px;
}

.header-body-title {
  text-align: left;
  margin-bottom: 20px;
  color: #705d55 !important;
}
.text-body-h1 {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 1.5;
  color: #705d55 !important;
}

.text-body-h2 {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
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

.bv-example-row {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 1.5;
  margin-top: 8px !important;
  color: #705d55 !important;
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.table-footer {
  text-align: left;
}

.total-data-employee {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 36px;

  color: #705d55;
}
.table-footer-detail {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 27px;
  margin-top: -15px;
  color: #705d55;
}

.span-detail-footer {
  font-weight: bold;
}

.detail:hover {
  color: cyan;
  text-decoration: underline;
  cursor: pointer;
}
.button-modal {
  text-align: right;
}
.button-reject {
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
.button-accept {
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
</style>
