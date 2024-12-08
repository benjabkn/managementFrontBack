<template>
  <div>
    <h2>Crear Reserva</h2>

    <form @submit.prevent="makeReservation">
      <div>
        <label for="name">Nombre:</label>
        <input type="text" v-model="reservation.name" id="name" required />
      </div>

      <div>
        <label for="zone">Zona:</label>
        <select v-model="reservation.zone" id="zone" required>
          <option v-for="zone in zones" :key="zone._id" :value="zone._id">
            {{ zone.description }}

          </option>
        </select>
      </div>

      <div>
        <label for="numberOfPeople">Número de personas:</label>
        <input type="number" v-model="reservation.numberOfPeople" id="numberOfPeople" required />
      </div>

      <div>
        <label for="startDate">Fecha de inicio:</label>
        <input type="date" v-model="reservation.startDate" id="startDate" required />
      </div>

      <div>
        <label for="startTime">Hora de inicio:</label>
        <select v-model="reservation.startTime" id="startTime" required @change="updateEndDate">
          <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
        </select>
      </div>

      <div>
        <label for="endTime">Hora de fin:</label>
        <!-- Usamos una función para mostrar la fecha en el formato correcto -->
        <input type="text" :value="(reservation.endDate)" id="endTime" disabled />
      </div>

      <div>
        <label for="tableId">Mesa:</label>
        <select v-model="reservation.tableId" id="tableId" required>
          <option v-for="table in availableTables" :key="table._id" :value="table._id">
            Mesa {{ table.tableNumber }} (Capacidad: {{ table.ability }} personas)
          </option>
        </select>
      </div>

      <button type="submit">Reservar</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>

    <h2>Lista de Reservas</h2>
    <table class="reservation-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Zona</th>
          <th>Mesa</th>
          <th>Fecha de Inicio</th>
          <th>Fecha de Fin</th>
          <th>Número de Personas</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reservation, index) in reservations" :key="reservation._id">
          <td>{{ index + 1 }}</td>
          <td>{{ reservation.name }}</td>
          <td>{{ reservation.zone?.name || 'Zona no asignada' }}</td>
          <td>
            Mesa {{ reservation.tableId?.tableNumber || 'N/A' }}
            Cantidad de personas: {{ reservation.tableId?.ability || 'N/A' }}
          </td>
          <td>{{ formatDate(reservation.startDate) }}</td>
          <td>{{ formatDate(reservation.endDate) }}</td>
          <td>{{ reservation.numberOfPeople }}</td>
          <td>
            <button @click="deleteReservation(reservation._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      reservation: {
        name: '',
        zone: '',
        numberOfPeople: 1,
        startDate: '',  // Fecha de inicio completa (YYYY-MM-DD)
        startTime: '',  // Hora de inicio (HH:mm)
        endDate: '',  // Fecha de fin completa
        tableId: ''
      },
      reservations: [],  // Lista de reservas
      availableTables: [], // Mesas disponibles
      zones: [], // Zonas disponibles
      availableTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'], // Horas predefinidas
      errorMessage: '',
      successMessage: ''
    };
  },
  created() {
    this.fetchReservations();
    this.fetchZones();
    this.fetchAvailableTables();
  },
  watch: {
    // Cuando la fecha de inicio cambia, actualizamos la fecha de fin
    'reservation.startDate': function (newStartDate) {
      this.updateEndDate();
    },
    'reservation.startTime': function () {
      this.updateEndDate();
    }
  },
  methods: {
    // Obtener las reservas desde la API
    async fetchReservations() {
      try {
        const response = await axios.get('http://localhost:3003/api/reservation/');
        this.reservations = response.data;
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        this.errorMessage = 'No se pudieron obtener las reservas.';
      }
    },

    // Obtener las zonas desde la API
    async fetchZones() {
      try {
        const response = await axios.get('http://localhost:3003/api/zones/');
        this.zones = response.data;
      } catch (error) {
        console.error('Error al obtener las zonas:', error);
        this.errorMessage = 'No se pudieron obtener las zonas.';
      }
    },

    // Obtener las mesas disponibles desde la API
    async fetchAvailableTables() {
      try {
        const response = await axios.get('http://localhost:3003/api/tables/');
        this.availableTables = response.data;
      } catch (error) {
        console.error('Error al obtener las mesas disponibles:', error);
        this.errorMessage = 'No se pudieron obtener las mesas disponibles.';
      }
    },

    // Eliminar una reserva
    async deleteReservation(id) {
      try {
        await axios.delete(`http://localhost:3003/api/reservation/${id}`);

        // Actualiza la lista de reservas después de eliminar
        this.reservations = this.reservations.filter(reservation => reservation._id !== id);

        this.successMessage = 'Reserva eliminada con éxito.';
        this.errorMessage = ''; // Limpia cualquier mensaje de error previo
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        this.successMessage = '';
        this.errorMessage = 'No se pudo eliminar la reserva. Intenta nuevamente.';
      }
    },

    // Actualiza la fecha de fin automáticamente (2 horas después de la fecha de inicio)
    updateEndDate() {
      if (this.reservation.startDate && this.reservation.startTime) {
        const startDateTime = new Date(`${this.reservation.startDate}T${this.reservation.startTime}:00`);
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + 2); // Agregar 2 horas

        // Actualizar la fecha de fin
        this.reservation.endDate = endDateTime

      }
    },

    // Crear la reserva
    async makeReservation() {
      try {
        const reservationData = {
          name: this.reservation.name,
          zone: this.reservation.zone,
          numberOfPeople: this.reservation.numberOfPeople,
          startDate: new Date(`${this.reservation.startDate}T${this.reservation.startTime}:00`).toISOString(),
          endDate: new Date(this.reservation.endDate),
          tableId: this.reservation.tableId
        };
        console.log(reservationData.endDate)

        const response = await axios.post('http://localhost:3003/api/reservation/', reservationData);

        this.successMessage = 'Reserva realizada con éxito.';
        this.errorMessage = '';
        this.reservation = {}; // Reseteamos el formulario
        this.fetchReservations(); // Recargamos las reservas
      } catch (error) {
        console.error('Error al hacer la reserva:', error);
        this.successMessage = '';
        this.errorMessage = 'No se pudo realizar la reserva. Mesa y horario ocupado.';
      }
    },

    // Formatear la fecha en formato legible para mostrarla en la lista de reservas
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString('es-MX', options);
    }
  }
};
</script>

<style scoped>
/* Estilos generales */
h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Tabla */
.reservation-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.reservation-table thead {
  background-color: #f4f4f4;
}

.reservation-table th,
.reservation-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.reservation-table th {
  background-color: #f1f1f1;
  font-weight: 600;
}

/* Estilos para las filas */
.reservation-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.reservation-table tr:hover {
  background-color: #f1f1f1;
}

/* Estilos de la columna de la fecha */
.reservation-table td:nth-child(5),
.reservation-table td:nth-child(6) {
  text-align: center;
}

/* Botón de eliminar */
.reservation-table td button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.reservation-table td button:hover {
  background-color: #c0392b;
}

/* Mensaje de error */
.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

/* Mensaje de éxito */
.success {
  color: green;
  font-weight: bold;
  margin-top: 20px;
}
</style>