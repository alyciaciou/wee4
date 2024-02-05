const { createApp, ref } = Vue
const app = createApp({
  setup() {
    const user = ref({
    username: '',
      password: '',
    });

    const login = () => {
      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      console.log(user.value)
      axios.post(api, user.value)
        .then((response) => {
            console.log(response)
          const { token, expired } = response.data;
          document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
          window.location = 'product.html';
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    };

    return {
      user,
      login,
    };
  },
})
app.mount('#app');