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
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 shadow-lg rounded-2xl border border-slate-200/50 dark:border-slate-700/50 mb-6 hover-lift relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
      
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold uppercase text-white shadow-md flex-shrink-0">
          {user.name?.[0] || user.username?.[0] || "U"}
        </div>
        <div className="flex-1">
          <textarea
            className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition-all duration-200 rounded-xl p-4 outline-none min-h-[120px] resize-none text-[15px] font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="What's happening? Share event details…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <span className="px-4 py-2.5 rounded-xl border-2 border-emerald-200 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/40 dark:hover:to-emerald-700/40 transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105">
                Attach image
              </span>
              {imageFile && (
                <span className="text-slate-600 truncate max-w-[200px] font-medium text-sm">
                  {imageFile.name}
                </span>
              )}
            </label>

            <button
              onClick={submit}
              disabled={loading || !description.trim()}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-gray-800 px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-60 hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                "Post Event"
              )}
            </button>
          </div>

          {previewUrl && (
            <div className="mt-4 rounded-xl overflow-hidden border-2 border-slate-200 shadow-md">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-80 object-cover"
              />
            </div>
          )}

          {error && (
            <div className="mt-3 bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-2.5 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
