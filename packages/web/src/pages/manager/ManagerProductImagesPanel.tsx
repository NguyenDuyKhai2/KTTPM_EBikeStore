import { useEffect, useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { adminProductImageAPI, type AdminProductImage } from "@ebike/shared-code/api";

type ManagerProductImagesPanelProps = {
  productId: number;
  productName: string;
};

const ManagerProductImagesPanel = ({ productId, productName }: ManagerProductImagesPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadImages = async () => {
    try {
      setLoading(true);
      setImages(await adminProductImageAPI.list(productId));
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải ảnh sản phẩm.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadImages();
  }, [productId]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    setUploading(true);
    setMessage("");
    setError("");
    try {
      for (let index = 0; index < files.length; index += 1) {
        await adminProductImageAPI.upload(productId, files[index], {
          primaryImage: images.length === 0 && index === 0,
          sortOrder: images.length + index
        });
      }
      await loadImages();
      setMessage(`Đã tải lên ${files.length} ảnh cho ${productName}.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload ảnh thất bại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      await adminProductImageAPI.setPrimary(imageId);
      await loadImages();
      setMessage("Đã đặt ảnh đại diện.");
    } catch (primaryError) {
      setError(primaryError instanceof Error ? primaryError.message : "Không thể đặt ảnh đại diện.");
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!window.confirm("Xóa ảnh này khỏi sản phẩm?")) {
      return;
    }
    try {
      await adminProductImageAPI.delete(imageId);
      await loadImages();
      setMessage("Đã xóa ảnh.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa ảnh.");
    }
  };

  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-950">Quản lý hình ảnh</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003b93] px-3 py-2 text-xs font-semibold text-white hover:bg-[#002f75] disabled:opacity-60"
        >
          <ImagePlus className="h-4 w-4" />
          {uploading ? "Đang tải..." : "Thêm ảnh"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void handleUpload(event.target.files)}
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Đang tải ảnh...</p>
      ) : images.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Chưa có ảnh quản lý qua hệ thống. Hãy upload ảnh mới.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img src={image.imageUrl} alt={image.altText || productName} className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-2">
                <button
                  type="button"
                  title="Đặt làm ảnh đại diện"
                  onClick={() => void handleSetPrimary(image.id)}
                  className={`rounded p-1 ${image.primaryImage ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
                >
                  <Star className="h-4 w-4" fill={image.primaryImage ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  title="Xóa ảnh"
                  onClick={() => void handleDelete(image.id)}
                  className="rounded p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerProductImagesPanel;
