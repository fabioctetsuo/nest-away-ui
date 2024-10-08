import Image from "next/image";
import { InputHTMLAttributes, ChangeEvent, useState } from "react";

type ImageFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const MAX_SIZE = 800 * 1024; // tamanho maximo de 300KB

export const ImageField = ({
  id,
  name,
  label,
  defaultValue,
}: ImageFieldProps) => {
  const [image, setImage] = useState<string | null | ArrayBuffer>(null);
  const [exceededMaxSize, setExceededMaxSize] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    setExceededMaxSize((file?.size as number) > MAX_SIZE);

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Image
        src={(image as string) ?? defaultValue ?? "/default-shadow-profile.jpg"}
        width={100}
        height={100}
        alt="Default Profile Picture"
        className="rounded-full relative object-cover w-24 h-24"
      />
      <label
        htmlFor={id}
        className="py-4 px-6 w-full border-none rounded-lg font-bold text-center cursor-pointer"
      >
        {label}
      </label>
      {exceededMaxSize && (
        <span className="text-red-500 text-xs">
          Essa imagem ultrapassa o tamanho maximo de 3MB
        </span>
      )}
      <input
        type="file"
        id={id}
        name={name}
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageField;
