import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAddresses } from "../../services/addressService";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { colours, fonts } from "../../theme/theme";

function AddressAndDetails({
  addressDetails,
  setAddressDetails,
  isComplete,
  onBack,
  onContinue,
}) {
  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    async function loadSavedAddresses() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getAddresses();
        if (res && res.success) {
          setSavedAddresses(res.addresses || []);
          const def = (res.addresses || []).find(a => a.is_default);
          if (def) {
            selectAddress(def);
          }
        }
      } catch (err) {
        console.error("Failed to load saved addresses in cart:", err);
      }
    }
    loadSavedAddresses();
  }, []);

  function selectAddress(addr) {
    setSelectedAddressId(addr.id);
    setAddressDetails(current => ({
      ...current,
      addressLine: addr.line1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      fullName: current.fullName || (user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : ""),
      phoneNumber: current.phoneNumber || (user ? user.phone_number || "" : ""),
    }));
  }

  function updateField(name, value) {
    setAddressDetails((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isComplete) return;

    onContinue();
  }

  return (
    <section className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: colours.text,
              fontFamily: fonts.primary,
            }}
          >
            Address and details
          </h2>

          <p
            className="mt-1 text-sm opacity-55"
            style={{
              color: colours.text,
              fontFamily: fonts.secondary,
            }}
          >
            Add the delivery address for the selected cart items.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 text-sm font-semibold opacity-60 transition-opacity hover:opacity-100"
          style={{
            color: colours.text,
            fontFamily: fonts.secondary,
          }}
        >
          <ArrowLeft size={16} />
          Back to cart
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: colours.border,
          backgroundColor: colours.background,
        }}
      >
        {savedAddresses.length > 0 && (
          <div className="mb-6 rounded-2xl border p-4 bg-white" style={{ borderColor: colours.border }}>
            <label className="block mb-2 text-sm font-semibold" style={{ color: colours.text, fontFamily: fonts.secondary }}>
              Select from Saved Addresses
            </label>
            <select
              value={selectedAddressId}
              onChange={(e) => {
                const addr = savedAddresses.find(a => a.id === e.target.value);
                if (addr) selectAddress(addr);
              }}
              className="h-12 w-full rounded-xl border bg-neutral-50 px-4 text-sm outline-none"
              style={{
                borderColor: colours.border,
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              <option value="" disabled>-- Select a saved address --</option>
              {savedAddresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.line1}, {addr.city}, {addr.state} - {addr.pincode} {addr.is_default ? " (Default)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            icon={<User size={16} />}
            label="Full name"
            name="fullName"
            value={addressDetails.fullName}
            placeholder="Enter full name"
            onChange={updateField}
            required
          />

          <InputField
            icon={<Phone size={16} />}
            label="Phone number"
            name="phoneNumber"
            value={addressDetails.phoneNumber}
            placeholder="Enter phone number"
            onChange={updateField}
            required
          />

          <InputField
            icon={<MapPin size={16} />}
            label="Pincode"
            name="pincode"
            value={addressDetails.pincode}
            placeholder="Enter pincode"
            onChange={updateField}
            required
          />

          <InputField
            icon={<Home size={16} />}
            label="House / flat / building"
            name="addressLine"
            value={addressDetails.addressLine}
            placeholder="House no, building, street"
            onChange={updateField}
            required
          />

          <InputField
            label="City"
            name="city"
            value={addressDetails.city}
            placeholder="Enter city"
            onChange={updateField}
            required
          />

          <InputField
            label="State"
            name="state"
            value={addressDetails.state}
            placeholder="Enter state"
            onChange={updateField}
            required
          />

          <InputField
            label="Landmark"
            name="landmark"
            value={addressDetails.landmark}
            placeholder="Nearby landmark"
            onChange={updateField}
          />

          <label className="block">
            <span
              className="mb-2 block text-sm font-semibold"
              style={{
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              Delivery type
            </span>

            <select
              value={addressDetails.deliveryType}
              onChange={(event) =>
                updateField("deliveryType", event.target.value)
              }
              className="h-12 w-full rounded-xl border bg-transparent px-4 text-sm outline-none"
              style={{
                borderColor: colours.border,
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              <option value="standard">Standard delivery</option>
              <option value="express">Express delivery</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span
            className="mb-2 block text-sm font-semibold"
            style={{
              color: colours.text,
              fontFamily: fonts.secondary,
            }}
          >
            Order notes
          </span>

          <textarea
            value={addressDetails.orderNotes}
            onChange={(event) =>
              updateField("orderNotes", event.target.value)
            }
            rows={4}
            placeholder="Any delivery instructions"
            className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm outline-none"
            style={{
              borderColor: colours.border,
              color: colours.text,
              fontFamily: fonts.secondary,
            }}
          />
        </label>


      </form>
    </section>
  );
}

function InputField({
  icon,
  label,
  name,
  value,
  placeholder,
  onChange,
  required = false,
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block text-sm font-semibold"
        style={{
          color: colours.text,
          fontFamily: fonts.secondary,
        }}
      >
        {label}
        {required ? " *" : ""}
      </span>

      <div
        className="flex h-12 items-center gap-3 rounded-xl border px-4"
        style={{
          borderColor: colours.border,
        }}
      >
        {icon && <span className="opacity-45">{icon}</span>}

        <input
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          style={{
            color: colours.text,
            fontFamily: fonts.secondary,
          }}
        />
      </div>
    </label>
  );
}

export default AddressAndDetails;