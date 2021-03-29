<template>
	<div>
		<a-table 
			:columns="dataColums" 
			:data-source="dataTable.data"
			@change="onChange"
			:row-key="record => record.id"
			:loading="loading"
			:pagination="pagination"
		>
	<a 
			slot="name" 
			class="textDetail" 
			slot-scope="text"
			@click="onEdit(text)"
		>
			{{ text }}
		</a>
			<template slot="action" slot-scope="data">
				<a-row :gutter="[8,8]">
					<a-col :span='8' v-if="data.status_leave_request === 'Draft'">
						<a-button @click="onSend(data.id)" id="sendButton" type="primary">
							Send
						</a-button>
					</a-col>
					<a-col :span='8' v-if="data.status_leave_request === 'Draft'">
						<a-popconfirm 
							placement="bottom" 
							ok-text="Yes" 
							cancel-text="No" 
							@confirm="confirmDelete(data.id)"
						>
							<template slot="title">
								<span>
									Apakah anda yakin akan menghapus pengajuan cuti ini?
								</span>
							</template>
							<a-button type="danger" id="deleteButton">
								Delete
							</a-button>
						</a-popconfirm>
					</a-col>
					<a-col :span='8'  v-if="data.status_leave_request === 'Open'">
						<a-popconfirm 
							placement="bottom" 
							ok-text="Yes" 
							cancel-text="No" 
							@confirm="confirmCancel(data.id)"
						>
							<template slot="title">
								<span>
									Apakah anda yakin akan membatalkan pengajuan cuti ini?
								</span>
							</template>
							<a-button id="cancelButton" class="warningBtn" style="background: rgb(249 202 36 / 90%);">
								Cancel
							</a-button>
						</a-popconfirm>
					</a-col>
				</a-row>
			</template>
		</a-table>
	</div>
</template>
<script>

export default {
	name: 'UITable',
	props: 
		['dataTable', 'dataColums', 'sortDefault', 'loading', 'pagination'], 
		// handleTableChange: {type: Function},
	methods: {
    onChange(value, filters, sorter) {
			if (sorter.order === "ascend") {
      sorter.order = "asc";
    } else if (sorter.order === "descend") {
			sorter.order = "desc";
    }
		const sortingPage = `${sorter.order ? `${sorter.columnKey} ${sorter.order}` : this.sortDefault}`
			const obj = {
				pagination: value,
				sort: sortingPage
			}
			this.$emit('handleTableChange', obj)
    },
		onEdit(id) {
			this.$emit('handleEdit', id)
		},
		onSend(id) {
			this.$emit('handleSend', id)
		},
		confirmDelete(id) {
			this.$emit('handleDelete', id)
		},
		confirmCancel(id) {
			this.$emit('handleCancel', id)
		}
  }
};
</script>

<style scoped>
	.warningBtn:hover, .warningBtn:focus {
		color: rgba(0, 0, 0, 0.65);
		background: rgb(249 202 36 / 65%) !important;
    /* background-color: #fff; */
    border-color: transparent;
	}
	.textDetail {
		color: #007bff;
	}
</style>