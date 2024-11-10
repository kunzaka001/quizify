import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Image from "next/image"
import quizifyLogo from "../assets/q.png"
 
export default function HomeCard() {
  return (
    <Card className="w-[450px] h-[600px]">
      <CardHeader>
        <CardTitle>Select Mode!</CardTitle>
        <CardDescription>Just test your knowledge. No competitive</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              {/*Insert Something Here*/}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full">Deploy</Button>
      </CardFooter>
    </Card>
  )
}