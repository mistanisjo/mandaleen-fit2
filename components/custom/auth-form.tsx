import { Mail, Lock } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-6 px-4 sm:px-16"> {/* Increased gap for better spacing */}
      <div className="flex flex-col gap-4"> {/* Increased gap for better spacing */}
        <div>
          <Label
            htmlFor="email"
            className="text-zinc-600 font-normal dark:text-zinc-400 mb-1 block" // Added mb-1 and block
          >
            عنوان البريد الإلكتروني
          </Label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              name="email"
              className="bg-muted text-md md:text-sm border-none rounded-md pl-10 pr-3 py-2.5 w-full focus-visible:ring-1 focus-visible:ring-ring" // Added rounded-md, pl-10, py-2.5, w-full and focus style
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              defaultValue={defaultEmail}
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-zinc-600 font-normal dark:text-zinc-400 mb-1 block" // Added mb-1 and block
          >
            كلمة المرور
          </Label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              name="password"
              className="bg-muted text-md md:text-sm border-none rounded-md pl-10 pr-3 py-2.5 w-full focus-visible:ring-1 focus-visible:ring-ring" // Added rounded-md, pl-10, py-2.5, w-full and focus style
              type="password"
              required
            />
          </div>
        </div>
      </div>

      {children}
    </form>
  );
}
