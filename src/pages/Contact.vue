<template>
  <div class="page-content">
    <div class="page-header">
      <h1>Contact</h1>
    </div>

    <Card>
      <template #content>
        <div class="form-simple">
          <div class="form-field">
            <label>Nom</label>
            <InputText v-model="form.name" />
          </div>
          <div class="form-field">
            <label>Email</label>
            <InputText v-model="form.email" type="email" />
          </div>
          <div class="form-field">
            <label>Sujet</label>
            <Dropdown v-model="form.subject" :options="subjects" />
          </div>
          <div class="form-field">
            <label>Message</label>
            <Textarea v-model="form.message" rows="5" />
          </div>
          <Button label="Envoyer" class="p-button-success" @click="send" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

export default {
  name: 'Contact',
  components: { Card, InputText, Textarea, Dropdown, Button },
  setup() {
    const toast = useToast();
    const form = ref({ name: '', email: '', subject: null, message: '' });
    const subjects = ['Support', 'Technique', 'Facturation', 'Autre'];

    const send = () => {
      toast.add({ severity: 'success', summary: 'Message envoyé', life: 3000 });
      form.value = { name: '', email: '', subject: null, message: '' };
    };

    return { form, subjects, send };
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

.form-simple {
  padding: 1rem 0;
}

.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }
}
</style>
