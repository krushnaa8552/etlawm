ALTER TABLE orders
ADD COLUMN razorpay_order_id VARCHAR(100),
ADD COLUMN razorpay_payment_id VARCHAR(100),
ADD COLUMN paid_at TIMESTAMPTZ;