import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'Ui Components',
    divider: true
  },
  {
    displayName: 'Crafts',
    iconName: 'solar:tablet-line-duotone',
    //crear componente - catalogo
    route: '/ui-components/crafts',
  },
  {
    displayName: 'Areas',
    iconName: 'solar:tablet-line-duotone',
    //New Catalog
    route: '/ui-components/areas',
  },
  {
    displayName: 'Customers',
    iconName: 'solar:tablet-line-duotone',
    //New Catalog
    route: '/ui-components/customers',
  },
  {
    navCap: 'Auth',
    divider: true
  },
  {
    displayName: 'Login',
    iconName: 'solar:login-3-line-duotone',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'solar:user-plus-rounded-line-duotone',
    route: '/authentication/register',
  },
];
