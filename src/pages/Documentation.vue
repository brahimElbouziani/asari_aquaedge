<template>
  <div class="page-content">
    <div class="page-header">
      <h1>Documentation</h1>
    </div>

    <Card>
      <template #header>
        <h3>Guide d'utilisation</h3>
      </template>
      <template #content>
        <Accordion>
          <AccordionTab header="Premiers pas">
            <p>Créez votre compte et configurez vos préférences dans les paramètres.</p>
          </AccordionTab>
          <AccordionTab header="Ajouter un capteur">
            <p>Allez dans "Capteurs" > "Ajouter un capteur" et suivez les instructions.</p>
          </AccordionTab>
          <AccordionTab header="Configurer les alertes">
            <p>Dans "Paramètres" > "Notifications", définissez vos seuils d'alerte.</p>
          </AccordionTab>
          <AccordionTab header="Exporter les données">
            <p>Utilisez le bouton "Exporter" dans la section "Analyses".</p>
          </AccordionTab>
        </Accordion>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from 'primevue/card';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

export default {
  name: 'Documentation',
  components: { Card, Accordion, AccordionTab }
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

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }
}
</style>
