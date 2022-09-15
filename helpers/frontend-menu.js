exports.getMenuFrontend = (role) => {
    const menu = [
        {
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Main', url: '/' },
                { title: 'ProgressBar', url: 'progress' },
                { title: 'Charts', url: 'chart' },
                { title: 'Promesas', url: 'promesas' },
                { title: 'Rxjs', url: 'rxjs' },
            ]
        },
        {
            title: 'Maintenance',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                // { title: 'Users', url: 'users' },
                { title: 'Hospitals', url: 'hospitals' },
                { title: 'Medics', url: 'medics' },
            ]
        }
    ];

    if (role === 'ADMIN_USER') {
        menu[1].submenu.unshift({ title: 'Users', url: 'users' });
    }

    return menu;
}