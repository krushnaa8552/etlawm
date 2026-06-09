import db from "../pgdb.js";

const upsertReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;

  if (!product_id || !rating) {
    return res
      .status(400)
      .json({
        success: false,
        message: "product_id and rating are required.",
      });
  }
  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5." });
  }

  try {
    const {
      rows: [review],
    } = await db.reviews.upsert({ user_id: req.user.id, product_id, rating, comment });
    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error("[upsert review]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { rows: reviews } = await db.reviews.findByProduct(
      req.params.product_id,
    );
    const {
      rows: [rating],
    } = await db.reviews.avgRating(req.params.product_id);
    res.json({ success: true, reviews, ...rating });
  } catch (err) {
    console.error("[get reviews]", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const deleteReview = async (req, res) => {
  const { product_id } = req.params;

  try {
    await db.reviews.delete(req.user.id, product_id);

    return res.json({
      success: true,
      message: "Review deleted.",
    });
  } catch (err) {
    console.error("[delete review]", err);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export { upsertReview, getProductReviews, deleteReview };
