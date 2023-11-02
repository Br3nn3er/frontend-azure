import { Icon, Text, Link } from '@chakra-ui/react';
import { FC } from 'react';

import { ActiveLink } from '@components/ActiveLink';

import { Props } from './types';

const NavLink: FC<Props> = ({
  href,
  icon,
  children,
  shouldMatchExactHref = true,
  ...rest
}) => (
  <ActiveLink href={href} passHref shouldMatchExactHref={shouldMatchExactHref}>
    <Link align="center" display="flex" {...rest}>
      <Icon as={icon} fontSize="20" />

      <Text ml="4" fontWeight="medium">
        {children}
      </Text>
    </Link>
  </ActiveLink>
);

export { NavLink };
