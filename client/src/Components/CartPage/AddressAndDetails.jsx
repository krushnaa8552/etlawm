import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAddresses,
  getPincodeDetails,
} from "../../services/addressService";
import {
  ArrowLeft,
  Home,
  MapPin,
  Phone,
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
  const [localities, setLocalities] = useState([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const lastCheckedPincodeRef = useRef("");

  useEffect(() => {
    async function loadSavedAddresses() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getAddresses();

        if (res?.success) {
          const addresses = res.addresses || [];
          setSavedAddresses(addresses);

          const defaultAddress = addresses.find(
            (address) => address.is_default,
          );

          if (defaultAddress) {
            selectAddress(defaultAddress);
          }
        }
      } catch (err) {
        console.error("Failed to load saved addresses in cart:", err);
      }
    }

    loadSavedAddresses();
  }, []);

  useEffect(() => {
    const pincode = String(addressDetails.pincode || "").trim();

    if (pincode.length !== 6) {
      lastCheckedPincodeRef.current = "";
      setLocalities([]);
      setPincodeError("");
      setPincodeLoading(false);
      return;
    }

    if (lastCheckedPincodeRef.current === pincode) {
      return;
    }

    lastCheckedPincodeRef.current = pincode;

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setPincodeLoading(true);
        setPincodeError("");

        const data = await getPincodeDetails(pincode);

        if (cancelled) return;

        const localityOptions = data.localities || [];

        setLocalities(localityOptions);

        if (!data.isDeliverable) {
          setPincodeError("This PIN code is not marked as deliverable.");

          setAddressDetails((current) => {
            if (String(current.pincode || "").trim() !== pincode) {
              return current;
            }

            return {
              ...current,
              city: data.district || "",
              state: data.state || "",
              locality: localityOptions[0]?.name || "",
              pincodeVerified: false,
            };
          });

          return;
        }

        setAddressDetails((current) => {
          if (String(current.pincode || "").trim() !== pincode) {
            return current;
          }

          return {
            ...current,
            city: data.district || "",
            state: data.state || "",
            locality: current.locality || localityOptions[0]?.name || "",
            pincodeVerified: true,
          };
        });
      } catch (error) {
        if (cancelled) return;

        setLocalities([]);
        setPincodeError(error.message || "Invalid PIN code.");

        setAddressDetails((current) => {
          if (String(current.pincode || "").trim() !== pincode) {
            return current;
          }

          return {
            ...current,
            city: "",
            state: "",
            locality: "",
            pincodeVerified: false,
          };
        });
      } finally {
        if (!cancelled) {
          setPincodeLoading(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [addressDetails.pincode, setAddressDetails]);

  function selectAddress(address) {
    const savedPincode = String(address.pincode || "").trim();

    lastCheckedPincodeRef.current = savedPincode;

    setSelectedAddressId(address.id);
    setPincodeError("");
    setLocalities([]);
    setPincodeLoading(false);

    setAddressDetails((current) => ({
      ...current,
      addressLine: address.line1 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: savedPincode,
      locality: address.locality || "",
      pincodeVerified: true,
      fullName:
        current.fullName ||
        (user
          ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
          : ""),
      phoneNumber:
        current.phoneNumber || (user ? user.phone_number || "" : ""),
    }));
  }

  function updateField(name, value) {
    setSelectedAddressId("");

    if (name === "pincode") {
      const nextPincode = value.replace(/\D/g, "").slice(0, 6);

      lastCheckedPincodeRef.current = "";

      setAddressDetails((current) => ({
        ...current,
        pincode: nextPincode,
        city: "",
        state: "",
        locality: "",
        pincodeVerified: false,
      }));

      setLocalities([]);
      setPincodeError("");
      setPincodeLoading(false);

      return;
    }

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
          <div
            className="mb-6 rounded-2xl border bg-white p-4"
            style={{ borderColor: colours.border }}
          >
            <label
              className="mb-2 block text-sm font-semibold"
              style={{
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              Select from saved addresses
            </label>

            <select
              value={selectedAddressId}
              onChange={(event) => {
                const address = savedAddresses.find(
                  (item) => String(item.id) === String(event.target.value),
                );

                if (address) {
                  selectAddress(address);
                }
              }}
              className="h-12 w-full rounded-xl border bg-neutral-50 px-4 text-sm outline-none"
              style={{
                borderColor: colours.border,
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              <option value="">-- Select a saved address --</option>

              {savedAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.line1}, {address.city}, {address.state} -{" "}
                  {address.pincode}
                  {address.is_default ? " (Default)" : ""}
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

          <div>
            <InputField
              icon={<MapPin size={16} />}
              label="PIN code"
              name="pincode"
              value={addressDetails.pincode}
              placeholder="Enter 6-digit PIN code"
              onChange={updateField}
              inputMode="numeric"
              required
            />

            {pincodeLoading && (
              <p
                className="mt-2 text-xs"
                style={{
                  color: colours.mutedText,
                  fontFamily: fonts.secondary,
                }}
              >
                Checking PIN code...
              </p>
            )}

            {pincodeError && (
              <p
                className="mt-2 text-xs"
                style={{
                  color: "#b91c1c",
                  fontFamily: fonts.secondary,
                }}
              >
                {pincodeError}
              </p>
            )}

            {addressDetails.pincodeVerified && !pincodeError && (
              <p
                className="mt-2 text-xs"
                style={{
                  color: "#047857",
                  fontFamily: fonts.secondary,
                }}
              >
                PIN code verified.
              </p>
            )}
          </div>

          <InputField
            icon={<Home size={16} />}
            label="House / flat / building"
            name="addressLine"
            value={addressDetails.addressLine}
            placeholder="House no, building, street"
            onChange={updateField}
            required
          />

          <label className="block">
            <span
              className="mb-2 block text-sm font-semibold"
              style={{
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              Locality
            </span>

            <select
              value={addressDetails.locality || ""}
              onChange={(event) => updateField("locality", event.target.value)}
              disabled={localities.length === 0}
              className="h-12 w-full rounded-xl border bg-transparent px-4 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                borderColor: colours.border,
                color: colours.text,
                fontFamily: fonts.secondary,
              }}
            >
              <option value="">
                {localities.length === 0
                  ? "Enter PIN code first"
                  : "Select locality"}
              </option>

              {localities.map((locality) => (
                <option key={locality.name} value={locality.name}>
                  {locality.name}
                </option>
              ))}
            </select>
          </label>

          <InputField
            label="City / district"
            name="city"
            value={addressDetails.city}
            placeholder="Autofilled from PIN code"
            onChange={updateField}
            readOnly
            required
          />

          <InputField
            label="State"
            name="state"
            value={addressDetails.state}
            placeholder="Autofilled from PIN code"
            onChange={updateField}
            readOnly
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
            onChange={(event) => updateField("orderNotes", event.target.value)}
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
  inputMode,
  readOnly = false,
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
          backgroundColor: readOnly ? "rgba(0,0,0,0.03)" : "transparent",
        }}
      >
        {icon && <span className="opacity-45">{icon}</span>}

        <input
          value={value || ""}
          onChange={(event) => onChange(name, event.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          readOnly={readOnly}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none read-only:cursor-not-allowed"
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