import { BackofficeSidebar } from "@/components/backoffice/sidebar"

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <BackofficeSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
