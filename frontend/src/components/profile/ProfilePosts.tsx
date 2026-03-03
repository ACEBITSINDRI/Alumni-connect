import React, { useState, useEffect } from 'react';
import { getPosts, type Post } from '../../services/post.service';
import PostCard from '../dashboard/PostCard';
import { Loader2 } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface ProfilePostsProps {
    userId: string;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ userId }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchPosts = async (pageNum: number, isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setLoadingMore(true);
            setError(null);

            // Call getPosts with authorId = userId
            const response = await getPosts(pageNum, 10, 'all', userId);

            if (response.success && response.data) {
                if (isInitial) {
                    setPosts(response.data.posts);
                } else {
                    setPosts(prev => [...prev, ...response.data!.posts]);
                }
                setHasMore(response.data.page < response.data.pages);
            } else {
                setError(response.message || 'Failed to load posts');
            }
        } catch (err: any) {
            console.error('Error fetching user posts:', err);
            setError(err.response?.data?.message || err.message || 'Error connecting to the server. Please try again.');
        } finally {
            if (isInitial) setLoading(false);
            else setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchPosts(1, true);
            setPage(1);
        }
    }, [userId]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    if (loading) {
        return (
            <Card variant="elevated" className="p-12 flex justify-center items-center border border-neutral-100">
                <Loader2 className="animate-spin text-primary-600" size={36} />
            </Card>
        );
    }

    if (error) {
        return (
            <Card variant="elevated" className="p-8 text-center bg-red-50 border-red-100">
                <h3 className="text-lg font-medium text-red-800 mb-2">Could not load posts</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button variant="outline" onClick={() => fetchPosts(1, true)}>Try Again</Button>
            </Card>
        );
    }

    if (posts.length === 0) {
        return (
            <Card variant="elevated" className="p-12 text-center border border-neutral-100">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No posts yet</h3>
                <p className="text-neutral-500">This user hasn't shared any content or opportunities yet.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <PostCard
                    key={post._id}
                    post={post as any}
                />
            ))}

            {hasMore && (
                <div className="flex justify-center pt-4 mb-8">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700"
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : 'Load More Posts'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProfilePosts;
