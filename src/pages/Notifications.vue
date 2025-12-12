<template>
  <div class="notifications-page">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">
            <i class="pi pi-bell"></i>
            Notifications
          </h1>
          <p class="page-subtitle">Gestion des notifications d'erreur des nœuds</p>
        </div>
        <Button
          icon="pi pi-cog"
          class="p-button-rounded p-button-text p-button-sm settings-button"
          @click="settingsDialogVisible = true"
          v-tooltip.top="'Paramètres'"
        />
      </div>
    </div>

    <div class="notifications-container">
      <Card class="notifications-card">
        <template #content>
          <!-- Loading State -->
          <div v-if="loading" class="loading-container">
            <ProgressSpinner />
            <p class="loading-text">Chargement des notifications...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && notifications.length === 0" class="empty-state">
            <i class="pi pi-inbox empty-icon"></i>
            <h3>Aucune notification</h3>
            <p>Aucune notification d'erreur disponible pour le moment.</p>
          </div>

          <!-- Notifications Table -->
          <DataTable
            v-else
            :value="notifications"
            :paginator="true"
            :rows="rowsPerPage"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            :loading="loading"
            responsiveLayout="scroll"
            class="p-datatable-striped notifications-table"
            :globalFilterFields="['Node', 'Farmer', 'Title', 'msg']"
            v-model:filters="filters"
            :globalFilter="globalFilter"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @row-click="onRowClick"
            stripedRows
            showGridlines
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} à {last} sur {totalRecords} notifications"
            :emptyMessage="'Aucune notification trouvée'"
          >
            <template #header>
              <div class="table-header">
                <div class="header-left">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="globalFilter"
                      placeholder="Rechercher dans les notifications..."
                      class="search-input"
                    />
                  </span>
                </div>
                <div class="header-right">
                  <Button
                    icon="pi pi-refresh"
                    label="Actualiser"
                    class="p-button-text p-button-sm"
                    @click="loadNotifications"
                    :loading="loading"
                  />
                  <span class="notification-count">
                    {{ notifications.length }} notification{{ notifications.length > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
            </template>

            <Column field="Date" header="Date" :sortable="true" style="min-width: 180px">
              <template #body="slotProps">
                <div class="date-cell">
                  <i class="pi pi-calendar date-icon"></i>
                  <span>{{ formatDate(slotProps.data.Date || slotProps.data.date) }}</span>
                </div>
              </template>
            </Column>

            <Column field="Node" header="Nœud" :sortable="true" style="min-width: 120px">
              <template #body="slotProps">
                <div class="node-cell">
                  <i class="pi pi-server node-icon"></i>
                  <span class="node-id">{{ slotProps.data.Node }}</span>
                </div>
              </template>
            </Column>

            <Column field="Farmer" header="Agriculteur" :sortable="true" style="min-width: 150px">
              <template #body="slotProps">
                <div class="farmer-cell">
                  <i class="pi pi-user farmer-icon"></i>
                  <span>{{ slotProps.data.Farmer || 'N/A' }}</span>
                </div>
              </template>
            </Column>

            <Column field="Title" header="Titre" :sortable="true" style="min-width: 200px">
              <template #body="slotProps">
                <div class="title-cell">
                  <span class="title-text">{{ slotProps.data.Title || slotProps.data.msg || 'Notification' }}</span>
                </div>
              </template>
            </Column>

            <Column field="msg" header="Message" :sortable="false" style="min-width: 250px">
              <template #body="slotProps">
                <div class="message-cell">
                  <span>{{ slotProps.data.msg || slotProps.data.Title || 'Aucun message' }}</span>
                </div>
              </template>
            </Column>

            <Column
              v-if="notifications.some(n => n.min || n.hours)"
              field="hours"
              header="Durée"
              :sortable="true"
              style="min-width: 120px"
            >
              <template #body="slotProps">
                <div class="duration-cell" v-if="slotProps.data.hours || slotProps.data.min">
                  <i class="pi pi-clock duration-icon"></i>
                  <span>
                    {{ slotProps.data.hours ? `${slotProps.data.hours}h` : '' }}
                    {{ slotProps.data.min ? `${slotProps.data.min}min` : '' }}
                  </span>
                </div>
                <span v-else>-</span>
              </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 120px; text-align: center">
              <template #body="slotProps">
                <div class="action-buttons">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-info p-button-sm"
                    @click.stop="viewNode(slotProps.data.Node)"
                    v-tooltip.top="'Voir le nœud'"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    @click.stop="deleteNotification(slotProps.data._id, slotProps.index)"
                    v-tooltip.top="'Supprimer'"
                    :loading="deletingId === slotProps.data._id"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialogVisible"
      modal
      header="Confirmer la suppression"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle confirmation-icon"></i>
        <span>Êtes-vous sûr de vouloir supprimer cette notification ?</span>
      </div>
      <template #footer>
        <Button
          label="Annuler"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteDialogVisible = false"
        />
        <Button
          label="Supprimer"
          icon="pi pi-check"
          class="p-button-danger"
          @click="confirmDelete"
          :loading="deleting"
        />
      </template>
    </Dialog>

    <!-- Settings Dialog -->
    <Dialog
      v-model:visible="settingsDialogVisible"
      modal
      header="Paramètres des notifications"
      :style="{ width: '400px' }"
      class="settings-dialog"
    >
      <div class="settings-content">
        <div class="setting-group">
          <label class="setting-label">
            <i class="pi pi-calendar"></i>
            Période d'affichage
          </label>
          <div class="period-buttons">
            <Button
              :label="'3 mois'"
              :class="dateFilter === '3months' ? 'p-button-sm p-button-success' : 'p-button-sm p-button-outlined'"
              @click="setDateFilter('3months')"
            />
            <Button
              :label="'6 mois'"
              :class="dateFilter === '6months' ? 'p-button-sm p-button-success' : 'p-button-sm p-button-outlined'"
              @click="setDateFilter('6months')"
            />
            <Button
              :label="'Tout'"
              :class="dateFilter === 'all' ? 'p-button-sm p-button-success' : 'p-button-sm p-button-outlined'"
              @click="setDateFilter('all')"
            />
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <i class="pi pi-sort"></i>
            Tri par défaut
          </label>
          <div class="sort-options">
            <div class="sort-option">
              <input
                type="radio"
                id="sort-date"
                value="Date"
                v-model="sortField"
                @change="applySettings"
              />
              <label for="sort-date">Date</label>
            </div>
            <div class="sort-option">
              <input
                type="radio"
                id="sort-node"
                value="Node"
                v-model="sortField"
                @change="applySettings"
              />
              <label for="sort-node">Nœud</label>
            </div>
            <div class="sort-option">
              <input
                type="radio"
                id="sort-farmer"
                value="Farmer"
                v-model="sortField"
                @change="applySettings"
              />
              <label for="sort-farmer">Agriculteur</label>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <i class="pi pi-list"></i>
            Lignes par page
          </label>
          <div class="rows-options">
            <Button
              v-for="rows in [5, 10, 20, 50]"
              :key="rows"
              :label="rows.toString()"
              :class="rowsPerPage === rows ? 'p-button-sm p-button-success' : 'p-button-sm p-button-outlined'"
              @click="setRowsPerPage(rows)"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Fermer"
          icon="pi pi-times"
          class="p-button-text"
          @click="settingsDialogVisible = false"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { notificationService } from "@/services/api/index";
import router from "@/routes";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import Tooltip from 'primevue/tooltip';

export default {
  name: 'Notifications',
  components: {
    DataTable,
    Column,
    Button,
    Card,
    Dialog,
    InputText,
    ProgressSpinner
  },
  directives: {
    tooltip: Tooltip
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      notifications: [],
      allNotifications: [],
      loading: false,
      globalFilter: '',
      filters: {},
      sortField: 'Date',
      sortOrder: -1,
      deleteDialogVisible: false,
      notificationToDelete: null,
      deleting: false,
      deletingId: null,
      settingsDialogVisible: false,
      dateFilter: 'all',
      rowsPerPage: 10
    };
  },
  methods: {
    async loadNotifications() {
      this.loading = true;
      try {
        const result = await notificationService.getNotifications();
        if (result.data) {
          // Store all notifications and apply filters
          this.allNotifications = Array.isArray(result.data) 
            ? result.data.reverse().filter(n => n) 
            : [];
          this.applyFilters();
        } else {
          console.error('Error fetching notifications:', result.error);
          this.allNotifications = [];
          this.notifications = [];
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.allNotifications = [];
        this.notifications = [];
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      let filtered = [...this.allNotifications];
      
      // Apply date filter
      if (this.dateFilter !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        if (this.dateFilter === '3months') {
          filterDate.setMonth(now.getMonth() - 3);
        } else if (this.dateFilter === '6months') {
          filterDate.setMonth(now.getMonth() - 6);
        }
        
        filtered = filtered.filter(notif => {
          const notifDate = new Date(notif.Date || notif.date);
          return notifDate >= filterDate;
        });
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        const aValue = a[this.sortField] || '';
        const bValue = b[this.sortField] || '';
        
        if (this.sortField === 'Date' || this.sortField === 'date') {
          return this.sortOrder === -1 
            ? new Date(bValue) - new Date(aValue)
            : new Date(aValue) - new Date(bValue);
        }
        
        return this.sortOrder === -1
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      });
      
      this.notifications = filtered;
    },
    setDateFilter(filter) {
      this.dateFilter = filter;
      this.applyFilters();
    },
    setRowsPerPage(rows) {
      this.rowsPerPage = rows;
    },
    applySettings() {
      this.applyFilters();
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          // Try parsing different formats
          return dateString;
        }
        return date.toLocaleString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return dateString;
      }
    },
    onRowClick(event) {
      if (event.data && event.data.Node) {
        this.viewNode(event.data.Node);
      }
    },
    viewNode(nodeId) {
      if (nodeId) {
        router.push(`/dashboard?id=${nodeId}`);
      }
    },
    deleteNotification(id, index) {
      if (!id) {
        console.error('No notification ID provided');
        return;
      }
      this.notificationToDelete = { id, index };
      this.deleteDialogVisible = true;
    },
    async confirmDelete() {
      if (!this.notificationToDelete || !this.notificationToDelete.id) {
        return;
      }
      
      this.deleting = true;
      this.deletingId = this.notificationToDelete.id;
      
      try {
        const result = await notificationService.deleteNotification(this.notificationToDelete.id);
        if (result.data) {
          // Remove from local array
          this.notifications = this.notifications.filter(
            n => n._id !== this.notificationToDelete.id
          );
          this.deleteDialogVisible = false;
          this.notificationToDelete = null;
          
          // Show success message
          this.toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Notification supprimée avec succès',
            life: 3000
          });
        } else {
          throw new Error(result.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message || 'Erreur lors de la suppression de la notification',
          life: 3000
        });
      } finally {
        this.deleting = false;
        this.deletingId = null;
      }
    }
  },
  async created() {
    await this.loadNotifications();
  }
};
</script>

<style scoped>
.notifications-page {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.header-content > div:first-child {
  flex: 1;
  text-align: center;
}

.settings-button {
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  padding: 0;
}

.settings-button:hover {
  background: #f8f9fa;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transform: rotate(90deg);
}

.settings-button i {
  font-size: 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.page-title i {
  color: #4CAF50;
  font-size: 2.2rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

.notifications-container {
  max-width: 1400px;
  margin: 0 auto;
}

.notifications-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
}

.loading-text {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.empty-state p {
  font-size: 1rem;
  color: #7f8c8d;
  margin: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding: 15px 0;
}

.header-left {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  max-width: 400px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-count {
  font-weight: 600;
  color: #2c3e50;
  padding: 8px 15px;
  background: #ecf0f1;
  border-radius: 20px;
  font-size: 0.9rem;
}

.notifications-table {
  width: 100%;
}

.notifications-table :deep(.p-datatable-thead > tr > th) {
  background-color: #4CAF50;
  color: white;
  font-weight: 600;
  padding: 15px;
  border: none;
}

.notifications-table :deep(.p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

.notifications-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: #f0f4f8;
  cursor: pointer;
}

.notifications-table :deep(.p-datatable-tbody > tr > td) {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.date-cell,
.node-cell,
.farmer-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-icon,
.node-icon,
.farmer-icon,
.duration-icon {
  color: #4CAF50;
  font-size: 1rem;
}

.node-id {
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Courier New', monospace;
}

.title-cell .title-text {
  font-weight: 500;
  color: #2c3e50;
}

.message-cell {
  color: #34495e;
  line-height: 1.5;
}

.duration-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.confirmation-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.confirmation-icon {
  font-size: 2rem;
  color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .notifications-page {
    padding: 15px;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
  }

  .header-content > div:first-child {
    text-align: center;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .page-title i {
    font-size: 1.6rem;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left,
  .header-right {
    width: 100%;
  }

  .search-input {
    max-width: 100%;
  }

  .notifications-table :deep(.p-datatable-thead > tr > th),
  .notifications-table :deep(.p-datatable-tbody > tr > td) {
    padding: 10px 8px;
    font-size: 0.9rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 10px;
  }

  .notification-count {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}

/* Settings Dialog Styles */
.settings-content {
  padding: 10px 0;
}

.setting-group {
  margin-bottom: 25px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.setting-label i {
  color: #4CAF50;
}

.period-buttons,
.rows-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-option input[type="radio"] {
  cursor: pointer;
}

.sort-option label {
  cursor: pointer;
  margin: 0;
  font-weight: 500;
  color: #34495e;
}

/* Print Styles */
@media print {
  .notifications-page {
    background: white;
  }

  .page-header,
  .table-header,
  .action-buttons,
  .settings-button {
    display: none;
  }
}
</style>