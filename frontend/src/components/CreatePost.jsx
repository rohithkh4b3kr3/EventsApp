import { useContext, useMemo, useState, useEffect } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrls = useMemo(() => {
    return imageFiles.map(file => URL.createObjectURL(file));
  }, [imageFiles]);

  // Cleanup preview URLs when component unmounts or imageFiles change
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }
    
    // Filter valid image files
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setError("Please select only image files");
      return;
    }

    setImageFiles(prev => {
      const combined = [...prev, ...validFiles];
      if (combined.length > 10) {
        setError("Maximum 10 images allowed");
        return prev;
      }
      setError("");
      return combined;
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revoke URL for removed file
      URL.revokeObjectURL(previewUrls[index]);
      return newFiles;
    });
    setError("");
  };

  const submit = async () => {
    if (!description.trim()) {
      setError("Post cannot be empty");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      
      // Append all image files
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("/post/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setDescription("");
      setImageFiles([]);
      onPostCreated?.();
    } catch (err) {
      setError(err.response?.data?.msg || "Could not post right now.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="px-4 py-3">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white text-sm flex-shrink-0">
          {user.name?.[0] || user.username?.[0] || "U"}
        </div>
        <div className="flex-1">
          <textarea
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none resize-none text-[20px] leading-6 min-h-[120px]"
            placeholder="What's happening?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {previewUrls.length > 0 && (
            <div className="mb-3">
              <div className={`grid gap-2 ${
                previewUrls.length === 1 ? 'grid-cols-1' :
                previewUrls.length === 2 ? 'grid-cols-2' :
                previewUrls.length === 3 ? 'grid-cols-2' :
                previewUrls.length === 4 ? 'grid-cols-2' :
                'grid-cols-3'
              } rounded-2xl overflow-hidden`}>
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className={`w-full object-cover ${
                        previewUrls.length === 1 ? 'h-[400px]' :
                        previewUrls.length === 2 ? 'h-[300px]' :
                        'h-[200px]'
                      } border border-slate-200 dark:border-slate-800`}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {previewUrls.length < 10 && (
                <label className="inline-block mt-2 cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageChange} 
                  />
                  <span className="text-sm text-emerald-500 hover:text-emerald-600 font-medium">
                    Add more images
                  </span>
                </label>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={handleImageChange} 
              />
              <div className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/20 transition-colors group">
                <svg className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </label>

            <button
              onClick={submit}
              disabled={loading || !description.trim()}
              className="px-4 h-9 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors text-[15px]"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {error && (
            <div className="mt-3 text-red-500 text-sm font-medium">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
