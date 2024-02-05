const { createApp, ref, onMounted } = Vue

let productModal
let delProductModal

const app = createApp({
  setup() {
    const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
    const apiPath = 'liquor_store';
    
    const products = ref([]);
    const tempProduct = ref({ imagesUrl: [] });
    const pagination = ref({});
    const isNew = ref(false);

    const checkUser = () => {
      axios.post( `${apiUrl}/api/user/check`)
        .then(() => {
          getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'index.html';
        });
    };

    const getData = (page = 1) => {

      axios.get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`)
        .then((response) => {
          products.value = response.data.products;
          console.log(response)
          pagination.value = response.data.pagination;
        }).catch((err) => {
          alert(err.response.data.message);
          window.location = 'index.html';
        });
    };

    const openModal = (type, item) => {
      switch (type) {
        case 'new':
          tempProduct.value = { imagesUrl: [] }
          isNew.value = true
          productModal.show()
          break
      
        case 'edit':
          tempProduct.value = { ...item }
          isNew.value = false
          productModal.show()
          break
        
        case 'delete':
          tempProduct.value = { ...item }
          delProductModal.show()
          break
      }
    };

    onMounted(() => {

      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if(token === ''){
        window.location = 'index.html';
      }else{
        axios.defaults.headers.common.Authorization = token;
      checkUser();
      }
      
    });

    return {
      products,
      tempProduct,
      pagination,
      isNew,
      getData,
      openModal,
    };
  },
});


app.component('pagination', {
  template: '#pagination',
  props: ['pages'],
  setup(props, { emit }) {
    const emitPages = (item) => {
      emit('emit-pages', item);
    };

    return {
      emitPages,
    };
  }
});

app.component('productModal', {
  template: '#productModal',
  props: ['isNew', 'product'],
  setup(props, { emit }) {
    const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
    const apiPath = 'liquor_store';

    const updateProduct = () => {
      let api = `${apiUrl}/api/${apiPath}/admin/product`;
      let httpMethod = 'post';

      if (!props.isNew) {
        api = `${apiUrl}/api/${apiPath}/admin/product/${props.product.id}`;
        httpMethod = 'put';
      }

      axios[httpMethod](api, { data: props.product })
        .then((response) => {
          alert(response.data.message);
          productModal.hide();
          emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const createImages = () => {
      props.product.imagesUrl = [];
      props.product.imagesUrl.push('');
    };

    onMounted(() => {
      productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
        keyboard: false,
        backdrop: 'static',
      });
    });

    return {
      updateProduct,
      createImages,
    };
  },
});

app.component('delProductModal', {
  template: '#delProductModal',
  props: ['item'],
  setup(props, { emit }) {
    const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
    const apiPath = 'liquor_store';

    const delProduct = () => {
      axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${props.item.id}`)
        .then(() => {
          emit('update');
          delProductModal.hide();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const openModal = () => {
      delProductModal.show();
    };

    onMounted(() => {
      delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
        keyboard: false,
        backdrop: 'static',
      });
    });

    return {
      delProduct,
      openModal,
    };
  },
});

app.mount('#app');