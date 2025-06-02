import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  /* {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  }, */
  {
    navCap: 'Components',
    divider: true
  },
  {
    displayName: 'Crafts',
    iconName: 'solar:tablet-line-duotone',
    //crear componente - catalogo
    route: '/ui-components/crafts',
  },
  {
    displayName: 'Bid Submit', //Areas
    iconName: 'solar:card-line-duotone',
    //New Catalog
    route: '/ui-components/areas',
  },
  {
    displayName: 'Customers',
    iconName: 'solar:wallet-2-line-duotone',
    //New Catalog
    route: '/ui-components/customers',
  },
  {
    displayName: 'Projects',
    iconName: 'solar:waterdrops-line-duotone',
    //New Catalog
    route: '/ui-components/projects',
  },
  /* {
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
  }, */
];
