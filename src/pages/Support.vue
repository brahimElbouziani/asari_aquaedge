<template>
  <div class="page-content">
    <div class="page-header">
      <h1>Support</h1>
    </div>

    <Card>
      <template #header>
        <h3>FAQ</h3>
      </template>
      <template #content>
        <Accordion>
          <AccordionTab header="Comment ajouter un capteur ?">
            <p>Allez dans la section "Capteurs" et cliquez sur "Ajouter un capteur".</p>
          </AccordionTab>
          <AccordionTab header="Comment configurer les alertes ?">
            <p>Rendez-vous dans "Paramètres" > "Notifications" pour configurer vos alertes.</p>
          </AccordionTab>
          <AccordionTab header="Mon capteur est hors ligne">
            <p>Vérifiez la connexion internet et l'alimentation du capteur.</p>
          </AccordionTab>
        </Accordion>
      </template>
    </Card>

    <Card>
      <template #header>
        <h3>Contact</h3>
      </template>
      <template #content>
        <div class="form-simple">
          <div class="form-field">
            <label>Email</label>
            <InputText v-model="contact.email" />
          </div>
          <div class="form-field">
            <label>Message</label>
            <Textarea v-model="contact.message" rows="4" />
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
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

export default {
  name: 'Support',
  components: { Card, Accordion, AccordionTab, InputText, Textarea, Button },
  setup() {
    const toast = useToast();
    const contact = ref({ email: '', message: '' });

    const send = () => {
      toast.add({ severity: 'success', summary: 'Message envoyé', life: 3000 });
      contact.value = { email: '', message: '' };
    };

    return { contact, send };
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
