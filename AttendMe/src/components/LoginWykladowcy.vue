<template>
    <div class="login-container">
      <h2>Panel Wykładowcy - Logowanie</h2>
      <!-- Formularz logowania -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Nazwa użytkownika:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Wpisz nazwę użytkownika"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Hasło:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Wpisz hasło"
            required
          />
        </div>
        <!-- Komunikat błędu -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit">Zaloguj</button>
      </form>
  
      <!-- Panel wykładowcy wyświetlany po poprawnym logowaniu -->
      <div v-if="isLogged" class="dashboard">
        <h3>Witamy, {{ username }}!</h3>
        <p>Jesteś zalogowany do panelu wykładowcy.</p>
        <!-- Tutaj możesz dodać dodatkowe elementy panelu -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Login",
    data() {
      return {
        username: "",
        password: "",
        error: "",
        isLogged: false // Flaga informująca, czy użytkownik jest zalogowany
      };
    },
    methods: {
      handleLogin() {
        // Prosta walidacja logowania – możesz ją rozbudować według potrzeb
        if (this.username === "wykladowca" && this.password === "1234") {
          this.error = "";
          this.isLogged = true;
        } else {
          this.error = "Nieprawidłowa nazwa użytkownika lub hasło.";
          this.isLogged = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    padding: 10px 15px;
    background-color: #428bca;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  
  button:hover {
    background-color: #3071a9;
  }
  
  .error-message {
    color: red;
    margin-bottom: 10px;
  }
  
  .dashboard {
    margin-top: 20px;
    padding: 15px;
    background-color: #f7f7f7;
    border-radius: 4px;
  }
  </style>
  