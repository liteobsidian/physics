import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    defaults: {
        VTooltip: {
            openDelay: 100,
            closeDelay: 0,
            transition: 'fade-transition',
            contentClass: 'custom-tooltip',
        },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#4285F4', // Google Blue - дружелюбный синий
                    secondary: '#0F9D58', // Google Green - приятный зеленый
                    accent: '#DB4437', // Google Red - акцентный красный
                    error: '#FF5252',
                    info: '#42A5F5',
                    success: '#4CAF50',
                    warning: '#FFC107',
                    background: '#FFFFFF',
                },
            },
        },
    },
})
