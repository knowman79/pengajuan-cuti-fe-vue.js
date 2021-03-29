<template>
  <div class="background">
    <b-container class="container">
      <img :src="baseImage" alt="Logo" class="ilustrasi" />
      <p class="judul-web">Sistem Pengajuan Cuti</p>
      <img :src="backImage" alt="Logo" class="ilustrasi2" />
      <div class="card">
        <p class="login-atas">Login Here !</p>
        <p class="keterangan">Masuk dengan akun yang telah terdaftar</p>
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row type="flex" justify="center" :gutter="[8, 8]">
            <a-col :span="24">
              <a-form-item
                :validate-status="userNameError() ? 'error' : ''"
                :help="userNameError() || ''"
              >
                <a-input
                  v-decorator="[
                    'userName',
                    {
                      rules: [{}],
                    },
                  ]"
                  placeholder="Username"
                  class="username"
                  size="large"
                  required
                  oninvalid="this.setCustomValidity('Please Input Your Username!')"
                  oninput="this.setCustomValidity('')"
                >
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :validate-status="passwordError() ? 'error' : ''"
                :help="passwordError() || ''"
              >
                <a-input
                  v-decorator="[
                    'password',
                    {
                      rules: [{}],
                    },
                  ]"
                  type="password"
                  placeholder="Password"
                  class="username"
                  size="large"
                  required
                  oninvalid="this.setCustomValidity('Please Input Your Password!')"
                  oninput="this.setCustomValidity('')"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :disabled="hasErrors(form.getFieldsError())"
                :loading="loading"
                class="tombol-login"
              >
                Log in
              </a-button>
            </a-form-item>
          </a-row>
          <GoogleLogin
            :params="params"
            :renderParams="renderParams"
            :onSuccess="onSuccess"
            :onFailure="onFailure"
            style="margin-top: 20px; margin-left: 115px"
          ></GoogleLogin>
        </a-form>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import config from "../global/config";
import baseImage from "../global/asset/login79.png";
import backImage from "../global/asset/gambarlogin.png";
import GoogleLogin from "vue-google-login";

const { BASE_URL_LOGIN, TIMEOUT, client_id } = config;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}
export default {
  components: {
    GoogleLogin,
  },
  name: "Login",
  props: {
    msg: String,
  },
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: "horizontal_login" }),
      baseImage: baseImage,
      loading: false,
      backImage: backImage,
      // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
      params: {
        client_id: client_id,
      },
      // only needed if you want to render the button with the google ui
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
  methods: {
    onSuccess(googleUser) {
      this.loading = true;
      axios
        .post(`${BASE_URL_LOGIN}login`, {
          fcm_token: googleUser.tc.id_token,
        })
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.$notification.success({
              message: `Success`,
              description: "Berhasil Login",
              placement: "bottomRight",
            });
            sessionStorage.setItem("at", res.data.access_token);
            sessionStorage.setItem(
              "userName",
              res.data.attributes.employee_name
            );
            sessionStorage.setItem("role", res.data.attributes.role_name);
            sessionStorage.setItem("empID", res.data.attributes.id_employee);
            if (res.data.attributes.role_name === "Talent") {
              this.$router.push({ name: "tallent" });
            } else if (res.data.attributes.role_name === "Supervisor") {
              this.$router.push({ name: "supervisor" });
            } else if (res.data.attributes.role_name === "HRD") {
              this.$router.push({ name: "hrd" });
            }
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$notification.error({
            message: `Error`,
            description: err.response.data.error.message ? err.response.data.error.message : 'Failed, Incorrect Username/Password',
            placement: "bottomRight",
          });
        });
    },

    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("userName") && getFieldError("userName");
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("password") && getFieldError("password");
    },
    onFailure() {
      // console.log(data)
    },
    handleSubmit(e) {
      e.preventDefault();
      this.loading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          axios
            .post(
              `${BASE_URL_LOGIN}login`,
              {
                username: values.userName,
                password: values.password,
              },
              {
                timeout: TIMEOUT,
              }
            )
            .then((res) => {
              this.loading = false;
              if (res.status === 200) {
                this.$notification.success({
                  message: `Success`,
                  description: "Berhasil Login",
                  placement: "bottomRight",
                });
                sessionStorage.setItem("at", res.data.access_token);
                axios.patch(`${BASE_URL_LOGIN}updateToken/${res.data.attributes.id_employee}`, {
                  token: localStorage.getItem('fcm_token')
                })
                sessionStorage.setItem(
                  "userName",
                  res.data.attributes.employee_name
                );
                sessionStorage.setItem("role", res.data.attributes.role_name);
                sessionStorage.setItem(
                  "empID",
                  res.data.attributes.id_employee
                );
                if (res.data.attributes.role_name === "Talent") {
                  this.$router.push({ name: "tallent" });
                } else if (res.data.attributes.role_name === "Supervisor") {
                  this.$router.push({ name: "supervisor" });
                } else if (res.data.attributes.role_name === "HRD") {
                  this.$router.push({ name: "hrd" });
                }
              } else {
                this.$notification.error({
                  message: `Error`,
                  description: "Username/Password salah",
                  placement: "bottomRight",
                });
              }
            })
            .catch((error) => {
              this.loading = false;
              this.$notification.error({
                message: `Error`,
                description: error.response.data.error.message ? error.response.data.error.message : 'Failed, Incorrect Username/Password',
                placement: "bottomRight",
              });
            });
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap%27");
.container {
  margin: auto;
}
.loginText {
  font-family: sans-serif;
  font-size: 48px;
  font-weight: bold;
}
.background {
  background-color: #32292f;
  height: 100vh;
}
.ilustrasi {
  position: absolute;
  width: 382px;
  height: 108px;
  left: 100px;
  top: 71px;
}
.judul-web {
  position: absolute;
  width: 425px;
  height: 61px;
  left: 100px;
  top: 203px;

  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 72px;
  /* or 199% */

  text-align: center;

  color: #f0f7f4;
}
.ilustrasi2 {
  position: absolute;
  width: 325.99px;
  height: 366.17px;
  left: 174px;
  top: 282px;
}
.card {
  position: absolute;
  width: 501.19px;
  height: 501.19px;
  left: 782.81px;
  top: 84.64px;

  background: #f0f7f4;
  border-radius: 50px;
}
.login-atas {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 72px;
  /* or 199% */

  text-align: center;

  color: #32292f;
  margin-top: 40px;
}
.keterangan {
  margin-top: -10px;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 30px;
  /* or 166% */

  text-align: center;

  /* Paragraph */

  color: #32403b;
}
.username {
  margin-top: 12px;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 23.01px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.tombol-login {
  margin-top: 30px;
  width: 280.89px;
  height: 64.99px;
  background: #705d55;
  border-radius: 50px;

  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 44px;
  /* or 183% */

  text-align: center;

  color: #ffffff;
}
.daftar {
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 28px;
  /* or 199% */

  text-align: center;

  /* Paragraph */

  color: #32403b;
  margin-top: 10px;
}
</style>

<style>
.username > input {
  padding-left: 50px !important;
  border-radius: 50px;
  height: 60px;
}
.username > span {
  left: 20px !important;
}
</style>
