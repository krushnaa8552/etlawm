import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItemsSection from "../Components/CartPage/CartItemsSection";
import CartSummary from "../Components/CartPage/CartSummary";
import {
  applyCartCoupon,
  getCart,
  removeCartCoupon,
  removeCartItem,
  removeSelectedCartItems,
  updateCartItemQuantity,
} from "../services/cartService";
import Navbar from "../Components/NavBar";
import { colours, fonts } from "../theme/theme";

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      setPageError("");

      const cart = await getCart();

      setItems(
        cart.items.map((item) => ({
          ...item,
          selected: item.selected ?? true,
        })),
      );

      setCoupon(cart.coupon);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items],
  );

  const selectedCount = selectedItems.length;

  const allSelected =
    items.length > 0 && selectedCount === items.length;

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [selectedItems],
  );

  /*
   * Prefer discount and delivery values returned by the backend.
   * This local calculation is only a frontend fallback.
   */
  const discount = useMemo(() => {
    if (!coupon) return 0;

    if (coupon.discountType === "percentage") {
      const calculated =
        subtotal * (Number(coupon.discountValue) / 100);

      return coupon.maxDiscount
        ? Math.min(calculated, Number(coupon.maxDiscount))
        : calculated;
    }

    return Math.min(
      Number(coupon.discountValue ?? coupon.discount ?? 0),
      subtotal,
    );
  }, [coupon, subtotal]);

  const deliveryCharge =
    selectedItems.length === 0 || subtotal >= 500 ? 0 : 50;

  const total = Math.max(
    subtotal - discount + deliveryCharge,
    0,
  );

  function toggleAllItems() {
    const nextSelected = !allSelected;

    setItems((currentItems) =>
      currentItems.map((item) => ({
        ...item,
        selected: nextSelected,
      })),
    );
  }

  function toggleItemSelected(cartItemId) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              selected: !item.selected,
            }
          : item,
      ),
    );
  }

  async function changeQuantity(item, nextQuantity) {
    if (nextQuantity < 1) {
      await handleRemoveItem(item.cartItemId);
      return;
    }
  
    if (item.stockQty > 0 && nextQuantity > item.stockQty) {
      return;
    }
  
    const previousItems = items;
  
    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.cartItemId === item.cartItemId
          ? {
              ...currentItem,
              quantity: nextQuantity,
            }
          : currentItem,
      ),
    );
  
    try {
      setUpdatingItemId(item.cartItemId);
  
      await updateCartItemQuantity(
        item.cartItemId,
        nextQuantity,
      );
  
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      setItems(previousItems);
      setPageError(error.message);
    } finally {
      setUpdatingItemId(null);
    }
  }

  function handleIncrease(item) {
    changeQuantity(item, item.quantity + 1);
  }

  function handleDecrease(item) {
    changeQuantity(item, item.quantity - 1);
  }

  async function handleRemoveItem(cartItemId) {
    const previousItems = items;
  
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.cartItemId !== cartItemId,
      ),
    );
  
    try {
      setUpdatingItemId(cartItemId);
  
      await removeCartItem(cartItemId);
  
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      setItems(previousItems);
      setPageError(error.message);
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function handleRemoveSelected() {
    const selectedIds = selectedItems.map(
      (item) => item.cartItemId,
    );
  
    if (selectedIds.length === 0) return;
  
    const previousItems = items;
  
    setItems((currentItems) =>
      currentItems.filter((item) => !item.selected),
    );
  
    try {
      await removeSelectedCartItems(selectedIds);
  
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      setItems(previousItems);
      setPageError(error.message);
    }
  }

  async function handleApplyCoupon(event) {
    event.preventDefault();

    const code = couponCode.trim();

    if (!code) return;

    try {
      setIsApplyingCoupon(true);
      setPageError("");

      const data = await applyCartCoupon(code);

      setCoupon({
        code: data.coupon?.code ?? code.toUpperCase(),
        description: data.coupon?.description ?? "",
        discountType:
          data.coupon?.discount_type ??
          data.coupon?.discountType ??
          "fixed",
        discountValue:
          data.coupon?.discount_value ??
          data.coupon?.discountValue ??
          data.discount ??
          0,
        maxDiscount:
          data.coupon?.max_discount ??
          data.coupon?.maxDiscount ??
          null,
      });

      setCouponCode("");
    } catch (error) {
      setPageError(error.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  async function handleRemoveCoupon() {
    try {
      await removeCartCoupon();
      setCoupon(null);
    } catch (error) {
      setPageError(error.message);
    }
  }

  function handleCheckout() {
    /*
     * Saving selected IDs allows the checkout page to know which
     * cart items the user chose.
     *
     * A better final implementation is to create a checkout session
     * through the backend and navigate with the returned session ID.
     */
    sessionStorage.setItem(
      "checkoutCartItemIds",
      JSON.stringify(
        selectedItems.map((item) => item.cartItemId),
      ),
    );

    navigate("/checkout/address");
  }

  if (loading) {
    return <CartSkeleton />;
  }

  return (
    <div>
      <Navbar />
      <main
        className="min-h-screen px-4 pt-28 pb-8 sm:px-6 lg:px-10 lg:pt-32 lg:pb-12"
        style={{
          backgroundColor: colours.subBackground,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <p
              className="mb-2 text-sm font-medium uppercase tracking-[0.14em]"
              style={{
                color: colours.accent,
                fontFamily: fonts.secondary,
              }}
            >
              Shopping bag
            </p>
  
            <h1
              className="text-3xl font-semibold sm:text-4xl"
              style={{
                color: colours.text,
                fontFamily: fonts.primary,
              }}
            >
              Your cart
            </h1>
  
            <p
              className="mt-2 text-sm opacity-55"
              style={{
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              Review your products before proceeding to checkout.
            </p>
          </header>
  
          {pageError && (
            <div
              className="mb-5 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: colours.accent,
                color: colours.text,
                backgroundColor: colours.background,
                fontFamily: fonts.secondary,
              }}
            >
              {pageError}
            </div>
          )}
  
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] xl:gap-12">
            <CartItemsSection
              items={items}
              selectedCount={selectedCount}
              allSelected={allSelected}
              updatingItemId={updatingItemId}
              onToggleAll={toggleAllItems}
              onToggleSelected={toggleItemSelected}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemoveItem}
              onRemoveSelected={handleRemoveSelected}
            />
  
            <CartSummary
              selectedItems={selectedItems}
              coupon={coupon}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              subtotal={subtotal}
              discount={discount}
              deliveryCharge={deliveryCharge}
              total={total}
              isApplyingCoupon={isApplyingCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function CartSkeleton() {
  return (
    <main
      className="min-h-screen animate-pulse px-4 py-10 sm:px-6 lg:px-10"
      style={{
        backgroundColor: colours.primary,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-3 h-4 w-28 rounded"
          style={{ backgroundColor: colours.border }}
        />
        <div
          className="mb-10 h-10 w-52 rounded"
          style={{ backgroundColor: colours.border }}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          <div
            className="h-[560px] rounded-2xl"
            style={{ backgroundColor: colours.border }}
          />

          <div
            className="h-[420px] rounded-2xl"
            style={{ backgroundColor: colours.border }}
          />
        </div>
      </div>
    </main>
  );
}

export default Cart;