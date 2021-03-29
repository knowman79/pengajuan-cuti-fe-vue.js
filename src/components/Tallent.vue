<template>
  <div class="containerView">
    <NotificationBox 
      @closeNotif='closeNotif'
      @getMessage='onGetMessage' 
      :notifVisible='notifVisible'
    />
    <Header @clickedItem="onSearch" />
    <div class="body">
      <div class="status">
        <b-row>
          <b-col>
            <p class="nama-status">{{ nama }}</p>
            <p class="cuti-sisa">Cuti anda tersisa</p>
            <b-row>
              <b-col>
                <p class="tahunan">Tahunan</p>
                <p class="isi-tahunan">{{ totalCuti.tahunan }} Hari</p>
              </b-col>
              <b-col>
                <p class="tahunan">Lintas Tahun Cuti</p>
                <p class="isi-tahunan">{{ totalCuti.lintas }} Hari</p>
              </b-col>
            </b-row>
          </b-col>
          <img :src="tallentImage" alt="User" class="logo-status" />
        </b-row>
      </div>
      <a-row type="flex" justify="space-between">
        <a-col :span="10" style="margin: auto;">
          <UISearch @handleSearch="onSearch" />
        </a-col>
        <a-col :span="14" style="text-align: right">
          <a-button 
            @click="onAdd" 
            type="primary" 
            id="addCuti" 
            class="tombol-add"
            :disabled='totalCuti.tahunan === 0 && totalCuti.lintas === 0'
          >
            Buat Pengajuan Cuti
          </a-button>
        </a-col>
      </a-row>
      <UITable
        :dataTable="dataTable"
        :dataColums="columnTable"
        :sortDefault="'id_leave_request asc'"
        :loading="loading"
        style="margin-top: 20px"
        :pagination="pagination"
        @handleTableChange="handleTableChange"
        @handleEdit="onEdit"
        @handleSend="onSend"
        @handleDelete="onDelete"
        @handleCancel="onCancel"
      />
      <div class="footer">
        <p class="jumlah">Jumlah Data : {{ dataTable.totalData }}</p>
        <p class="keterangan">
          ** Klik <span class="span-detail">“ID Request”</span> untuk melihat
          data yang lebih lengkap dan melakukan Edit
        </p>
      </div>
    </div>
    <UIModal
      :visible="modalVisible"
      :totalCuti="totalCuti"
      @closeModal="closeModal"
      @onFinish="onFinish"
      :dataFrom="dataFrom"
      :dataDetail="dataDetail"
    />
  </div>
</template>

<script>
import UISearch from "./UISearch";
import UITable from "./UITable";
import UIModal from "./UIModal";
import Header from "./Header";
import { MatrixServices } from "../global/sevices";
import tallentImage from "../global/asset/logoStatus.png";
import NotificationBox from "./NotificationBox";
// import Vue from 'vue'
export default {
  data() {
    return {
      tallentImage: tallentImage,
      dataTable: {},
      modalVisible: false,
      search: "",
      totalCuti: {
        tahunan: 0,
        lintas: 0,
      },
      dataFrom: "",
      token: sessionStorage.getItem("at"),
      empID: sessionStorage.getItem("empID"),
      loading: false,
      editId: null,
      notifVisible: false,
      nama: "",
      hak_akses: "",
      sort: 'id_leave_request asc',
      dataDetail: {
        deskripsi: "",
        setDate: [],
      },
      pagination: {
        defaultCurrent: 1,
        current: 1,
        pageSize: 5,
        size: "small",
        total: 0,
      },
      columnTable: [
        {
          title: "ID Request",
          dataIndex: "id_leave_request",
          key: "id_leave_request",
          sorter: true,
          scopedSlots: { customRender: "name" },
        },
        {
          title: "Deskripsi",
          dataIndex: "description",
          key: "description",
          sorter: true,
        },
        {
          title: "Tanggal Cuti",
          dataIndex: "date_desc",
          key: "datedesc",
          width: "20%",
          sorter: true,
        },
        {
          title: "Status",
          dataIndex: "status_leave_request",
          key: "status_leave_request",
          sorter: true,
        },
        {
          title: "action",
          dataIndex: "",
          key: "",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  name: "Tallent",
  components: {
    UISearch,
    UITable,
    UIModal,
    Header,
    NotificationBox
  },
  props: {
    msg: String,
  },
  mounted() {
    const param = {
      id: this.empID,
      page: 1,
      size: 5,
      sort: this.sort,
      search: "",
      token: this.token,
    };
    this.nama = sessionStorage.getItem("userName");
    this.hak_akses = sessionStorage.getItem("role");
    this.getData(param);
  },
  methods: {
    onclick() {
      this.$router.push({ name: "home" });
    },
    handleTableChange(data) {
      this.pagination.current = data.pagination.current
      this.sort = data.sort
      const param = {
        id: this.empID,
        page: data.pagination.current,
        size: 5,
        sort: this.sort,
        search: this.search,
        token: this.token,
      };
      this.getData(param);
    },
    getData(param) {
      this.loading = true;
      this.dataFrom = "add";
      this.dataDetail = {
        deskripsi: "",
        setDate: [],
      };
      MatrixServices.getEmploye(param).then((data) => {
        var self = this;
        this.loading = false;
        if (data.status === 200) {
          let tempData = [];
          data.data.attributes.leave_request.map((res) => {
            tempData.push({
              id: res.id_leave_request,
              ...res,
            });
          });
          this.totalCuti = {
            tahunan: data.data.attributes.sisa_cuti.annual_leave,
            lintas: data.data.attributes.sisa_cuti.last_year_leave,
          };

          self.dataTable = {
            data: tempData,
            totalData: data.data.attributes.total_leave_request,
          };
          this.pagination = {
            defaultCurrent: 1,
            current: param.page,
            pageSize: 5,
            size: "small",
            total: data.data.attributes.total_leave_request,
          };
        }
      });
    },
    onEdit(id) {
      const param = {
        id: id,
        token: this.token,
      };
      MatrixServices.getDetailEmploye(param).then((res) => {
        if (res.status === 200) {
          this.dataDetail = {
            deskripsi: res.data.attributes.description,
            setDate: res.data.attributes.leave_date,
            status: res.data.attributes.status_leave_request,
          };
          this.dataFrom = "edit";
          this.modalVisible = true;
          this.editId = id;
        }
      });
    },
    onSend(id) {
      const param = {
        id: this.empID,
        page: this.pagination.current,
        size: 5,
        sort: this.sort,
        search: this.search,
        token: this.token,
      };
      const body = {
        id: id,
        token: this.token,
      };
      MatrixServices.sendCuti(body).then((res) => {
        if (res.status === 200) {
          this.getData(param);
        }
      });
    },
    onDelete(id) {
      const body = {
        userid: this.empID,
      };
      const param = {
        id: this.empID,
        page: this.pagination.current,
        size: 5,
        sort: this.sort,
        search: this.search,
        token: this.token,
      };
      MatrixServices.deleteCuti(id, body, this.token).then((res) => {
        if (res.status === 200) {
          this.getData(param);
        }
      });
    },
    onCancel(id) {
      const param = {
        id: this.empID,
        page: this.pagination.current,
        size: 5,
        sort: this.sort,
        search: this.search,
        token: this.token,
      };
      const body = {
        id: id,
        token: this.token,
      };
      MatrixServices.cancelCuti(body).then((res) => {
        if (res.status === 200) {
          this.getData(param);
        }
      });
    },
    onAdd() {
      var self = this;
      self.modalVisible = true;
      this.dataFrom = "add";
      this.dataDetail = {
        deskripsi: "",
        setDate: [],
      };
    },
    onSearch(data) {
      this.search = data;
      this.pagination.current = 1
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
        case 'Approved' :
          this.notifVisible = true
          break;
        default :
          this.notifVisible = false
      }
    },
    closeNotif(data) {
      this.notifVisible = data
    },
    closeModal(data) {
      var self = this;
      self.modalVisible = data;
      this.dataFrom = "add";
      this.dataDetail = {
        deskripsi: "",
        setDate: [],
      };
    },
    onFinish(data) {
      const body = {
        id_employee: parseInt(this.empID),
        description: data.description,
        userid: this.empID,
        set_date: data.set_date,
      };
      this.search = ''
      this.pagination.current = 1
      const param = {
        id: this.empID,
        page: 1,
        size: 5,
        sort: this.sort,
        search: "",
        token: this.token,
      };
      if (this.dataFrom === "add") {
        MatrixServices.addCuti(body, this.token).then((res) => {
          if (res.status === 200) {
            this.getData(param);
            this.modalVisible = false;
          }
        });
      } else {
        MatrixServices.editCuti(body, this.editId, this.token).then((res) => {
          if (res.status === 200) {
            this.getData(param);
            this.modalVisible = false;
          }
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap%27");
.status {
  width: 677px;
  height: 175px;
  background: #705d55;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  text-align: left;
  margin-bottom: 40px;
}
.logo-status {
  margin-top: 9px;
  margin-right: 41px;
  margin-bottom: 9px;
  width: 166px;
}
.nama-status {
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  color: #f0f7f4;
  padding-top: 14px;
  padding-left: 38px;
}
.tahunan {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 25px;
  /* identical to box height */
  padding-left: 38px;

  /* White */

  color: #ffffff;
}
.isi-tahunan {
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 44px;
  /* identical to box height */
  padding-left: 38px;
  margin-top: -20px;
  /* White */

  color: #ffffff;
}
.cuti-sisa {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 36px;
  /* identical to box height */

  /* White */
  margin-top: -15px;
  padding-left: 38px;
  color: #ffffff;
}
.tombol-add {
  width: 347px;
  height: 56px;
  background: #705d55;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;

  color: #f0f7f4;
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
  font-size: 48px;
  line-height: 1.5;
  color: #705d55 !important;
}
.body {
  padding: 20px 50px;
  margin: 0 90px;
}
.text-body-bawah {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 1.5;
  color: #705d55 !important;
}
.text-card {
  font-family: Poppins;
  font-weight: bold;
  font-size: 18px;
  line-height: 1.5;
  /* color: #705d55 !important; */
}
.bodyCard_style {
  height: 100%;
  overflow: auto;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  /* overflow: auto hidden; */
}
.header {
  background: blue;
  padding: 10px;
  text-align: right;
  color: white;
}
.loginText {
  font-family: sans-serif;
  font-size: 60px;
  font-weight: bold;
}

.footer {
  text-align: left;
  margin-top: 20px;
}

.jumlah {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 36px;

  color: #705d55;
}

.keterangan {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */
  margin-top: -15px;
  color: #705d55;
}
</style>
