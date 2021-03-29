<template>
	<div>
		<a-input-search 
			placeholder="Search" 
			@search="onSearch" 
			class="input-search"
			id="searchInput"
		/>
	</div>
</template>
<script>
import { GlobalFunction } from "../global/function/handleKeyword";
export default {
  name: "UISearch",
  props: {
    search: String,
  },
  methods: {
    onSearch(value) {
      const data = GlobalFunction.searchEncode(value);
      this.$emit("handleSearch", data);
    },
  },
};
</script>

<style>
.input-search > .ant-input {
  border: none;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
}
</style>