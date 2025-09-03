import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GradientAccents from '@/components/Gradient'
import GridPattern from '@/components/GridPattern'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/Sidebar"
// import SidebarLayout from '@/components/sidebar.jsx'; 

export default function PageLayout({ children }) {
  return (
    <>

      <GradientAccents />
      <GridPattern />
      <Navbar />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-130px)]">
        {/* <SidebarLayout> */}
          {children}
        {/* </SidebarLayout> */}
      </main>
      <Footer />
    </>
  )
}