import MenuIcon from '@mui/icons-material/Menu';
import { Box, Drawer, List, ListItem, ListItemButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import ActiveLink from '../ActiveLink';
import ProfileButton from '../Buttons/Profile';
import type { PageLinks } from '../Header';

type Props = {
    links: PageLinks;
};

export default function MobileMenu({ links }: Props) {
    const theme = useTheme();
    // ссылка на якорь для меню
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    // индикатор открытости меню
    const open = Boolean(anchorEl);

    // метод для открытия меню
    const openMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(e.currentTarget);
    };

    // метод для закрытия меню
    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            // управляем видимостью элемента на основе ширины экрана
            sx={{ display: { xs: 'flex', sm: 'none' } }}
            alignItems='center'
            justifyContent='space-between'
        >
            <ListItemButton
                id='menu-button'
                sx={{ borderRadius: '50%', px: theme.spacing(1) }}
                aria-controls={open ? 'mobile-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={openMenu}
            >
                <MenuIcon />
            </ListItemButton>
            <Drawer
                anchor='left'
                open={open}
                onClose={closeMenu}
                id='mobile-menu'
            >
                <List sx={{ minWidth: '128px' }}>
                    {links.map((link, i) => (
                        <ListItem
                            onClick={closeMenu}
                            key={i}
                            sx={{ justifyContent: 'center' }}
                        >
                            <ActiveLink
                                href={link.href}
                                activeClassName='current'
                            >
                                {link.title}
                            </ActiveLink>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <ProfileButton />
        </Box>
    );
}
