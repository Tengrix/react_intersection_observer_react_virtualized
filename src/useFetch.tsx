import {useEffect, useState} from 'react';
import axios from "axios";
type ResponseType = {
    data:AlbumType[]
}
export type AlbumType = {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

interface State {
    albums: AlbumType[]
    isLoading: boolean
    isError: Error | null
}

const UseFetch = (url: string, _page: number):State => {
    const [albums, setAlbums] = useState<AlbumType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isError, setIsError] = useState(null)

    useEffect(() => {
        const getPosts = async () => {
            try {
                const posts = await axios.get<void, ResponseType>(url, {
                    params: {
                        _page,
                        _limit: 20
                    }
                })
                setAlbums(posts.data)
                setIsLoading(false)
            } catch (e) {
                setIsError(e as any)
            }
        }
        getPosts()
    }, [url, _page])
    return {albums, isLoading, isError};
};

export default UseFetch;
