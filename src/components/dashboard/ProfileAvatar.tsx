import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { User } from "lucide-react";

export function ProfileAvatar() {
  const {data: user} = useCurrentUser();
  const avatarSrc = user?.avatar || "https://github.com/shadcn.png";
  
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar>
        <AvatarImage className="object-cover" src={avatarSrc} alt={user?.fullName || "User"} />
        <AvatarFallback><User/></AvatarFallback>
      </Avatar>
    </div>
  )
}
