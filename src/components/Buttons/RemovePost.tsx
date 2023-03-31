import { useUser } from '@/utils/swr';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, IconButton } from '@mui/material';
import { useRouter } from 'next/router';

type Props = {
    postId: string;
    authorId: string;
    icon?: boolean;
};

export default function RemovePostButton({ postId, authorId, icon = true }: Props) {
    const router = useRouter();
    const { user, accessToken } = useUser();

    // проверяем наличие пользователя и его полномочия на удаление поста
    if (!user || user.id !== authorId) return null;

    const removePost = async () => {
        try {
            // сообщаем серверу о необходимости удаления поста
            await fetch(`/api/post?id=${postId}`, {
                method: 'DELETE',
                headers: {
                    // роут является защищенным
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // выполняем перенаправление на страницу блога
            router.push('/posts');
        } catch (e: unknown) {
            console.error(e);
        }
    };

    return icon ? (
        <IconButton
            onClick={removePost}
            color='error'
        >
            <DeleteOutlineIcon />
        </IconButton>
    ) : (
        <Button
            variant='contained'
            color='error'
            onClick={removePost}
        >
            Remove
        </Button>
    );
}
