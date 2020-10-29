export function initialize(store, router, axios) {
  console.log('BASE URL', process.env.VUE_APP_API_URL)
    router.beforeEach((to, from, next) => {
      window.document.title = to.meta && to.meta.title ? to.meta.title : 'StackPoint';
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
        const token = store.state.auth.token;
    
        // if(currentUser){
        //     Echo.connector.pusher.config.auth.headers['Authorization'] = `Bearer ${store.getters.currentUser.token}`
        // }

        if(token){
            axios.defaults.headers.common["Authorization"] = `Bearer ${store.state.auth.token}` 
        }

        if (requiresAuth && !token) {
            next('/');
        } else if (to.path == '/' && token) {
                next('/dashboard');
        }
         else {
            next();
        }

        switch( to.meta.permission ){
            case 'denied':
             if( !token ){
                next();
              }else{
                next('/dashboard');
              }
            break;

            case 'CASHIER':
             if( store.getters.currentUser.user_type == 'CASHIER' ){
                next();
              }else{
                next('/dashboard');
              }
            break;

            case 'STOREADMIN':
              if( store.getters.currentUser.user_type == 'STOREADMIN' ){
                next();
              }else{
                next('/dashboard');
              }
            break;
        }
    })



    axios.interceptors.response.use(null, (error) => {
        if (error.response.status == 401) {
            store.commit('destroyToken');
            router.push('/');
            //NProgress.done();
        }

        return Promise.reject(error);
    })
}