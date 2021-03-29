<script>
import firebase from "firebase/app";
import "firebase/messaging";
export default {
  name: "NotificationBox",
  props: ['notifVisible'],

  data() {
    return {
      messageEmployee: "",
      userimg: "",
      messaging: firebase.messaging(),
      currentMessage: "",
      notify: this.notifVisible,
      idEmployee: '',
      statusEmployee: ''
    };
  },
  watch: {
    notifVisible: function (newVal) {
      this.notify = newVal
    }
  },
  methods: {
    receiveMessage() {
      try {
        this.messaging.onMessage((payload) => {
          console.log('data message: ', payload)
          this.currentMessage = payload;
          const statusEmployee = payload.data.status_leave_request
          const idEmployee = payload.data.id_leave_request
          const message = payload.data.employee_name + " - " + payload.data.description;
          const param = {
            messageEmployee: message,
            idEmployee: idEmployee,
            statusEmployee: statusEmployee
          }
          this.setNotificationBoxForm(param);
          this.$emit("getMessage", statusEmployee);
        });
      } catch (e) {
        // console.log(e);
      }
    },

    setNotificationBoxForm(data) {
      this.statusEmployee = data.statusEmployee;
      this.idEmployee = data.idEmployee;
      this.messageEmployee = data.messageEmployee;
    },
    closed() {
      this.$emit("closeNotif", false);
    }
  },

  created() {
    this.receiveMessage();
  },
};
</script>

<template>
  <div v-if="notify">
    <div id="notification-box" class="notification-box">
      <a href="#" id="notification-close" @click="closed()" title="close">x</a>
      <div class="notification-data">
        <a-row :gutter="[8,8]">
           <a-col :span='24'>
             <span>
             </span>
           </a-col>
          <a-col :span='24'>
            <div class="notification-title">
              <span id="title">
                {{statusEmployee}}
              </span>
            </div>
          </a-col>
          <a-col :span='24'>
            <span id="title" style="font-size: 12px; font-weight: 600">
              ID Pengajuan Cuti: {{idEmployee}}
            </span>
          </a-col>
          <a-col :span='24'>
            <div class="notificatopn-notice">
              <span id="subject">{{ messageEmployee }}</span>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<style>
.notification-box {
  display: flex;
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 30%;
  border-radius: 15px;
  background-color: #fff;
  z-index: 999;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
}
#notification-close {
  position: absolute;
  color: #777;
  font-size: 20px;
  right: 15px;
  text-decoration: none;
  text-shadow: 0 1px 0 #fff;
  top: 5px;
  z-index: 10;
  cursor: pointer;
}

.notification-data {
  margin: 20px;
  width: 100% ;
}
.notification-notice span {
  font-weight: 400;
}
.notification-title span {
  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
}
.notification-time small {
  font-size: 12px;
}

.notification-wall-number small {
  font-size: 8px;
}
img {
  width: 30px;
}
</style>