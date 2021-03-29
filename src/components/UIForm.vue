<template>
  <div class="container">
    <a-form :form="form" @submit="handleSubmit">
      <a-row type="flex" :gutter="[8, 8]">
        <a-col :span="24">
          <a-form-item>
            <span class="loginText"> Form Pengajuan Cuti </span>
            <br />
            <span class="loginText2">
              Pastikan kamu mengisi semua data pada form ini
            </span>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item style="margin-bottom: 12px">
            <div class="status">
              <b-row>
                <b-col>
                  <p class="nama-status">{{ nama }}</p>
                  <p class="cuti-sisa">Cuti anda tersisa</p>
                  <b-row>
                    <b-col>
                      <p class="tahunan">Tahunan</p>
                      <p class="isi-tahunan">{{ sisaCuti.tahunan }} Hari</p>
                    </b-col>
                    <b-col>
                      <p class="tahunan">Lintas Tahun Cuti</p>
                      <p class="isi-tahunan">{{ sisaCuti.lintas }} Hari</p>
                    </b-col>
                  </b-row>
                </b-col>
                <img :src="tallentImage" alt="User" class="logo-status" />
              </b-row>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item style="margin-bottom: 12px">
            <a-button
              @click="addDate"
              type="primary"
              :disabled="hariCuti.length >= sisaCuti || hasErrors()"
              class="tombol-tambah"
              id="addTime"
            >
              Tambah
            </a-button>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[8, 0]">
            <div v-for="item in hariCuti" :key="item.sisa">
              <a-col :span="19">
                <a-form-item style="margin-bottom: 12px">
                  <a-date-picker
                    v-decorator="[
                      `date${item.sisa}`,
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Tanggal Cuti Tidak boleh kosong',
                          },
                        ],
                        initialValue: item.date,
                      },
                    ]"
                    style="width: 100%"
                    format="YYYY-MM-DD"
                    :disabled-date="disabledDate"
                    size="large"
                    @change="
                      (date, dateString) => change(date, dateString, item.sisa)
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5" style="text-align: right">
                <a-form-item>
                  <a-button
                    @click="deleteDate"
                    type="danger"
                    :disabled="hasErrors()"
                    class="tombol-hapus"
                  >
                    Hapus
                  </a-button>
                </a-form-item>
              </a-col>
            </div>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-form-item style="margin-bottom: 12px">
            <a-input
              v-decorator="[
                'deskripsi',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Deskripsi tidak boleh kosong!',
                    },
                  ],
                },
              ]"
              placeholder="Deskripsi"
              :disabled="hasErrors()"
              size="large"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24" style="text-align: right">
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="hasErrors() || hariCuti.length === 0"
              class="tombol-submit"
              id="submitButton"
            >
              Submit
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import moment from "moment";
import tallentImage from "../global/asset/logoStatus.png";

function hasErrors() {
  let isDisable = false;
  if (this.dataFrom === "edit") {
    if (this.dataDetail.status !== "Draft") {
      isDisable = true;
    }
  }
  return isDisable;
}
export default {
  name: "UIForm",
  props: ["visible", "totalCuti", "dataFrom", "dataDetail"],
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: "horizontal_login" }),
      hariCuti: [],
      sisaCuti: this.totalCuti,
      nama: sessionStorage.getItem("userName"),
      tallentImage: tallentImage,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      if (this.dataFrom === "edit") {
        this.getInitForm(this.dataDetail);
      } else {
        this.hariCuti = [];
      }
    });
  },
  watch: {
    visible: function (newVal) {
      if (!newVal) {
        this.form.resetFields();
        this.hariCuti = [];
      }
    },
    dataFrom: function (newVal) {
      if (newVal === "edit") {
        this.getInitForm(this.dataDetail);
      } else {
        this.hariCuti = [];
      }
    },
    totalCuti: function (newVal) {
      this.sisaCuti = newVal;
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let tempDataDate = [];
          this.hariCuti.map((res) => {
            // let dateObj = "date" + (index + 1);
            // let date = moment(values[dateObj]).format("YYYY-MM-DD");
            let date = moment(res.date).format("YYYY-MM-DD");
            tempDataDate.push({
              leave_date: date,
            });
          });
          const data = {
            set_date: tempDataDate,
            description: values.deskripsi,
          };
          this.$emit("onFinish", data);
        }
      });
    },
    disabledDate(current) {
      return current && current < moment().endOf("day");
    },
    change(date, dateString, id) {
      this.hariCuti.map((res, index) => {
        if (res.sisa === id) {
          this.hariCuti[index].date = dateString;
        }
      });
    },
    addDate() {
      var self = this;
      self.hariCuti.push({
        sisa: self.hariCuti.length + 1,
        date: "",
      });
    },
    deleteDate() {
      var self = this;
      self.hariCuti.pop();
    },
    getInitForm(data) {
      let obj = {};
      if (data.setDate) {
        data.setDate.map((res) => {
          let tempName = "date" + res.id_leave_date;
          obj = {
            ...obj,
            [tempName]: moment(res.leave_date).format("YYYY-MM-DD"),
          };
          this.hariCuti.push({
            sisa: res.id_leave_date,
            date: moment(res.leave_date).format("YYYY-MM-DD"),
          });
          this.form.getFieldDecorator(tempName.toString(), {
            initialValue: moment(res.leave_date, "YYYY-MM-DD"),
          });
          this.form.setFieldsValue({
            [tempName]: moment(res.leave_date, "YYYY-MM-DD"),
          });
        });
      }
      if (data.deskripsi) {
        this.form.setFieldsValue({
          deskripsi: data.deskripsi,
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  margin: auto;
}
.tombol-tambah {
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
.loginText {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 72px;
  /* identical to box height, or 199% */
  margin-bottom: -30px;
  color: #32292f;
}
.loginText2 {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  /* or 125% */

  /* Paragraph */
  margin-top: -30px;
  color: #32403b;
}
.tombol-hapus {
  width: 140px;
  height: 40px;
  background: #d94747;
  border-radius: 10px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;

  color: #f0f7f4;
}
.tombol-submit {
  width: 140px;
  height: 40px;
  background: #20c91c;
  border-radius: 10px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;

  color: #f0f7f4;
}
.textLabel {
  font-family: sans-serif;
  font-size: 18px;
}
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
</style>
