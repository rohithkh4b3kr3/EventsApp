import { useContext, useMemo, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ""), [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const submit = async () => {
    if (!description.trim()) {
      setError("Please add a short description for your event.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await axios.post("/post/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDescription("");
      setImageFile(null);
      onPostCreated?.();
    } catch (err) {
      setError(err.friendlyMessage || "Could not post right now.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-4 shadow-sm rounded-xl border border-slate-100 mb-6">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold uppercase">
          {user.name?.[0] || user.username?.[0] || "U"}
        </div>
        <div className="flex-1">
          <textarea
            className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition rounded-lg p-3 outline-none min-h-[90px] resize-none"
            placeholder="Share event details…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-emerald-700 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <span className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50">
                Attach image
              </span>
              {imageFile && <span className="text-slate-500 truncate max-w-[180px]">{imageFile.name}</span>}
            </label>

            <button
              onClick={submit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              {loading ? "Posting..." : "Post update"}
            </button>
          </div>

          {previewUrl && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-lg border border-slate-100 max-h-64 object-cover w-full"
              />
            </div>
          )}

          {error && <p className="text-sm text-rose-600 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
