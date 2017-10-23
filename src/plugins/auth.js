import store from '@/store'

/**
 * Auth popup window
 * @type {string}
 */
export const AUTH_POPUP_URL = process.env.API_ROOT + '/auth/twitter'

/**
 * Auth refresh endpoint
 * @type {string}
 */
export const AUTH_REFRESH_URL = process.env.API_ROOT + '/auth/refresh'

/**
 * JWT referesh offset
 *
 * Ammount of time before JWT expiry to consider attempting a token refresh
 *
 * @type {number}
 */
export const JWT_REFRESH_OFFSET = 60000 // 1min

/**
 * Popup social authentication
 *
 * @return {Promise}
 */
export const authenticate = (() => {
  let _authenticatePromise = null

  return http => {
    if (_authenticatePromise) {
      return _authenticatePromise
    }

    let popup = null
    let popupClosedInterval = null

    _authenticatePromise = new Promise((resolve, reject) => {
      window.addEventListener(
        'message',
        function onmessage(event) {
          if (event.origin !== process.env.API_ROOT) {
            return
          }

          const data = JSON.parse(event.data)

          window.removeEventListener('message', onmessage, false)
          clearInterval(popupClosedInterval)

          if (popup && !popup.closed) {
            popup.close()
          }

          if (data.failure || !data.success) {
            return reject(data.failure || new Error('Authentication Failed'))
          }

          store
            .dispatch('setToken', { token: data.success })
            .then(user => resolve(user))
        },
        false
      )

      popup = window.open(
        AUTH_POPUP_URL,
        null,
        'menubar=no,resizable=no,width=500,height=500,scrollbars=yes'
      )

      popupClosedInterval = setInterval(() => {
        if (popup && popup.closed) {
          return reject(new Error('Popup closed without auth.'))
        }
      }, 500)
    })

    return _authenticatePromise
  }
})()

export const authPlugin = {
  authenticate,

  /**
   * Install the Auth class.
   *
   * Creates a Vue-Resource http interceptor to handle automatically adding auth
   * headers and refreshing tokens. Then attaches this object to the global Vue
   * (as Vue.auth).
   *
   * @param  {Object} Vue The global Vue.
   * @param  {Object} options Any options we want to have in our plugin.
   * @return {void}
   */
  install(Vue, options) {
    Vue.http.interceptors.push((request, next) => {
      const jwt = store.getters.jwt
      if (!jwt || request.url === 'auth/refresh') {
        return next()
      }

      if (jwt.exp * 1000 - JWT_REFRESH_OFFSET < Date.now()) {
        return Vue.http
          .get('auth/refresh')
          .then(response => response.json())
          .then(({ token }) =>
            store.dispatch('setToken', { token, skipFetchUser: true })
          )
          .then(() => next(), () => next())
      }

      if (jwt.exp * 1000 <= Date.now()) {
        return store
          .dispatch('setToken', { token: null, skipFetchUser: true })
          .then(() => next(), () => next())
      }

      next()
    })

    Vue.http.interceptors.push((request, next) => {
      const token = store.state.auth.token
      const hasAuthHeader = request.headers.has('Authorization')

      if (token && !hasAuthHeader) {
        this.setAuthHeader(request)
      }

      next(response => {
        if (response.status === 401) {
          return this.authenticate(Vue.http).then(() => Vue.http(request))
        }
      })
    })

    Vue.prototype.$auth = Vue.auth = this

    if (store.getters.jwt) {
      const timeout =
        store.getters.jwt.exp * 1000 - JWT_REFRESH_OFFSET - Date.now()
      console.log('auto token refresh in %dms', timeout)
      return setTimeout(
        () =>
          Vue.http
            .get('auth/refresh')
            .then(response => response.json())
            .then(({ token }) =>
              store.dispatch('setToken', {
                token,
                skipFetchUser: true
              })
            ),
        timeout
      )
    }
  },

  /**
   * Set the Authorization header on a Vue-Resource Request.
   *
   * @param  {Request} request The Vue-Resource Request instance to set the header on.
   * @return {void}
   */
  setAuthHeader(request) {
    request.headers.set('Authorization', `Bearer ${store.state.auth.token}`)
  }
}

export default authPlugin
