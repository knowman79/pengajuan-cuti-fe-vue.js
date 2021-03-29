<template>
  <div class="headerContent">
    <b-navbar toggleable="lg" type="dark" class="nav-header">
      <b-navbar-brand href="#">
        <img :src="baseImage" class="align-top icon" alt="Icon79" />
        <span class="nav-title-header">Pengajuan Cuti</span>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-user-login"> </b-navbar-toggle>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content>
            <a-badge :count="banyakData">
              <img :src="lonceng" class="align-center" alt="User" />
            </a-badge>
          </template>
          <b-dropdown-item
            v-for="(p, index) in dataNotif"
            :value="p"
            :key="index"
            @click="clickDropdown(p.id_leave_request)"
            >{{ p.employee.employee_name }} -
            {{ p.description }}</b-dropdown-item
          >
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right>
          <template #button-content>
            <img :src="userLogo" class="align-center" alt="User" />
          </template>
          <b-dropdown-item @click="handleLogout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import baseImageLogo from "../global/asset/79.png";
import userLogo from "../global/asset/user.png";
import notificationLogo from "../global/asset/lonceng.png";
import { MatrixServices } from "../global/sevices";

export default {
  name: "Header",
  props: ["namaUser"],

  data() {
    return {
      dataNotif: {},
      banyakData: "",
      description: "",
      baseImage: baseImageLogo,
      userLogo: userLogo,
      lonceng: notificationLogo,
      hak_akses: sessionStorage.getItem("role"),
      token: sessionStorage.getItem("at"),
    };
  },
  methods: {
    handleLogout() {
      sessionStorage.clear();
      this.$router.push({ name: "login" });
    },
    clickDropdown(ids) {
      const param = {
        id: ids,
      };
      this.idLeaveRequest = ids;
      MatrixServices.getUserLeaveRequestOne(param, this.token).then((res) => {
        if (res.status === 200) {
          this.description = res.data.attributes.description;
        }
        this.$emit("clickedItem", this.description);
      });
    },
  },
  mounted() {
    let param = this.hak_akses === "Supervisor" ? 'open' : this.hak_akses === "HRD" && 'in%20progress' 
    if (this.hak_akses !== 'Talent') {
      MatrixServices.getNotif(param, this.token).then(res => {
        if (res.status === 200) {
          this.dataNotif = res.data.attributes;
          this.banyakData = res.data.totalItems;
        }
      })
    }else {
      const idEmployee = sessionStorage.getItem("empID")
      MatrixServices.getNotifTalent(idEmployee, this.token).then(res => {
        if (res.status === 200) {
          this.dataNotif = res.data.attributes;
          this.banyakData = res.data.totalItems;
        }
      })
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap%27");

.nav-header {
  background-color: #32292f;
}

.icon {
  margin-left: 50px;
  width: 58px;
  height: 45px;
}
.navbar-light .navbar-nav .nav-link:hover,
.navbar-light .navbar-nav .nav-link:focus {
  color: white;
}

.align-center {
  width: 50px;
  height: 50px;
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
  line-height: 48px;
  color: #f0f7f4;
}
</style>
