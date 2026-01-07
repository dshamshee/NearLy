import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Contact, MapPin, StarIcon } from "lucide-react"

export const RecentProfessionals = ({name, avatar, experience, location, rating}: {name: string, avatar: string, experience: number, location: number, rating: number})=>{

    return(
        <div className="mainContainer">
            <div className="flex flex-col gap-6">
      <Item variant="muted" className="h-[150px]">
        <ItemContent>
          <div className="flex items-center gap-4">
            <div className="avatar w-20 h-20">
            <Avatar className="w-full h-full">
        <AvatarImage className="object-cover" src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
            </div>
            <div className="details">
            <ItemTitle className="">{name}</ItemTitle>
          <div className="text-sm  grid grid-cols-3 gap-5 mt-2 text-gray-500"   >
            <div className="flex flex-col items-center gap-2"> <Contact className="size-4 text-green-500" /> {experience} Yrs</div>
            <div className="flex flex-col items-center gap-2"> <MapPin className="size-4 text-blue-500" /> {location}KM</div>
            <div className="flex flex-col items-center gap-2"> <StarIcon className="size-4 text-yellow-500" /> {rating}</div>
          </div>

       
            </div>
          </div>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Book Again
          </Button>
        </ItemActions>
      </Item>
    </div>
        </div>
    )
}