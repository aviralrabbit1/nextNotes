tailwind.config = {
    theme: {
        extend: {
            colors: {
                white: 'var(--bg-white)',
                primary: 'var(--bg-primary)',
                secondary: 'var(--bg-secondary)',
                text: {
                    primary: 'var(--color-primary)',
                    header: 'var(--color-header)'
                },
                border: 'var(--color-border)',
                form: 'var(--bg-form)',
                accent: 'var(--bg-accent)'
            },
            backgroundColor: {
                primary: 'var(--bg-primary)',
                secondary: 'var(--bg-secondary)',
                form: 'var(--bg-form)',
                accent: 'var(--bg-accent)'
            },
            borderColor: {
                primary: 'var(--color-border)'
            },
            textColor: {
                primary: 'var(--color-primary)',
                header: 'var(--color-header)'
            }
        }
    }
}