import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import dummy from "../../assets/dummy.pdf"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/DialogPortal"
import { Book, Atom, FlaskRoundIcon as Flask, Dna, Code, BookOpen, Download } from "lucide-react"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"

const materials = [
  {
    title: "Material Topic Here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
    link: "/materials/math",
    icon: Book,
    fileUrl: dummy,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
  },
  {
    title: "Material Topic Here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
    link: "/materials/math",
    icon: Book,
    fileUrl: dummy,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
  },
  {
    title: "Material Topic Here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
    link: "/materials/math",
    icon: Book,
    fileUrl: dummy,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
  },
  {
    title: "Material Topic Here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
    link: "/materials/math",
    icon: Book,
    fileUrl: dummy,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
  },
  {
    title: "Material Topic Here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
    link: "/materials/math",
    icon: Book,
    fileUrl: dummy,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
  },
  {
    title: "Material Topic Here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
    link: "/materials/math",
    icon: Book,
    fileUrl: dummy,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
  },
]

export default function StudyMaterialPage() {
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  const handleDownload = (fileUrl) => {
    // Implement download logic here
    window.open(fileUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Study Materials</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((item, index) => (
            <Card key={index} className="bg-[#27272a] border-zinc-700 hover:bg-zinc-700 transition-colors duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-zinc-400 mb-4">{item.description}</CardDescription>
                <div className="flex justify-between items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-blue-400 cursor-pointer sm:text-sm md:text-[16px] hover:text-blue-300 transition-colors duration-300"
                        onClick={() => setSelectedMaterial(item)}
                      >
                        Explore
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#27272a] text-white">
                      <DialogHeader>
                        <DialogTitle>{selectedMaterial?.title}</DialogTitle>
                        <DialogDescription className="text-zinc-400">{selectedMaterial?.details}</DialogDescription>
                      </DialogHeader>
                      <Button onClick={() => handleDownload(selectedMaterial?.fileUrl)} className="mt-4 cursor-pointer ">
                        <Download className="mr-2 h-4 w-4 " /> Download Materials
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button className="outline-white cursor-pointer  text-white" onClick={() => handleDownload(item.fileUrl)} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4 text-white" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
           {/* <Footer /> */}
    </div>
  )
}

