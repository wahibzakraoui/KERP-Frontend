<template>
  <div>
    <!--begin::Dashboard-->
    <div class="row">
    <div class="col-md-12">
      <kendo-datasource ref="datasource1"
                      :type="'json'"
                      :transport-read="readData"
                      :page-size='20'>
    </kendo-datasource>

    <kendo-grid ref="grid"
                :data-source-ref="'datasource1'"
                :groupable="true"
                :sortable="true"
                :scrollable-virtual="true"
                :reorderable="true"
                :resizable="true"
                :column-menu="true"
                :filterable-mode="'row'"
                :pageable-refresh="true"
                :pageable-page-sizes="true"
                :pageable-button-count="5">
        <kendo-grid-column :field="'id'"
                           :title="'ID'"
                           :hidden="true"
                           :width="80"
                           :locked="true"></kendo-grid-column>
        <kendo-grid-column :field="'lot_number'"
                           :title="'LOT'"
                           :locked="true"
                           :width="90"></kendo-grid-column>
        <kendo-grid-column :field="'sequence'"
                           :title="'Seq.'"
                           :width="90"></kendo-grid-column>
        <kendo-grid-column :field="'reception_started'"
                           :title="'Debut'"
                           :width="200"></kendo-grid-column>
        <kendo-grid-column :field="'reception_ended'"
                           :title="'Fin'"
                           :width="200"></kendo-grid-column>
        <kendo-grid-column :field="'workforce'"
                           :title="'Effectif'"
                           :hidden="true"
                           :width="100"></kendo-grid-column>
        <kendo-grid-column :field="'supplier_name'"
                           :title="'Fournisseur'"
                           :width="180"></kendo-grid-column>
        <kendo-grid-column :field="'quantity_received'"
                           :title="'P.Usinable'"
                           :width="150"></kendo-grid-column>
        <kendo-grid-column :field="'quantity_weighted'"
                           :title="'P.Pese'"
                           :width="150"></kendo-grid-column>
        <kendo-grid-column :field="'onp_ticket_serial'"
                           :title="'Bon Pese'"
                           :width="150"></kendo-grid-column>
        <kendo-grid-column :field="'boat_name'"
                           :title="'Bateau'"
                           :hidden="true"
                           :width="150"></kendo-grid-column>
        <kendo-grid-column :field="'caliber_id'"
                           :title="'Moule'"
                           :width="150"></kendo-grid-column>
        <kendo-grid-column :field="'status'"
                           :title="'Status'"
                           :width="150"></kendo-grid-column>
    </kendo-grid>
    </div>
    </div>
    <!--end::Dashboard-->
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "@/core/services/api.service";

export default {
  name: "dashboard",
  components: {
    
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Reception" }]);
  },
  methods: {
    setActiveTab1(event) {
      this.tabIndex = this.setActiveTab(event);
    },
    setActiveTab2(event) {
      this.tabIndex2 = this.setActiveTab(event);
    },
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      // get all tab links
      const tab = event.target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set current active tab
      event.target.classList.add("active");

      // set clicked tab index to bootstrap tab
      return parseInt(event.target.getAttribute("data-tab"));
    },
    readData: function (e) {
      ApiService.get("receptions")
        .then(({ data }) => {
          e.success(data)
        })
        .catch(() => {
          
        });
    }
  }
};
</script>
