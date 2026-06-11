import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { colours, fonts } from "../../theme/theme";
import reviewService from "../../services/reviewService";

const getRelativeTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays >= 7) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  if (diffDays >= 1) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }

  if (diffHours >= 1) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  if (diffMinutes >= 1) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  }

  return "Just now";
};

const formatReview = (review) => {
  return {
    id: review.id,
    name: review.customer_name || review.user_name || "Customer",
    time: getRelativeTime(review.created_at),
    avatar:
      review.avatar_url ||
      review.image_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        review.customer_name || review.user_name || "Customer"
      )}&background=A77C6B&color=fff`,
    productName: review.product_name || review.productName || "Product",
    productLink: review.product_link || review.productLink || "#",
    text: review.review || review.comment || "",
    rating: Number(review.rating) || 5,
  };
};

const ReviewPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await reviewService.getPublicReviews();

        if (!isMounted) return;

        const formattedReviews = (data.reviews || []).map(formatReview);
        setReviews(formattedReviews);
      } catch (err) {
        if (!isMounted) return;

        setError(err.message || "Failed to load reviews");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section
        className="w-full overflow-hidden py-10"
        style={{
          backgroundColor: colours.primary,
        }}
      >
        <div className="mx-auto max-w-[90%] px-6 md:px-10">
          <p
            className="text-sm"
            style={{
              color: colours.mutedText,
              fontFamily: fonts.secondary,
            }}
          >
            Loading reviews...
          </p>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full overflow-hidden py-4"
      style={{
        backgroundColor: colours.primary,
      }}
    >
      <div className="mx-auto flex max-w-[90%] items-center gap-16 px-6 md:px-10">
        <div className="relative w-[260px] shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            className="absolute -left-12 -top-20 z-0 h-36 w-36 rotate-180 opacity-30"
            style={{
              color: colours.accent,
            }}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M267 205c-69.8 8.7-127.1 51.7-153 114.6-37 90.2 1.7 194.1 88.6 237.7 23.4 11.7 47.2 18.2 72.4 19.6l11.5.6-.3 5.5c-.9 17.2-8.6 50.3-17.6 76.7-7.9 22.8-14.9 39.1-28.8 66.8l-12 24 .4 9.1c.3 7.3.9 10.1 3.1 14.7 10 20.4 36 27.7 54.9 15.5 4.3-2.7 16.2-15.9 36.9-40.8 15.4-18.5 44.4-60 59.2-84.8 45.9-76.7 77.4-160.4 88.2-234.2 2.3-15.1 3-44.2 1.6-58-4.4-42.5-21.4-79.3-50.5-109.8-29-30.3-64-48.8-105.6-55.8-10.6-1.8-39-2.6-49-1.4m426 .1c-22.1 2.5-46.1 9.8-66.7 20.2-2.6 1.4-9.6 5.6-15.4 9.5-41.9 27.6-70.4 69.7-81.1 119.7-2.1 9.9-2.3 13.5-2.3 36 .1 27.4 1.1 34.6 7.6 56 16.4 53.3 57.3 97.3 109.7 117.9C664.3 572 687.9 577 705 577h8.3l-.7 7.9C711 604 705 630.2 696 657c-8 23.7-14.9 40-29.3 68.9l-12.2 24.4.1 7.6c0 9.3 2.1 15.9 7.2 22.6 13.1 17.4 38.7 20.4 54.7 6.4 5-4.4 25.3-28 38.7-45 61.9-78.7 109.7-173.6 131.8-261.8 13.3-53.2 16-91.7 8.9-126.5-6.4-31.7-21.7-62.4-43.1-86.6-39.7-44.9-100.8-68.6-159.8-61.9"
            />
          </svg>

          <h2
            className="relative z-10 max-w-[230px] text-4xl font-bold leading-tight"
            style={{
              color: colours.text,
              fontFamily: fonts.font2,
            }}
          >
            <p>What our</p>
            <p>customers say</p>
          </h2>
        </div>

        <div className="group relative flex-1 overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-[scroll_18s_linear_infinite] group-hover:[animation-play-state:paused]">
            <div className="flex gap-8 pr-8">
              {reviews.map((review) => (
                <ReviewCard key={`first-${review.id}`} review={review} />
              ))}
            </div>

            <div className="flex gap-8 pr-8">
              {reviews.map((review) => (
                <ReviewCard key={`second-${review.id}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewPanel;