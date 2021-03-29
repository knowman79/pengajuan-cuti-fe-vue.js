<template>
  <div>
    <a-modal
      :visible="visible"
      centered
      :footer="null"
      @cancel="onCancel"
      width="770px"
    >
      <UIForm
        :visible="this.visible"
        @onFinish="onFinish"
        :totalCuti="this.totalCuti"
        :dataFrom="this.dataFrom"
        :dataDetail="this.dataDetail"
      />
    </a-modal>
  </div>
</template>
<script>
import UIForm from "./UIForm";
export default {
  name: "UIModal",
  props: ["visible", "totalCuti", "dataFrom", "dataDetail"],
  components: {
    UIForm,
  },
  methods: {
    onCancel() {
      this.$emit("closeModal", false);
    },
    onFinish(data) {
      this.$emit("onFinish", data);
    },
  },
};
</script>