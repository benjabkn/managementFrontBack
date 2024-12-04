<template>
    <div>
        <vue-cal :events="events" :selected-date="selectedDate" :style="{ maxWidth: '900px', margin: '0 auto' }"
            @date-selected="handleDateSelected" />
    </div>

    <div>
        <h2>Lista de Citas</h2>
        <ul>
            <li v-for="appointment in appointments" :key="appointment._id" class="appointment-item">
                <div>
                    <strong>{{ appointment.title }}</strong>
                </div>
                <div>{{ appointment.description }}</div>
                <div>{{ formatDate(appointment.startDate) }} - {{ formatDate(appointment.endDate) }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import axios from 'axios';

export default {
    components: {
        VueCal
    },
    setup() {
        const events = ref([]);
        const selectedDate = ref(null);
        const appointments = ref([]); // Definir appointments como ref vacío

        // Cargar eventos desde la API
        const loadAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:3003/api/appointments');

                // Actualizar tanto 'events' para el calendario como 'appointments' para la lista
                appointments.value = response.data; // Guardamos todas las citas
                events.value = response.data.map(appointment => ({
                    title: appointment.title,
                    start: appointment.startDate,
                    end: appointment.endDate
                }));
            } catch (error) {
                console.error('Error al cargar las citas:', error);
            }
        };

        onMounted(() => {
            loadAppointments();
        });

        const handleDateSelected = (date) => {
            selectedDate.value = date;
            console.log('Fecha seleccionada:', date);
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        };

        return {
            events,
            selectedDate,
            appointments,
            handleDateSelected,
            formatDate
        };
    }
};
</script>
<style scoped>
.vuecal {
    max-width: 900px;
    margin: 0 auto;
}
</style>