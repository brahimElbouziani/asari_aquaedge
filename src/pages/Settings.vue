<template>
  <div class="page-content">
    <div class="page-header">
      <h1>Paramètres</h1>
    </div>

    <Card>
      <template #header>
        <h3>Profil</h3>
      </template>
      <template #content>
        <div class="form-simple">
          <div class="form-row">
            <div class="form-field">
              <label>Nom</label>
              <InputText v-model="profile.name" />
            </div>
            <div class="form-field">
              <label>Email</label>
              <InputText v-model="profile.email" type="email" />
            </div>
          </div>
          <Button label="Enregistrer" class="p-button-success" @click="save" />
        </div>
      </template>
    </Card>

    <Card>
      <template #header>
        <h3>Notifications</h3>
      </template>
      <template #content>
        <div class="form-simple">
          <div class="switch-item">
            <InputSwitch v-model="notifications.email" inputId="email" />
            <label for="email">Email</label>
          </div>
          <div class="switch-item">
            <InputSwitch v-model="notifications.sms" inputId="sms" />
            <label for="sms">SMS</label>
          </div>
          <Button label="Enregistrer" class="p-button-success" @click="save" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

export default {
  name: 'Settings',
  components: { Card, InputText, InputSwitch, Button },
  setup() {
    const toast = useToast();
    
    const profile = ref({ name: 'John Doe', email: 'john@example.com' });
    const notifications = ref({ email: true, sms: false });

    const save = () => {
      toast.add({ severity: 'success', summary: 'Enregistré', life: 3000 });
    };

    return { profile, notifications, save };
  }
};
</script>

<style scoped>
.page-content {
  padding: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #1a1a1a;
}

.card {
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.form-simple {
  padding: 1rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.switch-item label {
  margin: 0;
  cursor: pointer;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
