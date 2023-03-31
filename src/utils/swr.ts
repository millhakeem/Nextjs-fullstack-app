import type { User } from '@prisma/client';
import useSWRImmutable from 'swr/immutable';

async function fetcher<T>(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<T> {
    return fetch(input, init).then((res) => res.json());
}

// запрос на получение данных пользователя выполняется один раз
export function useUser() {
    // утилита возвращает данные пользователя и токен доступа, ошибку и
    // функцию инвалидации кэша (метод для мутирования данных, хранящихся в кэше)
    const { data, error, mutate } = useSWRImmutable<any>(
        '/api/auth/user',
        (url) => fetcher(url, { credentials: 'include' }),
        {
            onErrorRetry(err, key, config, revalidate, revalidateOpts) {
                return false;
            },
        },
    );

    // `error` - обычная ошибка (необработанное исключение)
    // `data.message` - сообщение о кастомной ошибке, например:
    // res.status(404).json({ message: 'User not found' })
    if (error || data?.message) {
        console.log(error || data?.message);

        return {
            user: undefined,
            accessToken: undefined,
            mutate,
        };
    }

    return {
        user: data?.user as User,
        accessToken: data?.accessToken as string,
        mutate,
    };
}
