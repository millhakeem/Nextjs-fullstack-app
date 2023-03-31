import { useUser } from '@/utils/swr';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Badge, IconButton } from '@mui/material';
import type { Like, Post } from '@prisma/client';
import { useRouter } from 'next/router';

type Props = {
    post: Omit<Post, 'createdAt' | 'updatedAt'> & {
        likes: Like[];
        createdAt: string;
    };
};

export default function LikePostButton({ post }: Props) {
    const router = useRouter();
    const { user, accessToken } = useUser();
    if (!user) return null;
    // определяем, лайкал ли пользователь этот пост
    const like = post.likes.find((l) => l.userId === user.id);
    const isLiked = Boolean(like);

    // если пользователь лайкал пост, удаляем лайк
    // если нет, создаем лайк
    // оба роута являются защищенными
    const likePost = async () => {
        let res: Response;
        try {
            if (isLiked) {
                res = await fetch(`/api/like?likeId=${like?.id}&postId=${post.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else {
                res = await fetch('/api/like', {
                    method: 'POST',
                    body: JSON.stringify({ postId: post.id }),
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
            if (!res.ok) throw res;
            // перезагружаем страницу для повторного вызова `getServerSideProps`
            router.push(router.asPath);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Badge
            badgeContent={post.likes.length}
            color='error'
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <IconButton onClick={likePost}>
                {isLiked ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon />}
            </IconButton>
        </Badge>
    );
}
