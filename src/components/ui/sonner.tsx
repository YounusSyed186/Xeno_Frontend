import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/95 group-[.toaster]:text-white group-[.toaster]:border-white/15 group-[.toaster]:backdrop-blur-xl group-[.toaster]:shadow-[0_10px_35px_rgba(0,0,0,0.9)] group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-zinc-400",
          actionButton: "group-[.toast]:bg-[#5ef046] group-[.toast]:text-black group-[.toast]:font-bold",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-zinc-300",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
