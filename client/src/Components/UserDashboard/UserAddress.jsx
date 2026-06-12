import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Check, CheckCircle } from "lucide-react";
import { colours, fonts } from "../../theme/theme";
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from "../../services/addressService";

const UserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { line1, city, state, pincode } = formData;
    if (!line1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setMsg({ type: "error", text: "All fields are required." });
      return;
    }
    
    try {
      setSaving(true);
      setMsg({ type: "", text: "" });
      const res = await addAddress(formData);
      if (res.success) {
        setFormData({ line1: "", city: "", state: "", pincode: "", is_default: false });
        setShowForm(false);
        setMsg({ type: "success", text: "Address added successfully." });
        loadAddresses();
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: err.message || "Failed to add address." });
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await setDefaultAddress(id);
      if (res.success) {
        loadAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await deleteAddress(id);
      if (res.success) {
        loadAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        <p className="text-xs text-stone-400 mt-2">Syncing addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium tracking-wide text-neutral-800" style={{ fontFamily: fonts.primary }}>
            Shipping Destinations
          </h2>
          <p className="text-xs text-stone-400 mt-1">Manage delivery addresses for checkout flows</p>
        </div>
        {addresses.length > 0 && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-md hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
            style={{ borderColor: colours.secondary, color: colours.secondary }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </button>
        )}
      </div>

      {msg.text && (
        <div 
          className={`p-3 rounded-lg text-xs font-semibold ${
            msg.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="bg-white border rounded-xl p-6 shadow-xs animate-in slide-in-from-top-4 duration-200 max-w-xl" style={{ borderColor: colours.border }}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 mb-4" style={{ fontFamily: fonts.primary }}>
            Add New Shipping Address
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Street Address / Line 1 *
              </label>
              <input
                type="text"
                required
                placeholder="Flat, House No, Building, Apartment, Road"
                value={formData.line1}
                onChange={e => setFormData({ ...formData, line1: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-xs focus:outline-hidden focus:border-stone-800 bg-neutral-50 transition-colors"
                style={{ borderColor: colours.border }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-xs focus:outline-hidden focus:border-stone-850 bg-neutral-50 transition-colors"
                  style={{ borderColor: colours.border }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-xs focus:outline-hidden focus:border-stone-850 bg-neutral-50 transition-colors"
                  style={{ borderColor: colours.border }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-xs focus:outline-hidden focus:border-stone-850 bg-neutral-50 transition-colors"
                  style={{ borderColor: colours.border }}
                />
              </div>
            </div>

            <label htmlFor="addr-default" className="flex items-center gap-2 cursor-pointer select-none mt-2">
              <div className="relative w-4 h-4">
                <input
                  id="addr-default"
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
                  className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-4 h-4 border rounded-sm bg-white peer-checked:border-stone-850 peer-checked:bg-stone-850 transition-all flex items-center justify-center"
                  style={{ borderColor: colours.border }}
                >
                  {formData.is_default && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </div>
              <span className="text-xs font-semibold text-neutral-800">
                Set as default billing and delivery address
              </span>
            </label>

            <div className="pt-4 flex items-center gap-3 border-t" style={{ borderColor: colours.border }}>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-[10px] font-bold tracking-widest uppercase text-white rounded-md cursor-pointer disabled:opacity-50 border-none"
                style={{ backgroundColor: colours.secondary }}
              >
                {saving ? "Adding Address..." : "Save Destination"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase border rounded-md bg-white hover:bg-neutral-100 cursor-pointer"
                style={{ borderColor: colours.border, color: colours.mutedText }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dotted empty box state if no addresses exist */}
      {addresses.length === 0 && !showForm ? (
        <div 
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed rounded-xl p-10 text-center bg-transparent hover:bg-white transition-all cursor-pointer flex flex-col items-center justify-center"
          style={{ borderColor: colours.border }}
        >
          <div className="w-10 h-10 rounded-full border flex items-center justify-center text-stone-400 mb-3" style={{ borderColor: colours.border }}>
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">No destinations saved</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm">Click here to add your first delivery address.</p>
        </div>
      ) : (
        /* Render address list */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {addresses.map(addr => (
            <div 
              key={addr.id}
              className="bg-white border rounded-xl p-5 shadow-xs relative flex flex-col justify-between hover:shadow-sm transition-shadow"
              style={{ borderColor: addr.is_default ? colours.accent : colours.border }}
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Destination</span>
                  {addr.is_default ? (
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border text-emerald-800 bg-emerald-50"
                      style={{ borderColor: '#a7e0a4' }}
                    >
                      Default
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-neutral-700 bg-transparent border-none cursor-pointer p-0 underline"
                    >
                      Make default
                    </button>
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-800 leading-normal mb-1">{addr.line1}</p>
                <p className="text-xs text-neutral-500 leading-normal">{addr.city}, {addr.state} - {addr.pincode}</p>
              </div>

              <div className="mt-6 flex justify-end border-t pt-3" style={{ borderTopColor: colours.border }}>
                <button 
                  onClick={() => handleDelete(addr.id)}
                  className="text-stone-400 hover:text-red-700 bg-transparent border-none cursor-pointer flex items-center gap-1 text-[11px] font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAddress;
